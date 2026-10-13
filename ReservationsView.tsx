import React, { useState } from 'react';
import { Reservation, ReservationCategory } from '../types/travel';
import {
  Plane,
  Hotel,
  Train,
  Ticket,
  Utensils,
  Compass,
  QrCode,
  Copy,
  Check,
  Calendar,
  Clock,
  MapPin,
  Plus,
  ShieldCheck,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

interface ReservationsViewProps {
  reservations: Reservation[];
  onSelectReservation: (res: Reservation) => void;
  onAddReservation: (res: Reservation) => void;
}

export const ReservationsView: React.FC<ReservationsViewProps> = ({
  reservations,
  onSelectReservation,
  onAddReservation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New reservation form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ReservationCategory>('ticket');
  const [newProvider, setNewProvider] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDate, setNewDate] = useState('2026-10-18');
  const [newTime, setNewTime] = useState('10:00');
  const [newCity, setNewCity] = useState('피렌체');
  const [newLocation, setNewLocation] = useState('');
  const [newSeat, setNewSeat] = useState('');

  const handleCopy = (e: React.MouseEvent, res: Reservation) => {
    e.stopPropagation();
    navigator.clipboard.writeText(res.confirmationCode);
    setCopiedId(res.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryIcon = (category: ReservationCategory) => {
    switch (category) {
      case 'flight':
        return <Plane className="w-5 h-5 text-sky-600" />;
      case 'hotel':
        return <Hotel className="w-5 h-5 text-amber-600" />;
      case 'train':
        return <Train className="w-5 h-5 text-red-600" />;
      case 'ticket':
        return <Ticket className="w-5 h-5 text-emerald-600" />;
      case 'dining':
        return <Utensils className="w-5 h-5 text-orange-600" />;
      default:
        return <Compass className="w-5 h-5 text-stone-600" />;
    }
  };

  const getCategoryBadgeClass = (category: ReservationCategory) => {
    switch (category) {
      case 'flight':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'hotel':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'train':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'ticket':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'dining':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };

  const filtered = reservations.filter((r) => {
    const matchCat = selectedCategory === 'all' || r.category === selectedCategory;
    const matchCity = selectedCity === 'all' || r.city.includes(selectedCity);
    return matchCat && matchCity;
  });

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCode.trim()) return;

    const newRes: Reservation = {
      id: `res-custom-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      provider: newProvider || '직접 등록',
      confirmationCode: newCode,
      date: newDate,
      time: newTime,
      city: newCity,
      location: newLocation || newCity,
      status: 'confirmed',
      passengerOrGuest: '여행자',
      details: {
        seat: newSeat,
      },
      qrCodeValue: `${newCode}-${newDate}`,
    };

    onAddReservation(newRes);
    setShowAddModal(false);
    // Reset
    setNewTitle('');
    setNewCode('');
    setNewLocation('');
    setNewSeat('');
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              인앱 전용 바우처 보관함
            </span>
            <span className="text-stone-400 text-xs">사진앱 검색 없이 즉시 제시</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">이탈리아 여행 예약 목록 & 디지털 바우처</h2>
          <p className="text-stone-300 text-sm mt-1 max-w-xl">
            항공권, 3개 도시 호텔, 프레차로사/이탈로 고속기차, 바티칸·콜로세움 패스트트랙, 미식 레스토랑 예약 번호와 QR코드를 한곳에서 간편하게 확인하세요.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition-transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          예약/바우처 직접 추가
        </button>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: '전체', count: reservations.length },
            { id: 'flight', label: '✈️ 항공', count: reservations.filter((r) => r.category === 'flight').length },
            { id: 'hotel', label: '🏨 숙소', count: reservations.filter((r) => r.category === 'hotel').length },
            { id: 'train', label: '🚆 기차', count: reservations.filter((r) => r.category === 'train').length },
            { id: 'ticket', label: '🎟️ 티켓/투어', count: reservations.filter((r) => r.category === 'ticket' || r.category === 'activity').length },
            { id: 'dining', label: '🍽️ 레스토랑', count: reservations.filter((r) => r.category === 'dining').length },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  selectedCategory === cat.id ? 'bg-stone-700 text-white' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* City Filter */}
        <div className="flex items-center gap-1 text-xs shrink-0">
          <span className="text-stone-600 text-xs mr-1">도시:</span>
          {['all', '로마', '피렌체', '베네치아', '밀라노'].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedCity === city
                  ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                  : 'bg-white text-stone-500 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              {city === 'all' ? '전체' : city}
            </button>
          ))}
        </div>
      </div>

      {/* Reservation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((res) => (
          <div
            key={res.id}
            onClick={() => onSelectReservation(res)}
            className="group relative bg-white rounded-3xl p-5 border border-stone-200 hover:border-stone-400 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-100 group-hover:scale-105 transition-transform">
                    {getCategoryIcon(res.category)}
                  </div>
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${getCategoryBadgeClass(res.category)}`}>
                      {res.category.toUpperCase()}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 group-hover:text-stone-950 transition-colors line-clamp-1">
                      {res.title}
                    </h3>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  확정
                </span>
              </div>

              {/* Confirmation Code Box */}
              <div className="bg-stone-50 group-hover:bg-amber-50/50 p-3 rounded-2xl border border-stone-100 group-hover:border-amber-200 transition-colors flex items-center justify-between mb-3.5">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                    예약 번호 (CONFIRMATION NO.)
                  </span>
                  <span className="font-mono text-base font-black text-stone-900 tracking-wide">
                    {res.confirmationCode}
                  </span>
                </div>
                <button
                  onClick={(e) => handleCopy(e, res)}
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs"
                  title="예약번호 복사"
                >
                  {copiedId === res.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">복사됨!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>복사</span>
                    </>
                  )}
                </button>
              </div>

              {/* Essential Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 mb-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate font-medium">{res.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{res.time}</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{res.location}</span>
                </div>

                {/* Specifics for train / flight / hotel */}
                {res.details.carriage && res.details.seat && (
                  <div className="col-span-2 p-2 bg-rose-50/70 rounded-xl text-rose-900 font-medium flex items-center justify-between">
                    <span>좌석 정보:</span>
                    <span className="font-bold">{res.details.carriage} / {res.details.seat}</span>
                  </div>
                )}
                {res.details.roomType && (
                  <div className="col-span-2 p-2 bg-amber-50/70 rounded-xl text-amber-900 font-medium truncate">
                    객실: <span className="font-bold">{res.details.roomType}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                <QrCode className="w-4 h-4 text-stone-700" />
                <span className="font-medium text-stone-700">인앱 QR 스캔 지원</span>
                {(res.attachedImages?.length || 0) > 0 && (
                  <span className="ml-1 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px]">
                    <ImageIcon className="w-3 h-3" />
                    +{res.attachedImages?.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => onSelectReservation(res)}
                className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
              >
                <span>바우처 보기</span>
                <span className="text-amber-300">➔</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-stone-200">
          <Ticket className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <h4 className="text-base font-bold text-stone-700">해당 조건의 예약 내역이 없습니다.</h4>
          <p className="text-xs text-stone-500 mt-1">상단 필터를 조정하거나 새로운 바우처를 등록해보세요.</p>
        </div>
      )}

      {/* Add New Custom Reservation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6">
            <h3 className="text-lg font-black text-stone-900 mb-1">새 예약 / 현장 바우처 추가</h3>
            <p className="text-xs text-stone-500 mb-4">
              추가한 예약증은 사진앱을 찾을 필요 없이 바로 확인하고 QR코드로 스캔할 수 있습니다.
            </p>

            <form onSubmit={handleCreateReservation} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">카테고리</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ReservationCategory)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none"
                >
                  <option value="ticket">🎟️ 입장권 / 투어</option>
                  <option value="train">🚆 기차 / 교통</option>
                  <option value="hotel">🏨 호텔 / 숙소</option>
                  <option value="flight">✈️ 항공권</option>
                  <option value="dining">🍽️ 레스토랑</option>
                  <option value="activity">⛵ 액티비티</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">예약 제목 *</label>
                <input
                  type="text"
                  placeholder="예: 피렌체 아카데미아 미술관 다비드상 관람"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">예약 번호 (Code) *</label>
                  <input
                    type="text"
                    placeholder="예: ACC-FLR-2026-99"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">예약처 (Provider)</label>
                  <input
                    type="text"
                    placeholder="예: 공식 웹사이트"
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">날짜</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">시간</label>
                  <input
                    type="text"
                    placeholder="예: 11:30"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">도시</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none"
                  >
                    <option value="로마">로마</option>
                    <option value="피렌체">피렌체</option>
                    <option value="베네치아">베네치아</option>
                    <option value="밀라노">밀라노</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">좌석/호차/세부</label>
                  <input
                    type="text"
                    placeholder="예: 3호차 15A"
                    value={newSeat}
                    onChange={(e) => setNewSeat(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">장소 / 주소</label>
                <input
                  type="text"
                  placeholder="예: Via Ricasoli, 58/60, Firenze"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold shadow-md transition-colors"
                >
                  추가하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
