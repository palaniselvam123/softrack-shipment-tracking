import React, { useState, useEffect } from 'react';
import {
  Clock, TrendingUp, Zap, Ship, Plane, ArrowRight, Star, Tag,
  Sparkles, ChevronLeft, ChevronRight, MapPin, CheckCircle2, Timer
} from 'lucide-react';
import { SearchParams } from '../types/quotation';

interface QuotationPromosProps {
  onSearchNow: (params: SearchParams) => void;
  recentSearches: SearchParams[];
}

const PEXELS_IMAGES = {
  rotterdam: 'https://images.pexels.com/photos/1117210/pexels-photo-1117210.jpeg?auto=compress&cs=tinysrgb&w=800',
  hamburg: 'https://images.pexels.com/photos/3639542/pexels-photo-3639542.jpeg?auto=compress&cs=tinysrgb&w=800',
  dubai: 'https://images.pexels.com/photos/823696/pexels-photo-823696.jpeg?auto=compress&cs=tinysrgb&w=800',
  singapore: 'https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg?auto=compress&cs=tinysrgb&w=800',
  shanghai: 'https://images.pexels.com/photos/1885697/pexels-photo-1885697.jpeg?auto=compress&cs=tinysrgb&w=600',
  losangeles: 'https://images.pexels.com/photos/3641521/pexels-photo-3641521.jpeg?auto=compress&cs=tinysrgb&w=600',
  airfreight: 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=800',
  shipyard: 'https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&cs=tinysrgb&w=600',
  port: 'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&cs=tinysrgb&w=600',
  container: 'https://images.pexels.com/photos/2226458/pexels-photo-2226458.jpeg?auto=compress&cs=tinysrgb&w=600',
  felixstowe: 'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&cs=tinysrgb&w=600',
};

function getDefaultEtd(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
}

const HERO_BANNERS = [
  {
    title: 'India to Europe',
    subtitle: 'Weekly FCL services from all major Indian ports to Rotterdam, Hamburg & Felixstowe',
    cta: 'View Europe Schedules',
    badge: 'Sea FCL',
    badgeColor: 'bg-sky-500',
    image: PEXELS_IMAGES.rotterdam,
    params: { originPort: 'INNSA', destinationPort: 'NLRTM', mode: 'sea_fcl' as const, direction: 'export' as const },
  },
  {
    title: 'Express Air Freight',
    subtitle: 'Next-day delivery to Dubai, Frankfurt & Singapore. Competitive rates per kg.',
    cta: 'View Air Schedules',
    badge: 'Air Freight',
    badgeColor: 'bg-rose-500',
    image: PEXELS_IMAGES.airfreight,
    params: { originPort: 'INBOM', destinationPort: 'AEDXB', mode: 'air' as const, direction: 'export' as const },
  },
  {
    title: 'India–Gulf Corridor',
    subtitle: 'Fastest ocean transit to UAE, Saudi Arabia & Egypt. Direct & transshipment options.',
    cta: 'View Gulf Routes',
    badge: 'Best Rates',
    badgeColor: 'bg-amber-500',
    image: PEXELS_IMAGES.dubai,
    params: { originPort: 'INNSA', destinationPort: 'AEDXB', mode: 'sea_fcl' as const, direction: 'export' as const },
  },
  {
    title: 'India to Singapore',
    subtitle: 'Direct weekly sailings. Transshipment hub for SE Asia onward connections.',
    cta: 'View Singapore Schedules',
    badge: 'Direct Service',
    badgeColor: 'bg-emerald-500',
    image: PEXELS_IMAGES.singapore,
    params: { originPort: 'INNSA', destinationPort: 'SGSIN', mode: 'sea_fcl' as const, direction: 'export' as const },
  },
];

interface PopularRoute {
  id: string;
  origin: string;
  originName: string;
  destination: string;
  destinationName: string;
  mode: 'sea_fcl' | 'sea_lcl' | 'air';
  direction: 'export' | 'import';
  minRate: number;
  currency: string;
  transitDays: number;
  image: string;
  tag?: string;
  tagColor?: string;
}

