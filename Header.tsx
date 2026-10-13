import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-[#0F172A] text-white border-b border-stone-800 sticky top-0 z-40 backdrop-blur-md bg-stone-900/95 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr bg-[#0F172A] flex items-center justify-center shadow-md shrink-0">
            <span className="text-xl">🇮🇹</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white">
                이탈리아 11박 13일 플래너
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white shadow-2xs">
                12/13 ~ 12/25
              </span>
            </div>
            <p className="text-xs text-stone-400">
              신민수 & 금보라 부부 허니문 공식 가이드 & 바우처 보관함
            </p>
          </div>
        </div>

        {/* Right Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-stone-800/80 px-3 py-1.5 rounded-xl border border-stone-700 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-stone-300">오프라인 단독 모드 가동 중</span>
        </div>
      </div>
    </header>
  );
};
