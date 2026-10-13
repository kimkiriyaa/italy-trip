import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-sm shrink-0">
            <span className="text-xl">🇮🇹</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold tracking-tight text-white">
                이탈리아 11박 13일 플래너
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30">
                12/13 ~ 12/25
              </span>
            </div>
            <p className="text-xs text-slate-300 font-normal">
              이탈리아 11박 13일 스마트 여행 가이드 & 인앱 바우처 보관함
            </p>
          </div>
        </div>

        {/* Right Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-200">오프라인 단독 모드</span>
        </div>
      </div>
    </header>
  );
};
