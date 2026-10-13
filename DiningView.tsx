import React, { useState } from 'react';
import { DiningSpot } from '../types/travel';
import {
  Utensils,
  Star,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface DiningViewProps {
  diningSpots: DiningSpot[];
  onOpenReservation?: (resId: string) => void;
}

export const DiningView: React.FC<DiningViewProps> = ({
  diningSpots,
  onOpenReservation,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const filtered = diningSpots.filter((d) => {
    return selectedCity === 'all' || d.city === selectedCity;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
            La Dolce Vita • 이탈리아 미식 로드
          </span>
          <h2 className="text-2xl font-black text-stone-900 mt-1">미식 & 추천 맛집 리스트</h2>
          <p className="text-xs text-stone-600 mt-1">
            로마 정통 카르보나라부터 피렌체 1.2kg 티본스테이크, 베네치아 먹물 파스타, 100년 전통 젤라또까지.
          </p>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {['all', '로마', '피렌체', '베네치아', '밀라노'].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedCity === city
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {city === 'all' ? '전체 도시' : city}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((spot) => (
          <div
            key={spot.id}
            className="bg-white rounded-3xl border border-stone-200 hover:border-stone-400 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Top row */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                      {spot.city}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-700">
                      {spot.cuisine}
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-400">
                      {spot.priceRange}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-stone-900 tracking-tight">{spot.name}</h3>
                </div>

                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{spot.googleRating}</span>
                </div>
              </div>

              {/* Signature Dishes */}
              <div className="mt-3 bg-stone-50 p-3 rounded-2xl border border-stone-100">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  대표 시그니처 메뉴 (Must-Try)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {spot.signatureDishes.map((dish, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-stone-200 text-stone-800 shadow-2xs"
                    >
                      🍴 {dish}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description & Reservation Tip */}
              <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                {spot.recommendationReason}
              </p>

              <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200/60 rounded-2xl text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>방문 & 예약 팁:</span>
                </div>
                <p className="text-[11px] leading-relaxed">{spot.reservationTip}</p>
              </div>

              <div className="mt-3 text-xs text-stone-500 space-y-1 font-mono">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="truncate">{spot.address}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{spot.openingHours}</span>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <div>
                {spot.isReserved ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    예약 완료
                  </span>
                ) : (
                  <span className="text-xs text-stone-600 font-medium">현장 방문 추천</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {spot.linkedReservationId && onOpenReservation && (
                  <button
                    onClick={() => onOpenReservation(spot.linkedReservationId!)}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <span>예약 바우처 확인</span>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
                  </button>
                )}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    spot.name + ' ' + spot.city
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-600 transition-colors"
                  title="구글 지도에서 식당 보기"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
