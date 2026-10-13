import React, { useState } from 'react';
import { Reservation } from '../types/travel';
import {
  X,
  Copy,
  Check,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  QrCode,
  FileText,
  User,
  CreditCard,
  Train,
  Plane,
  Building,
  Sparkles,
  Share2
} from 'lucide-react';

interface VoucherDetailModalProps {
  reservation: Reservation | null;
  onClose: () => void;
}

export const VoucherDetailModal: React.FC<VoucherDetailModalProps> = ({
  reservation,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!reservation) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 마스킹된 승객/투숙객 표기 (교육 및 포트폴리오 제출용 비식별화)
  const getMaskedGuest = () => {
    return '성인 2인 (TRAVELER 1, TRAVELER 2)';
  };

  // 카테고리별 테마 스타일 설정
  const getCategoryTheme = () => {
    switch (reservation.category) {
      case 'flight':
        return {
          icon: Plane,
          badgeBg: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
          gradientHeader: 'from-sky-950 via-slate-900 to-slate-950',
          accentColor: 'text-sky-400',
          borderAccent: 'border-sky-500/30',
          tag: '항공편 (Flight)'
        };
      case 'train':
        return {
          icon: Train,
          badgeBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          gradientHeader: 'from-rose-950 via-slate-900 to-slate-950',
          accentColor: 'text-rose-400',
          borderAccent: 'border-rose-500/30',
          tag: '고속열차 (Italo)'
        };
      case 'hotel':
        return {
          icon: Building,
          badgeBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          gradientHeader: 'from-amber-950 via-slate-900 to-slate-950',
          accentColor: 'text-amber-400',
          borderAccent: 'border-amber-500/30',
          tag: '호텔 & 숙소 (Hotel)'
        };
      default:
        return {
          icon: Sparkles,
          badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          gradientHeader: 'from-emerald-950 via-slate-900 to-slate-950',
          accentColor: 'text-emerald-400',
          borderAccent: 'border-emerald-500/30',
          tag: '투어 & 액티비티'
        };
    }
  };

  const theme = getCategoryTheme();
  const CategoryIcon = theme.icon;

  // QR 데이터: 실명 패턴(SHIN/MINSOO 등)이 있으면 가상 바우처 코드로 대체 생성
  const rawQr = reservation.qrCodeValue || reservation.confirmationCode || 'CONFIRMED-PASS';
  const qrDisplayValue = rawQr.includes('SHIN')
    ? 'TKT-PASS-2026-CONFIRMED-TRAVELER-ADULT2'
    : rawQr;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=4&data=${encodeURIComponent(
    qrDisplayValue
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. 상단 티켓 헤더 (모바일 가로폭 대응) */}
        <div className={`bg-gradient-to-br ${theme.gradientHeader} text-white p-4 sm:p-5 relative shrink-0`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border ${theme.badgeBg}`}>
                  {theme.tag}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> 공식 확정 바우처
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug break-keep">
                {reservation.title}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5 truncate">
                {reservation.provider}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition shrink-0"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. 바우처 본문 영역 (모바일 스크롤 가능, 긴 텍스트 break-all 완벽 방어) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {/* 예약 번호 & PNR 메인 카드 */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  예약 번호 / PNR 식별 코드
                </span>
                <span className="text-base sm:text-xl font-black font-mono text-slate-900 break-all select-all block mt-0.5">
                  {reservation.confirmationCode}
                </span>
              </div>
              <button
                onClick={() => handleCopy(reservation.confirmationCode, 'pnr')}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  copiedKey === 'pnr'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
              >
                {copiedKey === 'pnr' ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> 복사됨
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> 복사
                  </>
                )}
              </button>
            </div>

            {reservation.secondaryCode && (
              <div className="mt-2.5 pt-2.5 border-t border-slate-200/70 text-xs text-slate-600 flex items-center justify-between gap-2">
                <span className="text-slate-500 shrink-0">보조 정보 / PIN:</span>
                <span className="font-mono font-bold text-slate-800 break-all text-right">
                  {reservation.secondaryCode.includes('신민수')
                    ? 'TRAVELER 2인 확정'
                    : reservation.secondaryCode}
                </span>
              </div>
            )}
          </div>

          {/* QR 코드 스캔 영역 (모바일 화면에 맞춰 유연하게 리사이징) */}
          <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-inner">
            <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-100 flex items-center justify-center max-w-full">
              <img
                src={qrImageUrl}
                alt="Voucher QR Code"
                className="w-36 h-36 sm:w-44 sm:h-44 object-contain mx-auto"
                loading="eager"
              />
            </div>
            
            <div className="mt-3 text-center max-w-full px-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <QrCode className="w-3.5 h-3.5 shrink-0" /> 현장 검표원 스캔 전용 QR
              </span>
              <p className="text-[11px] text-slate-400 mt-1 font-mono break-all leading-tight">
                {qrDisplayValue}
              </p>
            </div>

            {/* 바코드 표시 (존재할 경우) */}
            {reservation.barcodeValue && (
              <div className="mt-3 pt-3 border-t border-slate-800 w-full flex flex-col items-center">
                <div className="bg-white px-4 py-2 rounded-lg max-w-[240px] w-full flex flex-col items-center">
                  <div className="h-7 w-full flex items-center justify-center gap-0.5 overflow-hidden">
                    {/* 심플 CSS 가상 바코드 패턴 */}
                    <div className="h-full w-1 bg-black"></div>
                    <div className="h-full w-0.5 bg-black"></div>
                    <div className="h-full w-1.5 bg-black"></div>
                    <div className="h-full w-0.5 bg-black"></div>
                    <div className="h-full w-2 bg-black"></div>
                    <div className="h-full w-0.5 bg-black"></div>
                    <div className="h-full w-1 bg-black"></div>
                    <div className="h-full w-1.5 bg-black"></div>
                    <div className="h-full w-0.5 bg-black"></div>
                    <div className="h-full w-2 bg-black"></div>
                    <div className="h-full w-1 bg-black"></div>
                    <div className="h-full w-0.5 bg-black"></div>
                    <div className="h-full w-1.5 bg-black"></div>
                  </div>
                  <span className="font-mono text-[10px] text-slate-800 tracking-widest mt-1 block">
                    {reservation.barcodeValue}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 3. 예약 상세 정보 목록 (flex-col 반응형으로 텍스트 겹침 차단) */}
          <div className="space-y-2 text-xs sm:text-sm">
            {/* 일시 */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div className="flex items-center gap-2 text-slate-500 shrink-0">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-medium">일정 및 날짜</span>
              </div>
              <span className="font-bold text-slate-900 text-left sm:text-right break-words">
                {reservation.date}
              </span>
            </div>

            {/* 시간 */}
            {reservation.time && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div className="flex items-center gap-2 text-slate-500 shrink-0">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium">이용 / 출발 시각</span>
                </div>
                <span className="font-semibold text-slate-900 text-left sm:text-right break-words">
                  {reservation.time}
                </span>
              </div>
            )}

            {/* 위치/장소 */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
