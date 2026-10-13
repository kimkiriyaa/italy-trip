import React, { useState } from 'react';
import { NaturalSearchResult, Reservation } from '../types/travel';
import {
  Search,
  Sparkles,
  X,
  Ticket,
  ChevronRight,
  Calendar,
  Utensils,
  Train,
  MapPin,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface NaturalSearchBarProps {
  onSearch: (query: string) => void;
  searchResult: NaturalSearchResult | null;
  onClear: () => void;
  onOpenReservation: (resId: string) => void;
  onNavigateTheme: (theme: 'timeline' | 'reservations' | 'landmarks' | 'dining' | 'transport') => void;
}

export const NaturalSearchBar: React.FC<NaturalSearchBarProps> = ({
  onSearch,
  searchResult,
  onClear,
  onOpenReservation,
  onNavigateTheme,
}) => {
  const [inputVal, setInputVal] = useState('');

  const quickQuestions = [
    { text: '호텔 4곳 예약번호 알려줘', icon: '🏨' },
    { text: '이탈로 기차 좌석 번호랑 PNR', icon: '🚄' },
    { text: '돌로미티 뇨미투어 미팅 장소와 일정', icon: '🏔️' },
    { text: '호텔 도시세 총 얼마야?', icon: '💶' },
    { text: '나폴리 원조 화덕피자 오픈런', icon: '🍕' },
    { text: '더 몰 아울렛 셔틀과 쇼핑 일정', icon: '🛍️' },
    { text: '피렌체 티본스테이크 맛집', icon: '🥩' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onSearch(inputVal);
  };

  const handleChipClick = (question: string) => {
    setInputVal(question);
    onSearch(question);
  };

  const handleReset = () => {
    setInputVal('');
    onClear();
  };

  return (
    <div className="space-y-3">
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center bg-white rounded-3xl border-2 border-stone-300 hover:border-stone-900 focus-within:border-stone-900 focus-within:ring-4 focus-within:ring-stone-900/10 shadow-lg transition-all duration-300">
          <div className="pl-5 pr-2 text-stone-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          </div>

          <input
            type="text"
            placeholder="자연어로 검색하세요 (예: '이탈로 좌석 번호', '돌로미티 투어', '호텔 도시세', '더 몰 쇼핑')..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full py-4 text-sm sm:text-base font-medium text-stone-900 placeholder-stone-400 bg-transparent outline-none pr-24"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            {inputVal && (
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors"
                title="초기화"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>검색</span>
            </button>
          </div>
        </div>
      </form>

      {/* Quick Suggestion Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-stone-600 text-xs font-semibold shrink-0">추천 질문:</span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleChipClick(q.text)}
            className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-200 rounded-full text-stone-700 whitespace-nowrap transition-colors flex items-center gap-1 shadow-2xs text-xs font-medium"
          >
            <span>{q.icon}</span>
            <span>{q.text}</span>
          </button>
        ))}
      </div>

      {/* Search Result AI Answer Card */}
      {searchResult && (
        <div className="bg-gradient-to-br from-amber-50 via-white to-stone-50 border-2 border-amber-300 rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-400 text-stone-950">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  자연어 답변 & 관련 일정 결과
                </span>
                <h4 className="text-base font-black text-stone-900">"{searchResult.query}"</h4>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Direct Answer Summary Box */}
          <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm text-sm text-stone-800 leading-relaxed font-medium whitespace-pre-wrap">
            {searchResult.answerSummary}
          </div>

          {/* Quick Matched Action Cards */}
          {searchResult.matchedReservations.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5 text-amber-600" />
                  연관된 예약 바우처 ({searchResult.matchedReservations.length}건)
                </span>
                <button
                  onClick={() => onNavigateTheme('reservations')}
                  className="text-xs font-bold text-stone-900 hover:underline flex items-center gap-0.5"
                >
                  <span>예약 탭에서 모두 보기</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {searchResult.matchedReservations.slice(0, 4).map((r) => (
                  <div
                    key={r.id}
                    onClick={() => onOpenReservation(r.id)}
                    className="p-3.5 bg-white rounded-2xl border border-stone-200 hover:border-stone-900 cursor-pointer shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-stone-600 block">{r.city} • {r.date}</span>
                      <h5 className="text-xs font-bold text-stone-900 group-hover:text-stone-950 truncate max-w-[200px]">
                        {r.title}
                      </h5>
                      <span className="text-xs font-mono font-bold text-amber-700">
                        {r.confirmationCode}
                      </span>
                    </div>
                    <button className="... bg-slate-700 hover:bg-slate-800 text-white font-semibold shadow-xs ...">
                      <span>바우처</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Dining */}
          {searchResult.matchedDining.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-200">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-orange-600" />
                매칭된 추천 맛집 ({searchResult.matchedDining.length}건)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {searchResult.matchedDining.slice(0, 2).map((d) => (
                  <div key={d.id} className="p-3 bg-white rounded-xl border border-stone-200 text-xs">
                    <div className="font-bold text-stone-900">{d.name} ({d.city})</div>
                    <div className="text-stone-500 text-[11px] mt-0.5">
                      대표 메뉴: {d.signatureDishes.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action prompt footer */}
          {searchResult.actionPrompt && (
            <div className="text-xs text-amber-900/80 font-medium bg-amber-100/50 p-2.5 rounded-xl text-center">
              💡 {searchResult.actionPrompt}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
