import React from 'react';
import { TransportRoute } from '../types/travel';
import {
  Train,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface TransportViewProps {
  transports: TransportRoute[];
  onOpenReservation?: (resId: string) => void;
}

export const TransportView: React.FC<TransportViewProps> = ({
  transports,
  onOpenReservation,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
          Trenitalia • Italo • ACTV Vaporetto
        </span>
        <h2 className="text-2xl font-black text-stone-900 mt-1">도시 간 이동 & 현지 교통 가이드</h2>
        <p className="text-xs text-stone-600 mt-1 max-w-2xl">
          로마-피렌체-베네치아-밀라노를 잇는 고속열차 탑승 방법, 플랫폼(Binario) 확인 요령, 수상버스 단말기 태그 필수 주의사항입니다.
        </p>

        {/* Essential Italy Transport Alert */}
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold text-amber-950 block">
              ⚠️ 이탈리아 대중교통 이용 시 필수 주의사항 (과태료 방지)
            </strong>
            <p>
              • <strong>종이 티켓 및 수상버스(바포레토):</strong> 탑승 전 플랫폼 또는 선착장의 노란색/녹색 검표기(Oblitera)에 반드시 태그(펀칭)해야 합니다. 미검표 시 최대 €60 이상의 벌금이 즉시 부과됩니다.
            </p>
            <p>
              • <strong>고속열차(Frecciarossa/Italo):</strong> 좌석 지정 티켓의 QR 코드는 앱 내 바우처 화면을 열어 승무원 검표 시 그대로 보여주시면 됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* Transport Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {transports.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-stone-200 hover:border-stone-400 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-stone-100 text-stone-900">
                    <Train className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
                      {item.operator}
                    </span>
                    <h3 className="text-base font-bold text-stone-900">{item.title}</h3>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-800 text-xs font-mono font-bold shrink-0">
                  {item.duration}
                </span>
              </div>

              {/* Route pill */}
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 mb-3 text-xs">
                <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{item.route}</span>
                </div>
                <div className="mt-1 flex items-center gap-4 text-stone-500 text-[11px]">
                  <span>출발: {item.departure}</span>
                  <span>도착: {item.arrival}</span>
                </div>
              </div>

              {/* Boarding instructions */}
              <div className="space-y-1.5 text-xs text-stone-600 mb-3">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  탑승 가이드 (How to Board)
                </span>
                {item.howToBoard.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              {/* Warning note */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-[11px] text-stone-700">
                <span className="font-bold text-stone-900">📌 중요 안내: </span>
                {item.importantNotice}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-500 font-mono">
                {item.bookingCode ? `코드: ${item.bookingCode}` : '현장 탑승 가능'}
              </span>

              {item.linkedReservationId && onOpenReservation && (
                <button
                  onClick={() => onOpenReservation(item.linkedReservationId!)}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                >
                  <span>기차표 & QR 열기</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
