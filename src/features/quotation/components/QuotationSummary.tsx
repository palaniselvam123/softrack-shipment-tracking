import React from 'react';
import { FileText, Ship, Plane, ArrowRight, Check, ChevronRight, Info } from 'lucide-react';
import { Quotation, QuotationCharge } from '../types/quotation';
import { USD_TO_INR } from '../data/charges';

interface QuotationSummaryProps {
  quotation: Quotation;
  onProceedToBook: () => void;
  onBack: () => void;
  saving?: boolean;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function convertToUsd(charge: QuotationCharge): number {
  return charge.currency === 'INR' ? charge.total / USD_TO_INR : charge.total;
}

const ChargeRow: React.FC<{ charge: QuotationCharge }> = ({ charge }) => {
  const usdAmount = convertToUsd(charge);
  const inrAmount = charge.currency === 'INR' ? charge.total : charge.total * USD_TO_INR;

  return (
    <tr className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors ${!charge.isMandatory ? 'opacity-75' : ''}`}>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{charge.code}</span>
          <span className="text-sm text-gray-800">{charge.name}</span>
          {!charge.isMandatory && (
            <span className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Optional</span>
          )}
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-gray-600 text-right">
        {charge.quantity.toFixed(2)} × {charge.currency} {charge.unitPrice.toFixed(2)}
      </td>
      <td className="py-3 px-4 text-sm font-semibold text-right">
        <div className="text-gray-900">USD {usdAmount.toFixed(2)}</div>
        <div className="text-xs text-gray-400">₹{inrAmount.toFixed(0)}</div>
      </td>
    </tr>
  );
};

const SectionHeader: React.FC<{ title: string; total: number; color: string }> = ({ title, total, color }) => (
  <tr className="bg-gray-50">
    <td colSpan={2} className={`py-2 px-4 text-xs font-bold uppercase tracking-wider ${color}`}>{title}</td>
    <td className={`py-2 px-4 text-sm font-bold text-right ${color}`}>USD {total.toFixed(2)}</td>
  </tr>
);

const QuotationSummary: React.FC<QuotationSummaryProps> = ({ quotation, onProceedToBook, onBack, saving }) => {
  const freightCharges = quotation.charges.filter(c => c.type === 'freight');
  const surcharges = quotation.charges.filter(c => c.type === 'surcharge');
  const localOrigin = quotation.charges.filter(c => c.type === 'local_origin');
  const localDest = quotation.charges.filter(c => c.type === 'local_destination');
  const isAir = quotation.schedule.mode === 'air';

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Freight Quotation</h3>
                <p className="text-slate-300 text-sm">Valid until {formatDate(quotation.validUntil)}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">{quotation.quoteNo}</div>
              <div className="text-white font-semibold text-sm mt-0.5">
                {formatDate(new Date(quotation.createdAt))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="p-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Route</div>
            <div className="flex items-center gap-2">
              <div className="text-center">
                <div className="font-bold text-gray-900">{quotation.schedule.originPort}</div>
                <div className="text-xs text-gray-500">{quotation.schedule.originPortName}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="text-center">
                <div className="font-bold text-gray-900">{quotation.schedule.destinationPort}</div>
                <div className="text-xs text-gray-500">{quotation.schedule.destinationPortName}</div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Schedule</div>
            <div className="flex items-center gap-2 mb-1">
              {isAir ? <Plane className="w-4 h-4 text-sky-600" /> : <Ship className="w-4 h-4 text-sky-600" />}
              <span className="font-semibold text-gray-900 text-sm">{quotation.schedule.carrierName}</span>
            </div>
            <div className="text-xs text-gray-500">
              ETD: <strong>{formatDate(quotation.schedule.etd)}</strong> · ETA: <strong>{formatDate(quotation.schedule.eta)}</strong>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Transit: <strong>{quotation.schedule.transitDays} days</strong> · {quotation.schedule.isDirect ? 'Direct' : `Via ${quotation.schedule.transitPortName}`}
            </div>
          </div>
          <div className="p-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Cargo</div>
            <div className="text-sm font-semibold text-gray-900">{quotation.cargoDetails.commodity}</div>
            <div className="text-xs text-gray-500 mt-1">
              {quotation.cargoDetails.containerType} × {quotation.cargoDetails.quantity}
              {quotation.cargoDetails.weightKg > 0 && ` · ${quotation.cargoDetails.weightKg.toLocaleString()} KG`}
              {quotation.cargoDetails.volumeCbm > 0 && ` · ${quotation.cargoDetails.volumeCbm} CBM`}
            </div>
            <div className="text-xs font-semibold text-sky-700 mt-1">Incoterm: {quotation.cargoDetails.incoterm}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h4 className="font-bold text-gray-900">Charge Breakdown</h4>
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            Exchange rate: 1 USD = ₹{USD_TO_INR}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Charge Description</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rate × Qty</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody>
              {freightCharges.length > 0 && (
                <>
                  <SectionHeader title={isAir ? "Air Freight" : "Ocean Freight"} total={quotation.totalFreight} color="text-sky-700" />
                  {freightCharges.map((c, i) => <ChargeRow key={i} charge={c} />)}
                </>
              )}
              {surcharges.length > 0 && (
                <>
                  <SectionHeader title="Surcharges" total={quotation.totalSurcharges} color="text-amber-700" />
                  {surcharges.map((c, i) => <ChargeRow key={i} charge={c} />)}
                </>
              )}
              {localOrigin.length > 0 && (
                <>
                  <SectionHeader title="Origin Local Charges" total={quotation.totalLocalOrigin} color="text-emerald-700" />
                  {localOrigin.map((c, i) => <ChargeRow key={i} charge={c} />)}
                </>
              )}
              {localDest.length > 0 && (
                <>
                  <SectionHeader title="Destination Local Charges" total={quotation.totalLocalDestination} color="text-rose-700" />
                  {localDest.map((c, i) => <ChargeRow key={i} charge={c} />)}
                </>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-sm">Total Estimated Cost</div>
              <div className="text-white text-3xl font-black mt-1">
                USD {quotation.totalAmountUsd.toFixed(2)}
              </div>
              <div className="text-slate-300 text-sm mt-0.5">
                ≈ ₹{quotation.totalAmountInr.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </div>
            </div>
            <div className="text-right text-xs text-slate-400 space-y-1">
              <div>Freight: USD {quotation.totalFreight.toFixed(2)}</div>
              <div>Surcharges: USD {quotation.totalSurcharges.toFixed(2)}</div>
              <div>Local (Origin): USD {quotation.totalLocalOrigin.toFixed(2)}</div>
              <div>Local (Dest): USD {quotation.totalLocalDestination.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
        <strong>Disclaimer:</strong> This quotation is indicative and subject to space availability. Final rates may vary based on actual cargo details, market conditions, and carrier confirmation. Valid for {Math.ceil((quotation.validUntil.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days.
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all"
        >
          Back
        </button>
        <button
          onClick={onProceedToBook}
          disabled={saving}
          className="flex-1 py-3.5 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-60"
        >
          {saving ? (
            <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</span>
          ) : (
            <><Check className="w-5 h-5" /> Proceed to Book <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuotationSummary;
