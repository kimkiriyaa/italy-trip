import React, { useState } from 'react';
import { Landmark } from '../types/travel';
import {
  MapPin,
  Clock,
  Ticket,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface LandmarksViewProps {
  landmarks: Landmark[];
  onOpenReservation?: (resId: string) => void;
}

export const LandmarksView: React.FC<LandmarksViewProps> = ({
  landmarks,
  onOpenReservation,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = landmarks.filter((lm) => {
    const matchCity = selectedCity === 'all' || lm.city.includes(selectedCity);
    const matchCat = selectedCategory === 'all' || lm.category === selectedCategory;
    return matchCity && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            이탈리아 르네상스 & 고대 역사 탐방
          </span>
          <h2 className="text-2xl font-black text-stone-900 mt-1">주요 명소 & 문화 유적 가이드</h2>
          <p className="text-xs text-stone-600 mt-1">
            관람 시간, 복장 규정(어깨·무릎 가림 필수), 패스트트랙 예약 상태 및 관람 팁을 한눈에 확인하세요.
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

      {/* Landmarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((lm) => (
          <div
            key={lm.id}
            className="bg-white rounded-3xl border border-stone-200 hover:border-stone-400 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Photo & badges */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={lm.imageUrl}
                  alt={lm.nameKorean}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/90 text-stone-900 backdrop-blur-xs">
                    {lm.city}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-black/60 text-white backdrop-blur-xs">
                    {lm.category}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-xs font-mono text-amber-300 block">{lm.nameItalian}</span>
                  <h3 className="text-xl font-bold tracking-tight">{lm.nameKorean}</h3>
                </div>
              </div>

              {/* Details Content */}
              <div className="p-5 space-y-3.5 text-xs text-stone-600">
                <p className="text-stone-700 leading-relaxed font-normal">{lm.summary}</p>

                <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-100">
                  <div className="flex items-start gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-stone-400 font-semibold block">관람 시간</span>
                      <span className="font-semibold text-stone-800">{lm.visitingHours}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-stone-400 font-semibold block">입장료</span>
                      <span className="font-semibold text-stone-800">{lm.admissionFee}</span>
                    </div>
                  </div>
                </div>

                {/* Dress code notification */}
                {lm.dressCodeNotice && (
                  <div className="flex items-start gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">복장 규정 엄격: </strong>
                      {lm.dressCodeNotice}
                    </div>
                  </div>
                )}

                {/* Pro Tips */}
                {lm.proTips && lm.proTips.length > 0 && (
                  <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-2xl space-y-1 text-stone-700">
                    <span className="font-bold text-amber-900 flex items-center gap-1 text-[11px]">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      추천 방문 팁
                    </span>
                    {lm.proTips.map((tip, idx) => (
                      <p key={idx} className="text-[11px] leading-relaxed">
                        • {tip}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Status & Links */}
            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                    lm.reservationStatus.includes('바우처 있음')
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {lm.reservationStatus}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {lm.linkedReservationId && onOpenReservation && (
                  <button
                    onClick={() => onOpenReservation(lm.linkedReservationId!)}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <span>바우처 보기</span>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
                  </button>
                )}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    lm.locationQuery
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-600 transition-colors"
                  title="구글 지도에서 위치 보기"
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
