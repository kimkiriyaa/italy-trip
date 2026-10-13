import React from 'react';
import { Calendar, Ticket, Compass, Utensils, Train } from 'lucide-react';

export type ActiveTheme = 'timeline' | 'reservations' | 'landmarks' | 'dining' | 'transport';

interface ThemeNavProps {
  activeTheme: ActiveTheme;
  onSelectTheme: (theme: ActiveTheme) => void;
  reservationCount: number;
}

export const ThemeNav: React.FC<ThemeNavProps> = ({
  activeTheme,
  onSelectTheme,
  reservationCount,
}) => {
  const tabs = [
    { id: 'timeline' as ActiveTheme, label: '일정표 (Day-by-Day)', sub: '11박 13일 타임라인', icon: Calendar },
    { id: 'reservations' as ActiveTheme, label: '예약 & 바우처', sub: '인앱 티켓 & QR & PNR', icon: Ticket, badge: reservationCount },
    { id: 'landmarks' as ActiveTheme, label: '명소 & 문화', sub: '도슨트 & 관람 꿀팁', icon: Compass },
    { id: 'dining' as ActiveTheme, label: '미식 & 맛집', sub: '화덕피자 & 티본 & 카페', icon: Utensils },
    { id: 'transport' as ActiveTheme, label: '교통 & 이동', sub: '이탈로 특등석 & 바포레토', icon: Train },
  ];

  return (
    <div className="bg-white/90 rounded-2xl p-2 border border-slate-200/80 shadow-xs overflow-x-auto">
      <div className="flex items-center gap-1.5 min-w-max">
        {tabs.map((tab) => {
          const isActive = activeTheme === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTheme(tab.id)}
              className={`px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-3 text-left ${
                isActive
                  ? 'bg-slate-700 text-white shadow-sm ring-1 ring-slate-800/10'
                  : 'hover:bg-slate-100/70 text-slate-600'
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isActive ? 'bg-white/15 text-sky-200' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-800'}`}>
                    {tab.label}
                  </span>
                  {tab.badge !== undefined && (
                    <span
                      className={`px-2 py-0.2 rounded-full text-[11px] font-bold ${
                        isActive
                          ? 'bg-amber-400 text-slate-900 shadow-2xs'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[11px] block mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                  {tab.sub}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
