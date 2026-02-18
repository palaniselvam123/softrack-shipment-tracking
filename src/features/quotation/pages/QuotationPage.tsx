import React, { useState } from 'react';
import { ArrowLeft, Filter, SortAsc, AlertCircle, Search, LayoutList, BarChart2, Ship, Plane, ArrowRight, Sparkles, Timer } from 'lucide-react';
import StepIndicator from '../components/StepIndicator';
import ScheduleSearch from '../components/ScheduleSearch';
import ScheduleCard from '../components/ScheduleCard';
import CarrierRateComparison from '../components/CarrierRateComparison';
import QuotationPromos from '../components/QuotationPromos';
import CargoDetails from '../components/CargoDetails';
import QuotationSummary from '../components/QuotationSummary';
import BookingForm from '../components/BookingForm';
import BookingConfirmation from '../components/BookingConfirmation';
import { generateSchedules } from '../data/scheduleGenerator';
import { computeCharges, computeTotals } from '../data/charges';
import { createBookingFromQuote } from '../services/quotationService';
import {
  QuoteStep, SearchParams, Schedule, CargoDetails as CargoDetailsType,
  Quotation, BookingFormData
} from '../types/quotation';

interface QuotationPageProps {
  onBack: () => void;
}

type SortKey = 'etd' | 'transit' | 'price';
type FilterKey = 'all' | 'direct' | 'transship';
type ViewMode = 'list' | 'compare';

let quoteCounter = 1000;
function getNextQuoteNo(): string {
  const d = new Date();
  return `QTE/${d.getFullYear().toString().slice(-2)}${String(d.getMonth() + 1).padStart(2, '0')}/${++quoteCounter}`;
}

