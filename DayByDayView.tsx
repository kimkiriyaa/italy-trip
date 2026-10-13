import React, { useState } from 'react';
import { DayPlan, ScheduleItem, Reservation } from '../types/travel';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  ExternalLink,
  CheckCircle2,
  Circle,
  Lightbulb,
  Sun,
  CloudSun,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface DayByDayViewProps {
  days: DayPlan[];
  reservations: Reservation[];
  onOpenReservation: (resId: string) => void;
}

export const DayByDayView: React.FC<DayByDayViewProps> = ({
  days,
  reservations,
  onOpenReservation,
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const currentDay = days[activeDayIndex] || days[0];

  const toggleComplete = (itemId: string) => {
    setCompletedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const getReservationById = (resId?: string) => {
    if (!resId) return null;
    return reservations.find((r) => r.id === resId);
  };

  const getCategoryColor = (cat: ScheduleItem['category']) => {
    switch (cat) {
      case 'transport':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'hotel':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'dining':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'activity':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'sightseeing':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const getCategoryLabel = (cat: ScheduleItem['category']) => {
    switch (cat) {
      case 'transport':
        return '교통/이동';
      case 'hotel':
        return '호텔/숙소';
      case 'dining':
        return '미식/식사';
      case 'activity':
        return '투어/체험';
      case 'sightseeing':
      default:
        return '관광/명소';
    }
  };

  if (!currentDay) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center">
        <p className="text-stone-500 text-sm">표시할 일정이 없습니다. 상단에서 기본 일정을 복원하거나 문서를 선택해주세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Day Selector Pills Bar */}
      <div className="bg-white p-3 rounded-3xl border border-stone-200 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {days.map((day, idx) => {
            const isSelected = idx === activeDayIndex;
            return (
              <button
                key={day.dayNumber}
                onClick={() => setActiveDayIndex(idx)}
                className={`px-4 py-3 rounded-2xl transition-all text-left flex flex-col justify-between min-w-[130px] border ${
                  isSelected
  ? 'bg-slate-700 text-white border-slate-700 shadow-md'
  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-amber-400 text-stone-950' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    Day {day.dayNumber}
                  </span>
                  <span className={`text-[10px] ${isSelected ? 'text-stone-300' : 'text-stone-600'}`}>
                    {day.dayOfWeek}
                  </span>
                </div>
                <div className="font-extrabold text-sm truncate">{day.city.split(' ')[0]}</div>
                <div className={`text-[11px] font-mono mt-0.5 ${isSelected ? 'text-stone-300' : 'text-stone-600'}`}>
                  {day.date.slice(5)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Day Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white shadow-xl">
        <div className="absolute inset-0">
          <img
            src={currentDay.highlightCover}
            alt={currentDay.title}
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/80 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-stone-950 tracking-wide uppercase">
                DAY {currentDay.dayNumber}
              </span>
              <span className="text-stone-300 text-xs font-medium">
                {currentDay.date} ({currentDay.dayOfWeek})
              </span>
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-white/20 text-white backdrop-blur-xs">
                📍 {currentDay.city}
              </span>
            </div>

            {/* Weather */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md text-xs font-medium text-amber-200 border border-white/10">
              <span className="text-base">{currentDay.weatherForecast.icon}</span>
              <span>{currentDay.weatherForecast.temp}</span>
              <span className="text-white/60">({currentDay.weatherForecast.condition})</span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{currentDay.title}</h2>
            <p className="text-stone-300 text-sm mt-2 max-w-2xl leading-relaxed">
              {currentDay.themeSummary}
            </p>
          </div>

          {/* Daily pro tips */}
          {currentDay.tipsForDay && currentDay.tipsForDay.length > 0 && (
            <div className="pt-3 border-t border-white/10 flex items-start gap-2 text-xs text-amber-100 bg-black/20 p-3 rounded-2xl">
              <Lightbulb className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div className="space-y-1">
                {currentDay.tipsForDay.map((tip, i) => (
                  <p key={i} className="leading-relaxed">
                    • {tip}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Items Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
          <span>타임라인 상세 일정</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600">
            총 {currentDay.schedule.length}개 항목
          </span>
        </h3>

        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
          {currentDay.schedule.map((item, idx) => {
            const isDone = !!completedItems[item.id];
            const linkedRes = getReservationById(item.reservationId);

            return (
              <div key={item.id} className="relative group">
                {/* Timeline node bullet */}
                <button
                  onClick={() => toggleComplete(item.id)}
                  className={`absolute -left-6 sm:-left-8 top-4 w-6 h-6 rounded-full flex items-center justify-center transition-all bg-white border-2 ${
                    isDone
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-stone-400 hover:border-stone-900 text-transparent'
                  }`}
                  title={isDone ? '완료 취소' : '일정 완료 체크'}
                >
                  <CheckCircle2 className={`w-4 h-4 ${isDone ? 'opacity-100' : 'opacity-0'}`} />
                </button>

                {/* Schedule Card */}
                <div
                  className={`bg-white rounded-3xl p-5 border transition-all duration-200 shadow-xs hover:shadow-md ${
                    isDone
                      ? 'border-stone-200 opacity-60 bg-stone-50'
                      : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-stone-900 text-white font-mono text-xs font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {item.time}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getCategoryColor(item.category)}`}>
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          item.location + ' ' + currentDay.city
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-stone-600 hover:text-stone-900 text-xs font-semibold flex items-center gap-1 hover:underline"
                      >
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span className="truncate max-w-[150px]">{item.location}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <h4 className={`text-base font-bold text-stone-900 ${isDone ? 'line-through text-stone-500' : ''}`}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">{item.description}</p>

                  {item.tip && (
                    <div className="mt-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-100 flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{item.tip}</span>
                    </div>
                  )}

                  {/* Connected Reservation Quick Access Bar */}
                  {linkedRes && (
                    <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between bg-stone-50 -mx-5 -mb-5 px-5 py-3 rounded-b-3xl">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-xl bg-amber-400 text-stone-950">
                          <Ticket className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-600 font-semibold uppercase block">
                            연동된 사전 예약 바우처
                          </span>
                          <span className="text-xs font-bold text-stone-900">
                            {linkedRes.title} ({linkedRes.confirmationCode})
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenReservation(linkedRes.id)}
                        className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
                      >
                        <span>바우처 & QR 보기</span>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