const POPULAR_ROUTES: PopularRoute[] = [
  {
    id: 'pr1', origin: 'INNSA', originName: 'Nhava Sheva',
    destination: 'NLRTM', destinationName: 'Rotterdam',
    mode: 'sea_fcl', direction: 'export',
    minRate: 780, currency: 'USD', transitDays: 22,
    image: PEXELS_IMAGES.rotterdam, tag: 'Most Popular', tagColor: 'bg-sky-500',
  },
  {
    id: 'pr2', origin: 'INNSA', originName: 'Nhava Sheva',
    destination: 'AEDXB', destinationName: 'Dubai',
    mode: 'sea_fcl', direction: 'export',
    minRate: 400, currency: 'USD', transitDays: 7,
    image: PEXELS_IMAGES.dubai, tag: 'Fastest', tagColor: 'bg-emerald-500',
  },
  {
    id: 'pr3', origin: 'INNSA', originName: 'Nhava Sheva',
    destination: 'SGSIN', destinationName: 'Singapore',
    mode: 'sea_fcl', direction: 'export',
    minRate: 300, currency: 'USD', transitDays: 14,
    image: PEXELS_IMAGES.singapore, tag: 'Best Value', tagColor: 'bg-amber-500',
  },
  {
    id: 'pr4', origin: 'INNSA', originName: 'Nhava Sheva',
    destination: 'CNSHA', destinationName: 'Shanghai',
    mode: 'sea_fcl', direction: 'export',
    minRate: 350, currency: 'USD', transitDays: 20,
    image: PEXELS_IMAGES.shanghai,
  },
  {
    id: 'pr5', origin: 'INBOM', originName: 'Mumbai',
    destination: 'AEDXB', destinationName: 'Dubai',
    mode: 'air', direction: 'export',
    minRate: 2.8, currency: 'USD', transitDays: 1,
    image: PEXELS_IMAGES.airfreight, tag: 'Air Express', tagColor: 'bg-rose-500',
  },
  {
    id: 'pr6', origin: 'INNSA', originName: 'Nhava Sheva',
    destination: 'USLAX', destinationName: 'Los Angeles',
    mode: 'sea_fcl', direction: 'export',
    minRate: 1200, currency: 'USD', transitDays: 28,
    image: PEXELS_IMAGES.losangeles,
  },
];

interface CarrierOffer {
  carrierId: string;
  carrierCode: string;
  color: string;
  headline: string;
  subline: string;
  badge: string;
  discount: string;
  routes: string;
  image: string;
  originPort: string;
  destinationPort: string;
}

const CARRIER_OFFERS: CarrierOffer[] = [
  {
    carrierId: 'msc', carrierCode: 'MSC', color: '#1a1a1a',
    headline: 'MSC Flexi Rates',
    subline: 'Book now, pay later on select India-Europe services',
    badge: 'Limited Offer', discount: 'Up to 12% off', routes: 'India → Europe',
    image: PEXELS_IMAGES.shipyard, originPort: 'INNSA', destinationPort: 'NLRTM',
  },
  {
    carrierId: 'maersk', carrierCode: 'MAERSK', color: '#42B0D5',
    headline: 'Maersk Spot Deal',
    subline: 'Guaranteed space on India-Gulf routes. Weekly departures.',
    badge: 'Hot Deal', discount: 'From $380/20GP', routes: 'India → Gulf',
    image: PEXELS_IMAGES.port, originPort: 'INNSA', destinationPort: 'AEDXB',
  },
  {
    carrierId: 'hapag', carrierCode: 'HAPAG', color: '#F37021',
    headline: 'Hapag Premium Service',
    subline: 'Priority loading, real-time track & trace included',
    badge: 'Premium', discount: 'Free THC on 40HC', routes: 'India → Far East',
    image: PEXELS_IMAGES.container, originPort: 'INNSA', destinationPort: 'SGSIN',
  },
];

const LEFT_BOOKING_CARDS = [
  { route: 'Mumbai → Dubai', carrier: 'MSC', type: '40HC', status: 'Confirmed', statusColor: 'text-emerald-600 bg-emerald-50', transitDays: 7, rate: '$700' },
  { route: 'JNPT → Hamburg', carrier: 'Hapag-Lloyd', type: '20GP', status: 'In Transit', statusColor: 'text-sky-600 bg-sky-50', transitDays: 22, rate: '$950' },
  { route: 'Chennai → Singapore', carrier: 'Evergreen', type: '40GP', status: 'Departed', statusColor: 'text-amber-600 bg-amber-50', transitDays: 14, rate: '$500' },
];

const RIGHT_BOOKING_CARDS = [
  { route: 'Delhi → Frankfurt', carrier: 'Lufthansa Cargo', type: 'Air', status: 'Delivered', statusColor: 'text-emerald-600 bg-emerald-50', transitDays: 2, rate: '$3.2/kg' },
  { route: 'Nhava Sheva → LA', carrier: 'COSCO', type: '40HC', status: 'Booking', statusColor: 'text-violet-600 bg-violet-50', transitDays: 28, rate: '$1,250' },
  { route: 'Kolkata → Rotterdam', carrier: 'CMA CGM', type: '40GP', status: 'Confirmed', statusColor: 'text-emerald-600 bg-emerald-50', transitDays: 24, rate: '$900' },
];

function formatSearchLabel(s: SearchParams): string {
  return `${s.originPort} → ${s.destinationPort}`;
}