const QuotationPage: React.FC<QuotationPageProps> = ({ onBack }) => {
  const [step, setStep] = useState<QuoteStep>('search');
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [cargoDetails, setCargoDetails] = useState<CargoDetailsType | null>(null);
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [bookingNo, setBookingNo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('etd');
  const [filterBy, setFilterBy] = useState<FilterKey>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('compare');
  const [noResults, setNoResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchParams[]>([]);

  const handleSearch = (params: SearchParams) => {
    const results = generateSchedules(params);
    const stamped = { ...params, searchedAt: new Date() };
    setSearchParams(stamped);
    setSchedules(results);
    setNoResults(results.length === 0);
    setStep('results');
    setFilterBy('all');
    setSortBy('etd');
    setRecentSearches(prev => {
      const key = `${params.originPort}-${params.destinationPort}-${params.mode}`;
      const filtered = prev.filter(p => `${p.originPort}-${p.destinationPort}-${p.mode}` !== key);
      return [stamped, ...filtered].slice(0, 6);
    });
  };

  const handleSelectSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setStep('cargo');
  };

  const handleCargoSubmit = (cargo: CargoDetailsType) => {
    if (!selectedSchedule) return;
    setCargoDetails(cargo);

    const charges = computeCharges(selectedSchedule, cargo);
    const totals = computeTotals(charges);
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);

    const newQuotation: Quotation = {
      id: `qt-${Date.now()}`,
      quoteNo: getNextQuoteNo(),
      schedule: selectedSchedule,
      searchParams: searchParams!,
      cargoDetails: cargo,
      charges,
      ...totals,
      currency: 'USD',
      validUntil,
      createdAt: new Date(),
    };

    setQuotation(newQuotation);
    setStep('quote');
  };

  const handleProceedToBook = () => {
    setStep('book');
  };

  const handleBookingSubmit = async (bookingData: BookingFormData) => {
    if (!quotation) return;
    setSubmitting(true);
    try {
      const result = await createBookingFromQuote(quotation, bookingData);
      if (result) {
        setBookingNo(result.bookingNo);
      } else {
        const fallbackNo = `BKG/${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth() + 1).padStart(2, '0')}/${Math.floor(Math.random() * 9000 + 1000)}`;
        setBookingNo(fallbackNo);
      }
      setStep('confirmed');
    } catch (err) {
      console.error(err);
      const fallbackNo = `BKG/${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth() + 1).padStart(2, '0')}/${Math.floor(Math.random() * 9000 + 1000)}`;
      setBookingNo(fallbackNo);
      setStep('confirmed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewSearch = () => {
    setStep('search');
    setSearchParams(null);
    setSchedules([]);
    setSelectedSchedule(null);
    setCargoDetails(null);
    setQuotation(null);
    setBookingNo(null);
  };

  const getFilteredSortedSchedules = (): Schedule[] => {
    let result = [...schedules];
    if (filterBy === 'direct') result = result.filter(s => s.isDirect);
    if (filterBy === 'transship') result = result.filter(s => !s.isDirect);
    if (sortBy === 'etd') result.sort((a, b) => a.etd.getTime() - b.etd.getTime());
    if (sortBy === 'transit') result.sort((a, b) => a.transitDays - b.transitDays);
    if (sortBy === 'price') result.sort((a, b) => {
      const aMin = Math.min(...a.freightRates.map(r => r.amount));
      const bMin = Math.min(...b.freightRates.map(r => r.amount));
      return aMin - bMin;
    });
    return result;
  };

  const carrierGroups = schedules.reduce((acc, s) => {
    acc[s.carrierCode] = (acc[s.carrierCode] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <button
              onClick={step === 'search' ? onBack : handleNewSearch}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {step === 'search' ? 'Back' : 'New Search'}
            </button>
            <div className="text-lg font-bold text-gray-900">Quote & Book</div>
            <div className="w-24" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <StepIndicator currentStep={step} />

        {step === 'search' && (
          <div className="space-y-10">
            <div className="flex gap-4 items-start">
              <div className="hidden lg:flex flex-col gap-3 w-52 flex-shrink-0 pt-2">
                {[
                  { route: 'Mumbai → Dubai', carrier: 'MSC', type: '40HC', status: 'Confirmed', statusColor: 'text-emerald-600 bg-emerald-50', transitDays: 7, rate: '$700', badge: 'Sea FCL', badgeColor: 'bg-sky-500', image: 'https://images.pexels.com/photos/823696/pexels-photo-823696.jpeg?auto=compress&cs=tinysrgb&w=400' },
                  { route: 'JNPT → Hamburg', carrier: 'Hapag-Lloyd', type: '20GP', status: 'In Transit', statusColor: 'text-sky-600 bg-sky-50', transitDays: 22, rate: '$950', badge: 'Sea FCL', badgeColor: 'bg-sky-500', image: 'https://images.pexels.com/photos/3639542/pexels-photo-3639542.jpeg?auto=compress&cs=tinysrgb&w=400' },
                  { route: 'Chennai → Singapore', carrier: 'Evergreen', type: '40GP', status: 'Departed', statusColor: 'text-amber-600 bg-amber-50', transitDays: 14, rate: '$500', badge: 'Direct', badgeColor: 'bg-emerald-500', image: 'https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg?auto=compress&cs=tinysrgb&w=400' },
                ].map((card, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch({ originPort: i === 0 ? 'INBOM' : 'INNSA', destinationPort: i === 0 ? 'AEDXB' : i === 1 ? 'DEHAM' : 'SGSIN', mode: 'sea_fcl', direction: 'export', etd: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], searchedAt: new Date() })}
                    className="group relative rounded-2xl overflow-hidden border border-gray-100 hover:border-sky-200 hover:shadow-lg transition-all text-left bg-white"
                  >
                    <div className="relative h-28 overflow-hidden">
                      <img src={card.image} alt={card.route} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent" />
                      <span className={`absolute top-2 left-2 text-xs font-bold text-white px-2 py-0.5 rounded-full ${card.badgeColor}`}>{card.badge}</span>
                      <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-bold leading-tight">{card.route}</div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${card.statusColor}`}>{card.status}</span>
                        <span className="text-sm font-black text-gray-900">{card.rate}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{card.carrier}</span>
                        <span className="flex items-center gap-0.5"><Timer className="w-3 h-3" />{card.transitDays}d</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex-1 min-w-0">
                <ScheduleSearch
                  onSearch={handleSearch}
                  initialParams={searchParams || undefined}
                />
              </div>

              <div className="hidden lg:flex flex-col gap-3 w-52 flex-shrink-0 pt-2">
                {[
                  { route: 'Delhi → Frankfurt', carrier: 'Lufthansa Cargo', type: 'Air', status: 'Delivered', statusColor: 'text-emerald-600 bg-emerald-50', transitDays: 2, rate: '$3.2/kg', badge: 'Air Express', badgeColor: 'bg-rose-500', image: 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=400' },
                  { route: 'Nhava Sheva → LA', carrier: 'COSCO', type: '40HC', status: 'Booking', statusColor: 'text-sky-600 bg-sky-50', transitDays: 28, rate: '$1,250', badge: 'Sea FCL', badgeColor: 'bg-sky-500', image: 'https://images.pexels.com/photos/3641521/pexels-photo-3641521.jpeg?auto=compress&cs=tinysrgb&w=400' },
                  { route: 'Kolkata → Rotterdam', carrier: 'CMA CGM', type: '40GP', status: 'Confirmed', statusColor: 'text-emerald-600 bg-emerald-50', transitDays: 24, rate: '$900', badge: 'Best Rate', badgeColor: 'bg-amber-500', image: 'https://images.pexels.com/photos/1117210/pexels-photo-1117210.jpeg?auto=compress&cs=tinysrgb&w=400' },
                ].map((card, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch({ originPort: i === 0 ? 'INDEL' : 'INNSA', destinationPort: i === 0 ? 'DEFRA' : i === 1 ? 'USLAX' : 'NLRTM', mode: i === 0 ? 'air' : 'sea_fcl', direction: 'export', etd: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], searchedAt: new Date() })}
                    className="group relative rounded-2xl overflow-hidden border border-gray-100 hover:border-sky-200 hover:shadow-lg transition-all text-left bg-white"
                  >
                    <div className="relative h-28 overflow-hidden">
                      <img src={card.image} alt={card.route} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent" />
                      <span className={`absolute top-2 left-2 text-xs font-bold text-white px-2 py-0.5 rounded-full ${card.badgeColor}`}>{card.badge}</span>
                      <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-bold leading-tight">{card.route}</div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${card.statusColor}`}>{card.status}</span>
                        <span className="text-sm font-black text-gray-900">{card.rate}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{card.carrier}</span>
                        <span className="flex items-center gap-0.5"><Timer className="w-3 h-3" />{card.transitDays}d</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <QuotationPromos
              onSearchNow={handleSearch}
              recentSearches={recentSearches}
            />
          </div>
        )}

        {step === 'results' && searchParams && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="font-bold text-gray-900">
                    {searchParams.originPort} → {searchParams.destinationPort}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      · {searchParams.direction.charAt(0).toUpperCase() + searchParams.direction.slice(1)} · {searchParams.mode.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    From {new Date(searchParams.etd).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    {schedules.length > 0 && ` · ${schedules.length} schedules found`}
                    {Object.keys(carrierGroups).length > 1 && ` · ${Object.keys(carrierGroups).length} carriers`}
                  </div>
                </div>
                <button
                  onClick={() => setStep('search')}
                  className="flex items-center gap-1.5 px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-sky-300 hover:text-sky-700 transition-all"
                >
                  <Search className="w-3.5 h-3.5" /> Modify Search
                </button>
              </div>
            </div>

            {!noResults && schedules.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-500">Filter:</span>
                    {(['all', 'direct', 'transship'] as FilterKey[]).map(f => (
                      <button
                        key={f}
                        onClick={() => setFilterBy(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterBy === f ? 'bg-sky-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-sky-300'}`}
                      >
                        {f === 'all' ? 'All' : f === 'direct' ? 'Direct Only' : 'Via Transshipment'}
                      </button>
                    ))}
                  </div>
                  {viewMode === 'list' && (
                    <div className="flex items-center gap-1.5">
                      <SortAsc className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-500">Sort:</span>
                      {([['etd', 'Earliest ETD'], ['transit', 'Shortest Transit'], ['price', 'Lowest Price']] as [SortKey, string][]).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => setSortBy(key)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${sortBy === key ? 'bg-slate-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-slate-400'}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('compare')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'compare' ? 'bg-sky-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <BarChart2 className="w-3.5 h-3.5" /> Compare Rates
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'list' ? 'bg-sky-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <LayoutList className="w-3.5 h-3.5" /> List View
                  </button>
                </div>
              </div>
            )}

            {noResults || schedules.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-700 mb-2">No schedules found</h3>
                <p className="text-gray-500 text-sm mb-6">
                  No direct services found for this route and date. Try a different date or route combination.
                </p>
                <button
                  onClick={() => setStep('search')}
                  className="px-6 py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-all"
                >
                  Modify Search
                </button>
              </div>
            ) : (
              <>
                {getFilteredSortedSchedules().length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                    <p className="text-gray-500">No schedules match the current filter. Try "All".</p>
                    <button onClick={() => setFilterBy('all')} className="mt-3 text-sky-600 font-semibold text-sm hover:underline">Clear filter</button>
                  </div>
                ) : viewMode === 'compare' ? (
                  <CarrierRateComparison
                    schedules={getFilteredSortedSchedules()}
                    onSelect={handleSelectSchedule}
                  />
                ) : (
                  <div className="space-y-3">
                    {getFilteredSortedSchedules().map(schedule => (
                      <ScheduleCard key={schedule.id} schedule={schedule} onSelect={handleSelectSchedule} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {step === 'cargo' && selectedSchedule && (
          <CargoDetails
            schedule={selectedSchedule}
            onNext={handleCargoSubmit}
            onBack={() => setStep('results')}
          />
        )}

        {step === 'quote' && quotation && (
          <QuotationSummary
            quotation={quotation}
            onProceedToBook={handleProceedToBook}
            onBack={() => setStep('cargo')}
          />
        )}

        {step === 'book' && quotation && (
          <BookingForm
            quotation={quotation}
            onSubmit={handleBookingSubmit}
            onBack={() => setStep('quote')}
            submitting={submitting}
          />
        )}

        {step === 'confirmed' && quotation && bookingNo && (
          <BookingConfirmation
            bookingNo={bookingNo}
            quotation={quotation}
            onNewSearch={handleNewSearch}
            onGoHome={onBack}
          />
        )}
      </div>
    </div>
  );
};

export default QuotationPage;
