import React from 'react';
import { CheckCircle, Download, Share2, Ship, Plane, ArrowRight, Calendar, Clock, Home } from 'lucide-react';
import { Quotation } from '../types/quotation';

interface BookingConfirmationProps {
  bookingNo: string;
  quotation: Quotation;
  onNewSearch: () => void;
  onGoHome: () => void;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ bookingNo, quotation, onNewSearch, onGoHome }) => {
  const isAir = quotation.schedule.mode === 'air';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-once">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Booking Confirmed!</h2>
        <p className="text-gray-500 mt-2">Your freight booking has been successfully submitted.</p>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white mb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-slate-400 text-xs uppercase tracking-wider">Booking Reference</div>
            <div className="text-3xl font-black text-white mt-1 tracking-wide">{bookingNo}</div>
          </div>
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-sm font-black"
            style={{ backgroundColor: quotation.schedule.carrierColor }}
          >
            {quotation.schedule.carrierCode.slice(0, 3)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-slate-400 text-xs mb-1">From</div>
            <div className="font-bold">{quotation.schedule.originPortName}</div>
            <div className="text-slate-300 text-sm">{quotation.schedule.originPort} · {quotation.schedule.originCountry}</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs mb-1">To</div>
            <div className="font-bold">{quotation.schedule.destinationPortName}</div>
            <div className="text-slate-300 text-sm">{quotation.schedule.destinationPort} · {quotation.schedule.destinationCountry}</div>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            {isAir ? <Plane className="w-4 h-4 text-sky-400" /> : <Ship className="w-4 h-4 text-sky-400" />}
            <span className="font-semibold">{quotation.schedule.carrierName}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-300 text-xs">
              {isAir ? quotation.schedule.flightNo : `${quotation.schedule.vesselName} · ${quotation.schedule.voyageNo}`}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <div className="text-slate-400 text-xs flex items-center gap-1"><Calendar className="w-3 h-3" />ETD</div>
              <div className="font-semibold mt-0.5">{formatDate(quotation.schedule.etd)}</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />Transit</div>
              <div className="font-semibold mt-0.5">{quotation.schedule.transitDays} days</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs flex items-center gap-1"><Calendar className="w-3 h-3" />ETA</div>
              <div className="font-semibold mt-0.5">{formatDate(quotation.schedule.eta)}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-xs">Total Amount</div>
            <div className="text-2xl font-black text-white">USD {quotation.totalAmountUsd.toFixed(2)}</div>
            <div className="text-slate-300 text-sm">≈ ₹{quotation.totalAmountInr.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
          </div>
          <div className="text-right">
            <div className="text-slate-400 text-xs">Cargo</div>
            <div className="font-semibold text-sm">{quotation.cargoDetails.containerType} × {quotation.cargoDetails.quantity}</div>
            <div className="text-slate-300 text-xs">{quotation.cargoDetails.commodity}</div>
          </div>
        </div>
      </div>

      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-4">
        <div className="font-semibold text-sky-900 text-sm mb-2">What happens next?</div>
        <ol className="space-y-2">
          {[
            'Our team will review your booking and send a booking confirmation within 4 hours.',
            'You will receive the shipping instructions and VGM submission guidelines.',
            'Draft Bill of Lading will be shared for approval 48 hours before ETD.',
            'Original Bill of Lading / Express Release will be issued after cargo departure.',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-sky-800">
              <span className="w-5 h-5 bg-sky-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all text-sm"
        >
          <Download className="w-4 h-4" /> Save / Print
        </button>
        <button
          onClick={onNewSearch}
          className="flex items-center gap-2 px-5 py-3 border-2 border-sky-200 text-sky-700 rounded-xl font-semibold hover:border-sky-300 hover:bg-sky-50 transition-all text-sm"
        >
          <Share2 className="w-4 h-4" /> New Search
        </button>
        <button
          onClick={onGoHome}
          className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
        >
          <Home className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
