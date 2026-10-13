import React, { useState } from 'react';
import {
  DEFAULT_DAYS,
  DEFAULT_RESERVATIONS,
  DEFAULT_LANDMARKS,
  DEFAULT_DINING,
  DEFAULT_TRANSPORT,
} from './data/defaultItalyPlan';
import {
  DayPlan,
  Reservation,
  Landmark,
  DiningSpot,
  TransportRoute,
  NaturalSearchResult,
} from './types/travel';
import { executeNaturalSearch } from './services/naturalSearchService';

import { Header } from './components/Header';
import { NaturalSearchBar } from './components/NaturalSearchBar';
import { ThemeNav, ActiveTheme } from './components/ThemeNav';
import { DayByDayView } from './components/DayByDayView';
import { ReservationsView } from './components/ReservationsView';
import { LandmarksView } from './components/LandmarksView';
import { DiningView } from './components/DiningView';
import { TransportView } from './components/TransportView';
import { VoucherDetailModal } from './components/VoucherDetailModal';

export default function App() {
  // Core Travel Data State (100% 내장 정적 데이터)
  const [days] = useState<DayPlan[]>(DEFAULT_DAYS);
  const [reservations, setReservations] = useState<Reservation[]>(DEFAULT_RESERVATIONS);
  const [landmarks] = useState<Landmark[]>(DEFAULT_LANDMARKS);
  const [diningSpots] = useState<DiningSpot[]>(DEFAULT_DINING);
  const [transportRoutes] = useState<TransportRoute[]>(DEFAULT_TRANSPORT);

  // Navigation & Search State
  const [activeTheme, setActiveTheme] = useState<ActiveTheme>('timeline');
  const [naturalSearchResult, setNaturalSearchResult] = useState<NaturalSearchResult | null>(null);

  // Selected reservation for in-app voucher viewer modal
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // Natural Language Search handler
  const handleNaturalSearch = (query: string) => {
    const result = executeNaturalSearch(
      query,
      days,
      reservations,
      landmarks,
      diningSpots,
      transportRoutes
    );
    setNaturalSearchResult(result);
  };

  const handleOpenReservationById = (resId: string) => {
    const found = reservations.find((r) => r.id === resId);
    if (found) {
      setSelectedReservation(found);
    }
  };

  const handleAddReservation = (newRes: Reservation) => {
    setReservations((prev) => [newRes, ...prev]);
    setSelectedReservation(newRes);
  };

  const handleUpdateReservation = (updated: Reservation) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
    setSelectedReservation(updated);
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 font-sans antialiased selection:bg-amber-300 selection:text-stone-950 pb-16">
      {/* Top Navigation & Brand Header (로그인 버튼 제거된 깔끔한 헤더) */}
      <Header />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Prominent Natural Language Search Section */}
        <NaturalSearchBar
          onSearch={handleNaturalSearch}
          searchResult={naturalSearchResult}
          onClear={() => setNaturalSearchResult(null)}
          onOpenReservation={handleOpenReservationById}
          onNavigateTheme={(t) => setActiveTheme(t as ActiveTheme)}
        />

        {/* Theme Menu Tabs */}
        <ThemeNav
          activeTheme={activeTheme}
          onSelectTheme={setActiveTheme}
          reservationCount={reservations.length}
        />

        {/* View Switcher based on Selected Theme */}
        <div className="transition-all duration-300">
          {activeTheme === 'timeline' && (
            <DayByDayView
              days={days}
              reservations={reservations}
              onOpenReservation={handleOpenReservationById}
            />
          )}

          {activeTheme === 'reservations' && (
            <ReservationsView
              reservations={reservations}
              onSelectReservation={setSelectedReservation}
              onAddReservation={handleAddReservation}
            />
          )}

          {activeTheme === 'landmarks' && (
            <LandmarksView
              landmarks={landmarks}
              onOpenReservation={handleOpenReservationById}
            />
          )}

          {activeTheme === 'dining' && (
            <DiningView
              diningSpots={diningSpots}
              onOpenReservation={handleOpenReservationById}
            />
          )}

          {activeTheme === 'transport' && (
            <TransportView
              transports={transportRoutes}
              onOpenReservation={handleOpenReservationById}
            />
          )}
        </div>
      </main>

      {/* In-App Reservation & Voucher Detail Viewer Modal */}
      {selectedReservation && (
        <VoucherDetailModal
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onUpdateReservation={handleUpdateReservation}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 border-t border-stone-200 bg-white py-8 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-stone-700">
            🇮🇹 Viaggio in Italia — 이탈리아 11박 13일 프리미엄 허니문 플래너
          </p>
          <p className="text-stone-400">
            신민수 & 금보라 공식 가이드북 · Trenitalia · Italo · 뇨미투어
          </p>
        </div>
      </footer>
    </div>
  );
}