function timeSince(d: Date): string {
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface BookingSideCardProps {
  card: typeof LEFT_BOOKING_CARDS[0];
  delay: number;
}

const BookingSideCard: React.FC<BookingSideCardProps> = ({ card, delay }) => (
  <div
    className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg p-4 w-52"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-1.5">
        {card.type === 'Air' ? (
          <Plane className="w-3.5 h-3.5 text-rose-500" />
        ) : (
          <Ship className="w-3.5 h-3.5 text-sky-500" />
        )}
        <span className="text-xs font-bold text-gray-800">{card.type}</span>
      </div>
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${card.statusColor}`}>
        {card.status}
      </span>
    </div>
    <div className="font-bold text-gray-900 text-sm leading-tight mb-1">{card.route}</div>
    <div className="text-xs text-gray-400 mb-3">{card.carrier}</div>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Timer className="w-3 h-3" />
        <span>{card.transitDays}d transit</span>
      </div>
      <div className="text-sm font-black text-gray-900">{card.rate}</div>
    </div>
  </div>
);

const QuotationPromos: React.FC<QuotationPromosProps> = ({ onSearchNow, recentSearches }) => {
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(i => (i + 1) % HERO_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goHero = (dir: 'prev' | 'next') => {
    setHeroIndex(i => dir === 'next' ? (i + 1) % HERO_BANNERS.length : (i - 1 + HERO_BANNERS.length) % HERO_BANNERS.length);
  };

  const hero = HERO_BANNERS[heroIndex];

  const handleHeroClick = () => {
    onSearchNow({ ...hero.params, etd: getDefaultEtd(), searchedAt: new Date() });
  };

  const handleRouteClick = (route: PopularRoute) => {
    onSearchNow({
      originPort: route.origin,
      destinationPort: route.destination,
      mode: route.mode,
      direction: route.direction,
      etd: getDefaultEtd(),
      searchedAt: new Date(),
    });
  };

  const handleCarrierClick = (offer: CarrierOffer) => {
    onSearchNow({
      originPort: offer.originPort,
      destinationPort: offer.destinationPort,
      mode: 'sea_fcl',
      direction: 'export',
      etd: getDefaultEtd(),
      searchedAt: new Date(),
    });
  };

  const handleRecentClick = (s: SearchParams) => {
    onSearchNow({ ...s, etd: getDefaultEtd(), searchedAt: new Date() });
  };

  return (
    <div className="space-y-10">
      <div className="relative">
        <div className="flex items-stretch gap-3">
          <div className="hidden xl:flex flex-col gap-3 justify-center">
            {LEFT_BOOKING_CARDS.map((card, i) => (
              <BookingSideCard key={i} card={card} delay={i * 100} />
            ))}
          </div>

          <div
            className="relative rounded-3xl overflow-hidden flex-1 h-72 md:h-80 group shadow-xl cursor-pointer"
            onClick={handleHeroClick}
          >
            <img
              key={heroIndex}
              src={hero.image}
              alt={hero.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 scale-105 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-gray-900/55 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
              <span className={`inline-flex items-center gap-1.5 self-start text-xs font-bold text-white px-3 py-1 rounded-full mb-4 ${hero.badgeColor}`}>
                <Sparkles className="w-3 h-3" /> {hero.badge}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">{hero.title}</h2>
              <p className="text-gray-200 text-sm md:text-base max-w-md leading-relaxed mb-6">{hero.subtitle}</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={e => { e.stopPropagation(); handleHeroClick(); }}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-lg text-sm"
                >
                  {hero.cta} <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-white/60 text-xs font-semibold">Click anywhere to search</span>
              </div>
            </div>

            <button
              onClick={e => { e.stopPropagation(); goHero('prev'); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); goHero('next'); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {HERO_BANNERS.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setHeroIndex(i); }}
                  className={`h-1.5 rounded-full transition-all ${i === heroIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
                />
              ))}
            </div>
          </div>

          <div className="hidden xl:flex flex-col gap-3 justify-center">
            {RIGHT_BOOKING_CARDS.map((card, i) => (
              <BookingSideCard key={i} card={card} delay={i * 100} />
            ))}
          </div>
        </div>

        <div className="xl:hidden mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
          {[...LEFT_BOOKING_CARDS.slice(0, 2), ...RIGHT_BOOKING_CARDS.slice(0, 1)].map((card, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  {card.type === 'Air' ? <Plane className="w-3 h-3 text-rose-500" /> : <Ship className="w-3 h-3 text-sky-500" />}
                  <span className="text-xs font-bold text-gray-700">{card.type}</span>
                </div>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${card.statusColor}`}>{card.status}</span>
              </div>
              <div className="font-bold text-gray-900 text-xs leading-tight mb-0.5">{card.route}</div>
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-xs text-gray-400">{card.transitDays}d</span>
                <span className="text-xs font-black text-gray-900">{card.rate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {recentSearches.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-gray-400" />
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Recent Searches</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.slice(0, 6).map((s, i) => (
              <button
                key={i}
                onClick={() => handleRecentClick(s)}
                className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-gray-200 hover:border-sky-300 hover:bg-sky-50 rounded-2xl text-sm font-semibold text-gray-700 hover:text-sky-700 transition-all group shadow-sm"
              >
                {s.mode === 'air' ? (
                  <Plane className="w-3.5 h-3.5 text-gray-400 group-hover:text-sky-500" />
                ) : (
                  <Ship className="w-3.5 h-3.5 text-gray-400 group-hover:text-sky-500" />
                )}
                <span>{formatSearchLabel(s)}</span>
                <span className="text-xs text-gray-400 font-normal">{timeSince(s.searchedAt || new Date())}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sky-600" />
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Popular Routes</h3>
          </div>
          <span className="text-xs text-gray-400 font-semibold">Live rates · Click to search</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_ROUTES.map(route => (
            <button
              key={route.id}
              onClick={() => handleRouteClick(route)}
              className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-sky-200 hover:shadow-lg transition-all text-left"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={route.image}
                  alt={route.destinationName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent" />
                {route.tag && (
                  <span className={`absolute top-3 left-3 text-xs font-bold text-white px-2.5 py-1 rounded-full ${route.tagColor}`}>
                    {route.tag}
                  </span>
                )}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                    <MapPin className="w-3.5 h-3.5 opacity-70" />
                    <span>{route.originName}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                    <span>{route.destinationName}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide flex items-center gap-1.5 mb-1">
                      {route.mode === 'air' ? <Plane className="w-3 h-3" /> : <Ship className="w-3 h-3" />}
                      {route.mode === 'air' ? 'Air Freight' : route.mode === 'sea_fcl' ? 'Sea FCL' : 'Sea LCL'}
                      &nbsp;·&nbsp;{route.transitDays}d transit
                    </div>
                    <div className="font-black text-gray-900 text-base">
                      From {route.currency} {route.mode === 'air' ? `${route.minRate}/kg` : route.minRate.toLocaleString()}
                      {route.mode !== 'air' && <span className="text-xs font-semibold text-gray-400 ml-1">per container</span>}
                    </div>
                  </div>
                  <div className="w-9 h-9 bg-sky-50 group-hover:bg-sky-600 rounded-xl flex items-center justify-center transition-all">
                    <ArrowRight className="w-4 h-4 text-sky-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-5">
          <Tag className="w-4 h-4 text-amber-500" />
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Carrier Offers</h3>
          <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">Limited Time</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CARRIER_OFFERS.map(offer => (
            <div
              key={offer.carrierId}
              className="group relative rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all cursor-pointer"
              onClick={() => handleCarrierClick(offer)}
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.carrierCode}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80"
                />
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${offer.color}cc 0%, ${offer.color}99 100%)` }} />
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white border-2 border-white/30"
                        style={{ backgroundColor: offer.color }}
                      >
                        {offer.carrierCode.slice(0, 3)}
                      </div>
                      <div>
                        <div className="text-white font-black text-sm">{offer.carrierCode}</div>
                        <div className="text-white/70 text-xs">{offer.routes}</div>
                      </div>
                    </div>
                    <span className="text-xs bg-white/20 backdrop-blur-sm text-white font-bold px-2 py-1 rounded-full border border-white/30">
                      {offer.badge}
                    </span>
                  </div>
                  <div className="text-white font-black text-lg leading-tight">{offer.discount}</div>
                </div>
              </div>
              <div className="bg-white p-4">
                <h4 className="font-bold text-gray-900 text-sm mb-1">{offer.headline}</h4>
                <p className="text-gray-500 text-xs leading-relaxed mb-3">{offer.subline}</p>
                <div className="flex items-center gap-1 text-xs font-bold" style={{ color: offer.color }}>
                  Search Now <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: <Zap className="w-5 h-5 text-amber-500" />,
            bg: 'bg-amber-50', border: 'border-amber-100',
            title: 'Instant Quotation',
            desc: 'Get live freight rates, surcharges, and local charges in seconds for any route.',
          },
          {
            icon: <Star className="w-5 h-5 text-sky-500" />,
            bg: 'bg-sky-50', border: 'border-sky-100',
            title: 'Multi-Carrier Compare',
            desc: 'Compare MSC, Maersk, Hapag-Lloyd and 10+ carriers side-by-side on the same route.',
          },
          {
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
            bg: 'bg-emerald-50', border: 'border-emerald-100',
            title: 'One-Click Booking',
            desc: 'Confirm your booking instantly. No back-and-forth emails or manual paperwork.',
          },
        ].map((item, i) => (
          <div key={i} className={`${item.bg} border ${item.border} rounded-2xl p-5 flex items-start gap-4`}>
            <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
              <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuotationPromos;
