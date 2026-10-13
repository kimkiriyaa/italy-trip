import React, { useState } from 'react';
import { Reservation } from '../types/travel';
import {
  X,
  Copy,
  Check,
  QrCode,
  MapPin,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  AlertTriangle,
  Upload,
  ExternalLink,
  Printer,
  Sparkles,
} from 'lucide-react';

interface VoucherDetailModalProps {
  reservation: Reservation | null;
  onClose: () => void;
  onUpdateReservation?: (updated: Reservation) => void;
}

export const VoucherDetailModal: React.FC<VoucherDetailModalProps> = ({
  reservation,
  onClose,
  onUpdateReservation,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [highBrightness, setHighBrightness] = useState(false);
  const [activeTab, setActiveTab] = useState<'ticket' | 'attachments'>('ticket');

  if (!reservation) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(reservation.confirmationCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const updatedImages = [...(reservation.attachedImages || []), dataUrl];
      const updated: Reservation = {
        ...reservation,
        attachedImages: updatedImages,
        voucherImageUrl: reservation.voucherImageUrl || dataUrl,
      };
      if (onUpdateReservation) {
        onUpdateReservation(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  const getCategoryTheme = () => {
    switch (reservation.category) {
      case 'flight':
        return {
          headerBg: 'bg-gradient-to-r from-sky-700 to-indigo-800 text-white',
          badge: 'bg-sky-100 text-sky-800',
          typeLabel: '항공권 E-TICKET',
        };
      case 'hotel':
        return {
          headerBg: 'bg-gradient-to-r from-amber-700 to-stone-800 text-white',
          badge: 'bg-amber-100 text-amber-800',
          typeLabel: '호텔 바우처 HOTEL VOUCHER',
        };
      case 'train':
        return {
          headerBg: 'bg-gradient-to-r from-red-700 to-rose-900 text-white',
          badge: 'bg-rose-100 text-rose-800',
          typeLabel: '고속열차 티켓 TRENITALIA / ITALO',
        };
      case 'ticket':
        return {
          headerBg: 'bg-gradient-to-r from-emerald-800 to-teal-900 text-white',
          badge: 'bg-emerald-100 text-emerald-800',
          typeLabel: '명소 패스트트랙 입장권 TICKET',
        };
      case 'dining':
        return {
          headerBg: 'bg-gradient-to-r from-orange-700 to-amber-900 text-white',
          badge: 'bg-orange-100 text-orange-800',
          typeLabel: '레스토랑 예약 CONFIRMATION',
        };
      default:
        return {
          headerBg: 'bg-gradient-to-r from-stone-800 to-stone-900 text-white',
          badge: 'bg-stone-100 text-stone-800',
          typeLabel: '예약 확인서 VOUCHER',
        };
    }
  };

  const theme = getCategoryTheme();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div
        className={`relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 my-auto ${
          highBrightness ? 'ring-4 ring-amber-400' : ''
        }`}
      >
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-stone-900 text-stone-300 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="tracking-wide">인앱 현장 확인용 디지털 바우처</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHighBrightness(!highBrightness)}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors flex items-center gap-1 ${
                highBrightness
                  ? 'bg-amber-400 text-stone-950 font-bold'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
              }`}
              title="검표 스캐너 인식을 위한 화면 강조"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {highBrightness ? '스캐너 모드 ON' : '스캐너 모드'}
            </button>
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
              title="프린트 / PDF 저장"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('ticket')}
            className={`pb-2.5 px-4 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'ticket'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            디지털 티켓 & QR 코드
          </button>
          <button
            onClick={() => setActiveTab('attachments')}
            className={`pb-2.5 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'attachments'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>사진/바우처 보관함</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-stone-200 text-stone-700">
              {(reservation.attachedImages?.length || 0) + (reservation.voucherImageUrl ? 1 : 0)}
            </span>
          </button>
        </div>

        {activeTab === 'ticket' ? (
          <div className="p-6 max-h-[80vh] overflow-y-auto space-y-5">
            {/* Ticket Header Card */}
            <div className={`p-5 rounded-2xl ${theme.headerBg} shadow-md`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/20 text-white backdrop-blur-sm mb-1.5">
                    {theme.typeLabel}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-white">{reservation.title}</h3>
                  <p className="text-white/80 text-sm mt-0.5">{reservation.provider}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white text-stone-900 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    확정됨 (CONFIRMED)
                  </span>
                  <div className="text-xs text-white/70 mt-1 font-mono">{reservation.city}</div>
                </div>
              </div>

              {/* Confirmation Code Strip */}
              <div className="mt-4 pt-3.5 border-t border-white/20 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-white/70 block">
                    예약 번호 (CONFIRMATION CODE)
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-black tracking-wider text-amber-200">
                    {reservation.confirmationCode}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-medium backdrop-blur-sm transition-colors flex items-center gap-1.5"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>복사 완료!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>예약번호 복사</span>
                    </>
                  )}
                </button>
              </div>

              {reservation.secondaryCode && (
                <div className="mt-2 text-xs text-white/70 font-mono">
                  부가 참조번호: {reservation.secondaryCode}
                </div>
              )}
            </div>

            {/* QR / Barcode High Visibility Box */}
            <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-2xl p-6 text-center">
              <div className="inline-block p-4 bg-white rounded-2xl shadow-lg border border-stone-200">
                {/* SVG High Resolution QR Code Simulation */}
                <div className="w-48 h-48 mx-auto flex flex-col items-center justify-center bg-white p-2 border border-stone-100 rounded-xl relative group">
                  <svg className="w-44 h-44 text-stone-900" viewBox="0 0 100 100" fill="currentColor">
                    {/* Outer corners */}
                    <rect x="5" y="5" width="28" height="28" rx="4" fill="currentColor" />
                    <rect x="9" y="9" width="20" height="20" rx="2" fill="white" />
                    <rect x="13" y="13" width="12" height="12" rx="1" fill="currentColor" />

                    <rect x="67" y="5" width="28" height="28" rx="4" fill="currentColor" />
                    <rect x="71" y="9" width="20" height="20" rx="2" fill="white" />
                    <rect x="75" y="13" width="12" height="12" rx="1" fill="currentColor" />

                    <rect x="5" y="67" width="28" height="28" rx="4" fill="currentColor" />
                    <rect x="9" y="71" width="20" height="20" rx="2" fill="white" />
                    <rect x="13" y="75" width="12" height="12" rx="1" fill="currentColor" />

                    {/* QR grid details */}
                    <rect x="38" y="8" width="8" height="8" fill="currentColor" />
                    <rect x="50" y="8" width="6" height="6" fill="currentColor" />
                    <rect x="38" y="20" width="12" height="6" fill="currentColor" />
                    <rect x="54" y="20" width="8" height="8" fill="currentColor" />
                    <rect x="38" y="32" width="6" height="12" fill="currentColor" />
                    <rect x="48" y="32" width="16" height="6" fill="currentColor" />

                    <rect x="8" y="38" width="10" height="6" fill="currentColor" />
                    <rect x="22" y="38" width="8" height="8" fill="currentColor" />
                    <rect x="8" y="48" width="12" height="12" fill="currentColor" />
                    <rect x="24" y="50" width="6" height="10" fill="currentColor" />

                    <rect x="68" y="38" width="14" height="6" fill="currentColor" />
                    <rect x="86" y="38" width="6" height="14" fill="currentColor" />
                    <rect x="70" y="48" width="8" height="12" fill="currentColor" />
                    <rect x="82" y="56" width="10" height="6" fill="currentColor" />

                    <rect x="38" y="68" width="8" height="12" fill="currentColor" />
                    <rect x="50" y="68" width="12" height="6" fill="currentColor" />
                    <rect x="42" y="84" width="20" height="8" fill="currentColor" />
                    <rect x="68" y="72" width="12" height="8" fill="currentColor" />
                    <rect x="84" y="72" width="8" height="14" fill="currentColor" />
                    <rect x="72" y="84" width="8" height="8" fill="currentColor" />
                  </svg>
                  <div className="absolute inset-0 bg-stone-900/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                    <span className="px-3 py-1 bg-stone-900 text-white text-xs rounded-full shadow-lg">
                      스캔 가능 상태
                    </span>
                  </div>
                </div>
                <div className="mt-2 font-mono text-[11px] text-stone-500 break-all max-w-xs mx-auto">
                  {reservation.qrCodeValue}
                </div>
              </div>

              {/* Barcode line simulation */}
              {reservation.barcodeValue && (
                <div className="mt-4 pt-4 border-t border-stone-200">
                  <div className="flex items-center justify-center gap-1 h-12 w-64 mx-auto bg-white p-2 rounded-lg border border-stone-200">
                    {Array.from({ length: 42 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-full bg-stone-900"
                        style={{
                          width: `${(i % 3) + 1.5}px`,
                          opacity: i % 5 === 0 ? 0.3 : 1,
                        }}
                      />
                    ))}
                  </div>
                  <div className="mt-1 font-mono text-xs text-stone-600">
                    *{reservation.barcodeValue}*
                  </div>
                </div>
              )}
              <p className="mt-3 text-xs text-stone-600">
                💡 <strong>현장 팁:</strong> 개찰구 또는 박물관 입장 시 이 화면을 그대로 검표원이나 자동 스캐너에 태그하세요.
              </p>
            </div>

            {/* Detailed Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-stone-200 text-sm">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-stone-600 block">이용 날짜 (Date)</span>
                  <span className="font-semibold text-stone-800">{reservation.date}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-stone-600 block">이용 시간 / 슬롯 (Time)</span>
                  <span className="font-semibold text-stone-800">{reservation.time}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-stone-600 block">예약자 성명 (Passenger/Guest)</span>
                  <span className="font-semibold text-stone-800">{reservation.passengerOrGuest}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-stone-600 block">장소 / 위치 (Location)</span>
                  <span className="font-semibold text-stone-800">{reservation.location}</span>
                </div>
              </div>

              {/* Dynamic properties based on category */}
              {reservation.details.carriage && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 col-span-1">
                  <span className="text-xs text-rose-600 font-medium block">기차 호차 (Carrozza)</span>
                  <span className="text-base font-bold text-rose-950">{reservation.details.carriage}</span>
                </div>
              )}

              {reservation.details.seat && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 col-span-1">
                  <span className="text-xs text-rose-600 font-medium block">좌석 번호 (Posto / Seat)</span>
                  <span className="text-base font-bold text-rose-950">{reservation.details.seat}</span>
                </div>
              )}

              {reservation.details.platform && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 col-span-1">
                  <span className="text-xs text-amber-700 font-medium block">탑승 플랫폼 (Binario)</span>
                  <span className="text-sm font-bold text-amber-950">{reservation.details.platform}</span>
                </div>
              )}

              {reservation.details.roomType && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 col-span-2">
                  <span className="text-xs text-amber-700 font-medium block">객실 타입 (Room Type)</span>
                  <span className="text-sm font-bold text-amber-950">{reservation.details.roomType}</span>
                </div>
              )}

              {reservation.details.entranceGate && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 col-span-2">
                  <span className="text-xs text-emerald-700 font-medium block">전용 입장 게이트 (Entrance Gate)</span>
                  <span className="text-sm font-bold text-emerald-950">{reservation.details.entranceGate}</span>
                </div>
              )}

              {reservation.details.price && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 col-span-1 sm:col-span-2 flex justify-between items-center">
                  <span className="text-xs text-stone-600">결제 완료 금액 (Paid)</span>
                  <span className="text-base font-bold text-stone-900">{reservation.details.price}</span>
                </div>
              )}
            </div>

            {/* Dress code & Warnings */}
            {reservation.details.dressCode && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block text-amber-950">복장 규정 (Dress Code):</strong>
                  {reservation.details.dressCode}
                </div>
              </div>
            )}

            {/* Notes */}
            {reservation.notes && (
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1">
                <span className="font-semibold text-stone-800 block">📌 참고 사항 및 유의점</span>
                <p className="leading-relaxed">{reservation.notes}</p>
              </div>
            )}
          </div>
        ) : (
          /* Attachments & Saved Photos tab */
          <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
            <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-2xl p-6 text-center">
              <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-stone-800">예약증 사진 또는 PDF 캡처 업로드</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                모바일 갤러리나 이메일에서 캡처한 바우처 사진을 추가하면, 데이터 통신이 끊겨도 이 앱 내에서 즉시 열람할 수 있습니다.
              </p>
              <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                사진 파일 선택하기
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Image Gallery */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-stone-900">저장된 바우처 이미지 목록</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reservation.voucherImageUrl && (
                  <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-sm group">
                    <img
                      src={reservation.voucherImageUrl}
                      alt="Primary Voucher"
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                      <span className="text-white text-xs font-medium">기본 티켓 / 확인 이미지</span>
                    </div>
                  </div>
                )}
                {reservation.attachedImages?.map((imgUrl, idx) => (
                  <div key={idx} className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-sm group">
                    <img
                      src={imgUrl}
                      alt={`Attached Voucher ${idx + 1}`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                      <span className="text-white text-xs font-medium">첨부 사진 #{idx + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
              {!reservation.voucherImageUrl && (!reservation.attachedImages || reservation.attachedImages.length === 0) && (
                <div className="text-center py-8 text-stone-400 text-xs">
                  아직 첨부된 사진이 없습니다. 위 업로드 버튼으로 캡처 사진을 추가해보세요.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors"
          >
            닫기
          </button>
          <button
            onClick={handleCopyCode}
            className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>예약번호({reservation.confirmationCode}) 복사</span>
          </button>
        </div>
      </div>
    </div>
  );
};
