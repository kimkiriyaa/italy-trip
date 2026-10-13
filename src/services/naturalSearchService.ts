import { DayPlan, Reservation, Landmark, DiningSpot, TransportRoute, NaturalSearchResult } from '../types/travel';

export function executeNaturalSearch(
  query: string,
  days: DayPlan[],
  reservations: Reservation[],
  landmarks: Landmark[],
  dining: DiningSpot[],
  transports: TransportRoute[]
): NaturalSearchResult {
  const normalized = query.trim().toLowerCase();

  // Helper matching functions
  const hasKeyword = (keywords: string[]) => keywords.some(k => normalized.includes(k.toLowerCase()));

  // 1. City Tax (도시세) intent
  if (hasKeyword(['도시세', '시티택스', 'city tax', '호텔세', '현장결제'])) {
    return {
      query,
      answerSummary: `🏨 총 예상 도시세(City Tax)는 2인 기준 총 135.60 € (약 20만 원)이며 호텔 프론트 데스크에서 체크인/아웃 시 현장 결제합니다.\n• 로마 나치오날레 (4성급 4박): 60.00 € (7.5€ × 2인 × 4박)\n• 피렌체 발리오니 (4성급 3박): 42.00 € (7.0€ × 2인 × 3박)\n• 베네치아 볼로냐 (4성급 3박): 18.60 € (3.1€ × 2인 × 3박)\n• 로마 인디펜던트 (4성급 1박): 15.00 € (7.5€ × 2인 × 1박)`,
      matchedTheme: 'reservations',
      matchedReservations: reservations.filter(r => r.category === 'hotel'),
      matchedScheduleItems: [],
      matchedDining: [],
      matchedLandmarks: [],
      matchedTransport: [],
      actionPrompt: '각 호텔 바우처 카드에서 체크인 시간 및 예약 확인 번호를 확인하세요.',
    };
  }

  // 2. Dolomiti / Alps Tour intent
  if (hasKeyword(['돌로미티', '뇨미투어', '알프스', '미수리나', '도비아코', '설경', '코르티나'])) {
    const doloRes = reservations.filter(r => r.id === 'res-act-01' || r.title.includes('돌로미티'));
    return {
      query,
      answerSummary: `🏔️ 돌로미티 알프스 설경 투어는 D9 (12월 21일 월요일 07:30)에 출발합니다!\n• 미팅 장소: 메스트레역 앞 플라자 호텔(숙소 호텔 볼로냐 바로 맞은편 도보 1분)\n• 예약번호: EXP-20260921-00006075 (마이리얼트립 확정 완료)\n• 주요 코스: 도비아코 호수, 미수리나 호수, 알프스 샬레 산장 런치, 코르티나 담페초\n• 준비물: 방한 숏패딩, 미끄럼방지 방한화, 핫팩 2개 이상 필수 지참`,
      matchedTheme: 'reservations',
      matchedReservations: doloRes.length > 0 ? doloRes : reservations,
      matchedScheduleItems: [],
      matchedDining: [],
      matchedLandmarks: landmarks.filter(l => l.nameKorean.includes('돌로미티')),
      matchedTransport: [],
      actionPrompt: '아래 뇨미투어 바우처 카드를 클릭하여 예약 상세 내역을 확인하세요.',
    };
  }

  // 3. Trains (Italo / Frecciarossa / PNR / Seats) intent
  if (hasKeyword(['기차', '열차', '이탈로', 'italo', '좌석', '호차', 'pnr', '8904', '8906', '8905', '특등석', '프리마'])) {
    const trainRes = reservations.filter(r => r.category === 'train');
    let summary = `🚄 이탈로 고속열차 3대 승차권이 모두 발권 완료되어 있습니다.\n• 12/17(목) 07:50 로마➔피렌체 (Italo 8904): 2호차 3, 4번 (연석) / PNR: IY59NY\n• 12/20(일) 10:39 피렌체➔베네치아 메스트레 (Italo 8906): 2호차 3, 4번 (연석) / PNR: ZKRZ8X (⚠️메스트레역 하차)\n• 12/23(수) 08:17 베네치아 메스트레➔로마 (Italo 8905): 1호차 13, 16번 (Club Executive 최상위 특등석 1x1 단독석 / Lounge 무료) / PNR: AC5E9P`;

    if (hasKeyword(['8904'])) {
      summary = `Italo 8904 (로마➔피렌체): 12/17(목) 07:50 테르미니역 출발 ➔ 09:31 SMN역 도착, Prima Business 2호차 3번, 4번 (연석) / PNR: IY59NY`;
    } else if (hasKeyword(['8906'])) {
      summary = `Italo 8906 (피렌체➔베네치아): 12/20(일) 10:39 피렌체 SMN역 출발 ➔ 12:42 베네치아 메스트레역 도착, Prima Business 2호차 3번, 4번 (연석) / PNR: ZKRZ8X (도착역: 메스트레역 주의!)`;
    } else if (hasKeyword(['8905', '특등석'])) {
      summary = `Italo 8905 (베네치아➔로마): 12/23(수) 08:17 메스트레역 출발 ➔ 12:12 테르미니역 도착, Club Executive 최상위 특등석 1호차 13번, 16번 단독석 / PNR: AC5E9P (메스트레역 라운지 및 차내 와인 무료)`;
    }

    return {
      query,
      answerSummary: summary,
      matchedTheme: 'reservations',
      matchedReservations: trainRes,
      matchedScheduleItems: [],
      matchedDining: [],
      matchedLandmarks: [],
      matchedTransport: transports,
      actionPrompt: '승차권 카드를 누르면 모바일 검표용 QR코드와 PNR 번호를 크게 확인하실 수 있습니다.',
    };
  }

  // 4. Hotel bookings intent
  if (hasKeyword(['호텔', '숙소', '나치오날레', '발리오니', '볼로냐', '인디펜던트', '체크인', '체크아웃', '숙박'])) {
    const htlRes = reservations.filter(r => r.category === 'hotel');
    return {
      query,
      answerSummary: `🏨 4대 핵심 호텔 예약 확정 내역입니다.\n1. 로마 (4박): 호텔 나치오날레 (12/13~12/17, 판테온 도보 3분 / 예약번호: HTL-WBD-1034447275)\n2. 피렌체 (3박): 그랜드 호텔 발리오니 (12/17~12/20, SMN역 도보 3분 / 예약번호: 34009640)\n3. 베네치아 (3박): BW 플러스 호텔 볼로냐 (12/20~12/23, 메스트레역 도보 1분 주니어 스위트 / 예약번호: 282803268)\n4. 로마 파이널 (1박): 더 인디펜던트 호텔 (12/23~12/24, 테르미니역 도보 4분 / 예약번호: 2610051932040058)`,
      matchedTheme: 'reservations',
      matchedReservations: htlRes,
      matchedScheduleItems: [],
      matchedDining: [],
      matchedLandmarks: [],
      matchedTransport: [],
      actionPrompt: '각 호텔 카드를 클릭하여 현장 제시용 바우처와 구글맵 길찾기를 이용하세요.',
    };
  }

  // 5. The Mall Outlet & Shopping intent
  if (hasKeyword(['더몰', '아울렛', '쇼핑', '구찌', '프라다', '몽클레르', '산타마리아', '약국', '마도바', '장갑', '텍스리펀'])) {
    return {
      query,
      answerSummary: `🛍️ 핵심 쇼핑 일정 안내:\n• 더 몰(The Mall) 아울렛 (D6 12/18): 08:30 SMN역 셔틀버스 탑승 ➔ 09:30 오픈런 (구찌, 프라다, 몽클레르 40~60% 할인, 라운지 즉시 텍스리펀) ➔ 14:30 호텔에 쇼핑백 두고 외출\n• 산타 마리아 노벨라 약국 본점 (D5 12/17): 600년 역사 본점 전용 패키징 프리지아 향수 & 이드랄리아 수분크림\n• 마도바(Madova) 가죽 장갑: 베키오 다리 앞 100% 캐시미어 안감 수제 장갑\n• 텍스리펀: 단일 매장 70.01€ 이상 구매 시 서류 수령 ➔ 12/24 FCO 공항 키오스크 스캔`,
      matchedTheme: 'landmarks',
      matchedReservations: [],
      matchedScheduleItems: [],
      matchedDining: [],
      matchedLandmarks: landmarks.filter(l => l.nameKorean.includes('더 몰')),
      matchedTransport: [],
    };
  }

  // 6. Food & Dining (T-bone, Pizza, Cafe)
  if (hasKeyword(['맛집', '티본', '스테이크', '달오스테', '자자', '피자', '나폴리', '미켈레', '소르빌로', '젤라또', '카페', '타짜도로', '지올리티', '질리', '플로리안'])) {
    let summary = `🍕 도시별 핵심 미식 스팟 안내입니다.`;
    if (hasKeyword(['티본', '스테이크', '달오스테', '자자'])) {
      summary = `🥩 피렌체 티본 스테이크는 D6(12/18) 저녁 만찬 추천!\n• 트라토리아 달오스테: SMN역 인근 와규/키아니나 비프 최고봉 (TheFork 앱 예약 시 20% 할인)\n• 트라토리아 자자: 중앙시장 앞 트러플 파스타와 티본 스테이크로 한국인 선호 1위 (1kg 비스테카 & 키안티 와인 페어링)`;
    } else if (hasKeyword(['피자', '나폴리', '미켈레', '소르빌로'])) {
      summary = `🍕 나폴리 원조 화덕피자 (D4 12/16 당일치기):\n• 다 미켈레 (L'Antica Pizzeria da Michele): 1870년 개업 줄리아 로버츠 피자. 오전 11:00 오픈런 시 대기 없음 (마르게리타 단 5€대)\n• 소르빌로 (Sorbillo): 스파카 나폴리 중심 부라타 화덕피자 명가`;
    } else if (hasKeyword(['젤라또', '카페', '타짜도로', '지올리티'])) {
      summary = `☕ 로마 3대 카페 & 디저트:\n• 타짜 도로: 판테온 옆, 그라니따 디 카페 콘 판나(에스프레소 얼음+생크림)\n• 지올리티: 100년 전통 로마 1등 젤라또 (쌀맛 Riso 필수 주문)\n• 폼피: 스페인 계단 앞 원조 딸기 티라미수`;
    }

    return {
      query,
      answerSummary: summary,
      matchedTheme: 'dining',
      matchedReservations: [],
      matchedScheduleItems: [],
      matchedDining: dining,
      matchedLandmarks: [],
      matchedTransport: [],
    };
  }

  // 7. General Day / Schedule search
  const matchedScheduleItems: { dayNumber: number; item: any }[] = [];
  days.forEach(d => {
    d.schedule.forEach(item => {
      if (
        item.title.toLowerCase().includes(normalized) ||
        item.location.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized) ||
        d.city.toLowerCase().includes(normalized)
      ) {
        matchedScheduleItems.push({ dayNumber: d.dayNumber, item });
      }
    });
  });

  return {
    query,
    answerSummary: `'${query}' 관련 일정 항목 ${matchedScheduleItems.length}건이 매칭되었습니다.`,
    matchedTheme: 'timeline',
    matchedReservations: reservations.filter(r => r.title.toLowerCase().includes(normalized) || r.confirmationCode.toLowerCase().includes(normalized)),
    matchedScheduleItems,
    matchedDining: dining.filter(d => d.name.toLowerCase().includes(normalized)),
    matchedLandmarks: landmarks.filter(l => l.nameKorean.toLowerCase().includes(normalized)),
    matchedTransport: transports.filter(t => t.title.toLowerCase().includes(normalized)),
  };
}
