import React from 'react';
import {
  Calendar,
  Ticket,
  Compass,
  Utensils,
  Train,
} from 'lucide-react';

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
    {
      id: 'timeline' as ActiveTheme,
      label: '일정표 (Day-by-Day)',
      sub: '11박 13일 타임라인',
      icon: Calendar,
      color: 'text-stone-900',
    },
    {
      id: 'reservations' as ActiveTheme,
      label: '예약 & 바우처',
      sub: '인앱 티켓 & QR & PNR',
      icon: Ticket,
      badge: reservationCount,
      color: 'text-amber-600',
    },
    {
      id: 'landmarks' as ActiveTheme,
      label: '명소 & 문화',
      sub: '도슨트 & 관람 꿀팁',
      icon: Compass,
      color: 'text-emerald-600',
    },
    {
      id: 'dining' as ActiveTheme,
      label: '미식 & 맛집',
      sub: '화덕피자 & 티본 & 카페',
      icon: Utensils,
      color: 'text-orange-600',
    },
    {
      id: 'transport' as ActiveTheme,
      label: '교통 & 이동',
      sub: '이탈로 특등석 & 바포레토',
      icon: Train,
      color: 'text-rose-600',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-2 border border-stone-200 shadow-sm overflow-x-auto">
      <div className="flex items-center gap-1.5 min-w-max">
        {tabs.map((tab) => {
          const isActive = activeTheme === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTheme(tab.id)}
              className={`px-4 py-3 rounded-2xl transition-all duration-200 flex items-center gap-3 text-left relative ${
                isActive
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'hover:bg-stone-100 text-stone-600'
              }`}
            >
              <div
                className={`p-2 rounded-xl ${
                  isActive
                    ? 'bg-white/10 text-amber-300'
                    : 'bg-stone-100 ' + tab.color
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-black tracking-tight ${
                      isActive ? 'text-white' : 'text-stone-900'
                    }`}
                  >
                    {tab.label}
                  </span>
                  {tab.badge !== undefined && (
                    <span
                      className={`px-2 py-0.2 rounded-full text-[11px] font-black ${
                        isActive
                          ? 'bg-amber-400 text-stone-950'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[11px] block mt-0.5 ${
                    isActive ? 'text-stone-400' : 'text-stone-500'
                  }`}
                >
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