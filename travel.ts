export type ReservationCategory = 'flight' | 'hotel' | 'train' | 'ticket' | 'dining' | 'activity';

export interface Reservation {
  id: string;
  category: ReservationCategory;
  title: string;
  provider: string; // e.g., 대한항공, Trenitalia, 바티칸 미술관, Booking.com
  confirmationCode: string;
  secondaryCode?: string; // PNR, E-Ticket number, or Ticket ID
  date: string;
  time: string;
  location: string;
  city: '로마' | '피렌체' | '베네치아' | '밀라노' | '인천' | string;
  status: 'confirmed' | 'pending' | 'completed';
  passengerOrGuest: string;
  details: {
    seat?: string;
    carriage?: string; // 기차 호차 (Carrozza)
    roomType?: string;
    checkIn?: string;
    checkOut?: string;
    gateOrTerminal?: string;
    platform?: string; // Binario
    partySize?: string;
    duration?: string;
    price?: string;
    dressCode?: string;
    entranceGate?: string;
  };
  qrCodeValue: string;
  barcodeValue?: string;
  voucherImageUrl?: string;
  attachedImages?: string[];
  notes?: string;
  externalLink?: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  location: string;
  category: 'sightseeing' | 'dining' | 'transport' | 'hotel' | 'activity' | 'free_time';
  description: string;
  tip?: string;
  cost?: string;
  reservationId?: string; // connects to reservation voucher
  mapQuery?: string;
  isCompleted?: boolean;
}

export interface DayPlan {
  dayNumber: number;
  date: string;
  dayOfWeek: string;
  city: string;
  title: string;
  themeSummary: string;
  weatherForecast: {
    temp: string;
    condition: string;
    icon: string;
  };
  highlightCover: string;
  schedule: ScheduleItem[];
  tipsForDay: string[];
}

export interface Landmark {
  id: string;
  nameKorean: string;
  nameItalian: string;
  city: string;
  category: '역사/고대' | '미술관/박물관' | '종교/성당' | '광장/전망' | '명소';
  summary: string;
  visitingHours: string;
  admissionFee: string;
  reservationStatus: '예약 완료 (바우처 있음)' | '현장 발권 가능' | '사전 예약 필수' | '무료 입장';
  linkedReservationId?: string;
  proTips: string[];
  dressCodeNotice?: string;
  imageUrl: string;
  locationQuery: string;
}

export interface DiningSpot {
  id: string;
  name: string;
  city: string;
  cuisine: '정통 파스타' | '피자 & 포카차' | '피렌체 티본스테이크' | '해산물 & 리소토' | '젤라또 & 카페' | '에노테카 (와인바)';
  signatureDishes: string[];
  priceRange: '€' | '€€' | '€€€';
  address: string;
  openingHours: string;
  recommendationReason: string;
  reservationTip: string;
  isReserved?: boolean;
  linkedReservationId?: string;
  googleRating: number;
}

export interface TransportRoute {
  id: string;
  type: '고속열차' | '공항철도' | '수상버스 (바포레토)' | '시내지하철/버스' | '도보';
  operator: string; // Trenitalia Frecciarossa, Italo, ACTV, Leonardo Express
  title: string;
  route: string;
  departure: string;
  arrival: string;
  duration: string;
  bookingCode?: string;
  linkedReservationId?: string;
  howToBoard: string[];
  importantNotice: string;
}

export interface DriveTravelFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  webViewLink?: string;
  thumbnailLink?: string;
  iconLink?: string;
  size?: string;
}

export interface NaturalSearchResult {
  query: string;
  answerSummary: string;
  matchedTheme: 'timeline' | 'reservations' | 'landmarks' | 'dining' | 'transport';
  matchedReservations: Reservation[];
  matchedScheduleItems: { dayNumber: number; item: ScheduleItem }[];
  matchedDining: DiningSpot[];
  matchedLandmarks: Landmark[];
  matchedTransport: TransportRoute[];
  actionPrompt?: string;
}
