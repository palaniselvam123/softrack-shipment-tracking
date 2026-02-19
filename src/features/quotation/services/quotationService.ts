import { supabase } from '../../../lib/supabase';
import { Quotation, BookingFormData } from '../types/quotation';

const USD_TO_INR = 84;

function generateQuoteNo(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `QTE/${year}${month}/${seq}`;
}

function generateBookingNo(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `BKG/${year}${month}/${seq}`;
}

export async function saveQuotation(quotation: Quotation): Promise<{ quoteNo: string; id: string } | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const quoteNo = generateQuoteNo();

  const { data: qtData, error: qtError } = await supabase
    .from('quotations')
    .insert({
      quote_no: quoteNo,
      user_id: user.id,
      direction: quotation.schedule.direction,
      mode: quotation.schedule.mode,
      origin_port: quotation.schedule.originPort,
      origin_port_name: quotation.schedule.originPortName,
      destination_port: quotation.schedule.destinationPort,
      destination_port_name: quotation.schedule.destinationPortName,
      carrier_code: quotation.schedule.carrierCode,
      carrier_name: quotation.schedule.carrierName,
      schedule_ref: quotation.schedule.scheduleNo,
      vessel_name: quotation.schedule.vesselName,
      voyage_no: quotation.schedule.voyageNo || quotation.schedule.flightNo,
      etd: quotation.schedule.etd.toISOString().slice(0, 10),
      eta: quotation.schedule.eta.toISOString().slice(0, 10),
      transit_days: quotation.schedule.transitDays,
      is_direct: quotation.schedule.isDirect,
      incoterm: quotation.cargoDetails.incoterm,
      container_type: quotation.cargoDetails.containerType,
      quantity: quotation.cargoDetails.quantity,
      weight_kg: quotation.cargoDetails.weightKg,
      volume_cbm: quotation.cargoDetails.volumeCbm,
      commodity: quotation.cargoDetails.commodity,
      total_freight: quotation.totalFreight,
      total_surcharges: quotation.totalSurcharges,
      total_local_origin: quotation.totalLocalOrigin,
      total_local_destination: quotation.totalLocalDestination,
      total_amount_usd: quotation.totalAmountUsd,
      total_amount_inr: quotation.totalAmountUsd * USD_TO_INR,
      currency: 'USD',
      status: 'draft',
      valid_until: quotation.validUntil.toISOString().slice(0, 10),
    })
    .select('id, quote_no')
    .maybeSingle();

  if (qtError || !qtData) {
    console.error('Error saving quotation:', qtError);
    return null;
  }

  const chargeRows = quotation.charges.map(c => ({
    quotation_id: qtData.id,
    charge_type: c.type,
    charge_code: c.code,
    charge_name: c.name,
    quantity: c.quantity,
    unit_price: c.unitPrice,
    currency: c.currency,
    total: c.total,
    is_mandatory: c.isMandatory,
  }));

  if (chargeRows.length > 0) {
    await supabase.from('quotation_charges').insert(chargeRows);
  }

  return { quoteNo: qtData.quote_no, id: qtData.id };
}

export async function createBookingFromQuote(
  quotation: Quotation,
  bookingData: BookingFormData
): Promise<{ bookingNo: string } | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const quoteResult = await saveQuotation(quotation);
  if (!quoteResult) return null;

  const bookingNo = generateBookingNo();

  const { data, error } = await supabase
    .from('bookings_from_quotes')
    .insert({
      booking_no: bookingNo,
      quotation_id: quoteResult.id,
      user_id: user.id,
      shipper_name: bookingData.shipperName,
      shipper_address: `${bookingData.shipperAddress}, ${bookingData.shipperCity}`,
      shipper_contact: bookingData.shipperContact,
      shipper_email: bookingData.shipperEmail,
      consignee_name: bookingData.consigneeName,
      consignee_address: `${bookingData.consigneeAddress}, ${bookingData.consigneeCity}`,
      consignee_contact: bookingData.consigneeContact,
      consignee_email: bookingData.consigneeEmail,
      notify_party: bookingData.notifyParty,
      cargo_description: bookingData.cargoDescription,
      hs_code: bookingData.hsCode,
      marks_numbers: bookingData.marksNumbers,
      special_instructions: bookingData.specialInstructions,
      incoterm: bookingData.incoterm,
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
    })
    .select('booking_no')
    .maybeSingle();

  if (error || !data) {
    console.error('Error creating booking:', error);
    return null;
  }

  return { bookingNo: data.booking_no };
}

export async function getUserQuotations() {
  const { data, error } = await supabase
    .from('quotations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching quotations:', error);
    return [];
  }
  return data || [];
}
