import { DayPlan, Reservation, Landmark, DiningSpot, TransportRoute, ScheduleItem } from '../types/travel';

export interface ParsedTravelData {
  days: DayPlan[];
  reservations: Reservation[];
  landmarks: Landmark[];
  diningSpots: DiningSpot[];
  transportRoutes: TransportRoute[];
  summary: string;
}

/**
 * Heuristic & deterministic parser that parses raw text from user's Google Doc, Slides, or text file
 * into structured travel days, reservations, and theme items.
 */
export function parseTravelDocumentText(rawText: string, fileName?: string): ParsedTravelData {
  if (!rawText || rawText.trim().length === 0) {
    throw new Error('문서 내용이 비어 있습니다.');
  }

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // 1. Detect detected cities
  const cityPatterns = [
    { name: '로마', en: 'Rome', kw: ['로마', 'rome', 'roma', '바티칸', 'vatican', '테르미니', 'termini', 'fco'] },
    { name: '피렌체', en: 'Florence', kw: ['피렌체', 'florence', 'firenze', '우피치', 'uffizi', '두오모', 'smn', '산타마리아노벨라'] },
    { name: '베네치아', en: 'Venice', kw: ['베네치아', '베니스', 'venice', 'venezia', '산마르코', '부라노', '무라노', '산타루치아', '바포레토', '곤돌라'] },
    { name: '밀라노', en: 'Milan', kw: ['밀라노', 'milan', 'milano', '말펜사', 'mxp', '센트럴', '첸트랄레'] },
    { name: '나폴리/남부', en: 'Napoli/Amalfi', kw: ['나폴리', '포지타노', '소렌토', '카프리', '아말피', '폼페이'] },
    { name: '토스카나', en: 'Tuscany', kw: ['토스카나', '시에나', '산지미냐노', '피사', '키안티'] },
  ];

  // 2. Split lines into Day blocks if pattern exists (Day 1, 1일차, 10/15, 10월 15일, etc.)
  interface RawDayBlock {
    dayNum: number;
    rawHeader: string;
    dateStr: string;
    lines: string[];
  }

  const dayBlocks: RawDayBlock[] = [];
  let currentBlock: RawDayBlock | null = null;

  // Regex patterns for day headers
  const dayHeaderRegex = /^(?:\[?(?:day\s*(\d+)|(\d+)\s*일차|(\d+)\s*일)\]?|(\d{1,2}\s*[월\/\.\-]\s*\d{1,2}\s*일?))/i;
  const dateExtractionRegex = /(\d{4}[년\.\-\/])?\s*(\d{1,2})[월\.\-\/]\s*(\d{1,2})일?/;

  let inferredDayCount = 0;

  for (const line of lines) {
    const dayMatch = line.match(dayHeaderRegex);
    if (dayMatch && (line.length < 50 || line.startsWith('#') || line.startsWith('['))) {
      inferredDayCount++;
      const num = dayMatch[1] || dayMatch[2] || dayMatch[3] || String(inferredDayCount);
      const dateMatch = line.match(dateExtractionRegex);
      const extractedDate = dateMatch ? `${dateMatch[2]}월 ${dateMatch[3]}일` : '';

      currentBlock = {
        dayNum: parseInt(num, 10) || inferredDayCount,
        rawHeader: line,
        dateStr: extractedDate,
        lines: [],
      };
      dayBlocks.push(currentBlock);
    } else if (currentBlock) {
      currentBlock.lines.push(line);
    }
  }

  // If no explicit Day blocks found, split document into logical chunks
  if (dayBlocks.length === 0) {
    // Group lines into sections
    const chunkSize = Math.max(3, Math.ceil(lines.length / 5));
    for (let i = 0; i < lines.length; i += chunkSize) {
      const chunk = lines.slice(i, i + chunkSize);
      inferredDayCount++;
      dayBlocks.push({
        dayNum: inferredDayCount,
        rawHeader: `Day ${inferredDayCount}`,
        dateStr: '',
        lines: chunk,
      });
    }
  }

  // 3. Extract Reservations from the entire raw text
  const extractedReservations: Reservation[] = [];

  // Patterns for booking codes, PNRs, ticket numbers
  const pnrRegex = /(?:예약번호|예약코드|확인번호|PNR|Booking\s*(?:Ref|Code|No\.?)|Ticket\s*No\.?)\s*[:：\-]?\s*([A-Z0-9\-_]{4,20})/gi;
  let pnrMatch: RegExpExecArray | null;
  const foundCodes = new Set<string>();

  while ((pnrMatch = pnrRegex.exec(rawText)) !== null) {
    const code = pnrMatch[1].trim();
    if (code.length >= 4 && !foundCodes.has(code)) {
      foundCodes.add(code);
    }
  }

  // Look for specific reservation-worthy mentions in lines
  let resIdx = 1;

  for (const line of lines) {
    const lower = line.toLowerCase();

    // Flight check
    if (lower.includes('항공') || lower.includes('비행기') || lower.includes('flight') || lower.includes('ke') || lower.includes('oz') || lower.includes('fco') || lower.includes('icn')) {
      const codeMatch = line.match(/([A-Z0-9]{5,15})/);
      const code = codeMatch ? codeMatch[1] : `FLT-IT-${1000 + resIdx}`;
      if (!extractedReservations.some((r) => r.category === 'flight' && r.title === line)) {
        extractedReservations.push({
          id: `res-usr-flt-${resIdx++}`,
          category: 'flight',
          title: line.replace(/[#\*\-]/g, '').slice(0, 40).trim(),
          provider: lower.includes('대한항공') ? '대한항공' : lower.includes('아시아나') ? '아시아나항공' : '항공사',
          confirmationCode: code,
          date: '일정표 참조',
          time: '운항 스케줄 확인',
          location: '공항 탑승구',
          city: lower.includes('로마') ? '로마' : lower.includes('밀라노') ? '밀라노' : '이탈리아',
          status: 'confirmed',
          passengerOrGuest: '탑승객 본인',
          details: { gateOrTerminal: '터미널 전광판 확인' },
          qrCodeValue: `${code}-FLIGHT-TICKET`,
          notes: line,
        });
      }
    }

    // Hotel check
    if (lower.includes('호텔') || lower.includes('숙소') || lower.includes('hotel') || lower.includes('체크인') || lower.includes('숙박')) {
      const codeMatch = line.match(/([A-Z0-9]{5,15})/);
      const code = codeMatch ? codeMatch[1] : `HTL-IT-${2000 + resIdx}`;
      if (!extractedReservations.some((r) => r.category === 'hotel' && r.title === line)) {
        extractedReservations.push({
          id: `res-usr-htl-${resIdx++}`,
          category: 'hotel',
          title: line.replace(/[#\*\-]/g, '').slice(0, 45).trim(),
          provider: lower.includes('부킹닷컴') ? 'Booking.com' : lower.includes('아고다') ? 'Agoda' : '호텔 예약처',
          confirmationCode: code,
          date: '체크인 날짜',
          time: '체크인 15:00 권장',
          location: line.slice(0, 40),
          city: lower.includes('피렌체') ? '피렌체' : lower.includes('베네치아') ? '베네치아' : lower.includes('밀라노') ? '밀라노' : '로마',
          status: 'confirmed',
          passengerOrGuest: '투숙객 본인',
          details: { roomType: '예약 객실' },
          qrCodeValue: `${code}-HOTEL-VOUCHER`,
          notes: line,
        });
      }
    }

    // Train check
    if (lower.includes('기차') || lower.includes('열차') || lower.includes('이탈로') || lower.includes('italo') || lower.includes('트렌이탈리아') || lower.includes('trenitalia') || lower.includes('freccia')) {
      const codeMatch = line.match(/([A-Z0-9]{5,15})/);
      const code = codeMatch ? codeMatch[1] : `TRN-IT-${3000 + resIdx}`;
      if (!extractedReservations.some((r) => r.category === 'train' && r.title === line)) {
        extractedReservations.push({
          id: `res-usr-trn-${resIdx++}`,
          category: 'train',
          title: line.replace(/[#\*\-]/g, '').slice(0, 45).trim(),
          provider: lower.includes('이탈로') ? 'Italo' : 'Trenitalia',
          confirmationCode: code,
          date: '승차일',
          time: '출발 시간',
          location: '기차역',
          city: lower.includes('피렌체') ? '피렌체' : lower.includes('베네치아') ? '베네치아' : '로마',
          status: 'confirmed',
          passengerOrGuest: '승객',
          details: { carriage: '탑승 호차', seat: '지정 좌석' },
          qrCodeValue: `${code}-TREN-QR`,
          notes: line,
        });
      }
    }

    // Ticket check (Museums, Vatican, Colosseum, etc.)
    if (lower.includes('입장') || lower.includes('바티칸') || lower.includes('콜로세움') || lower.includes('우피치') || lower.includes('두오모') || lower.includes('쿠폴라') || lower.includes('투어') || lower.includes('패스트트랙')) {
      const codeMatch = line.match(/([A-Z0-9]{5,15})/);
      const code = codeMatch ? codeMatch[1] : `TKT-IT-${4000 + resIdx}`;
      if (!extractedReservations.some((r) => r.category === 'ticket' && r.title === line)) {
        extractedReservations.push({
          id: `res-usr-tkt-${resIdx++}`,
          category: 'ticket',
          title: line.replace(/[#\*\-]/g, '').slice(0, 45).trim(),
          provider: '공식 티켓 발권처',
          confirmationCode: code,
          date: '입장일',
          time: '예약 입장 슬롯',
          location: line.slice(0, 35),
          city: lower.includes('피렌체') ? '피렌체' : lower.includes('베네치아') ? '베네치아' : '로마',
          status: 'confirmed',
          passengerOrGuest: '입장객',
          details: { entranceGate: '사전 예약 전용 게이트' },
          qrCodeValue: `${code}-MUSEUM-PASS`,
          notes: line,
        });
      }
    }
  }

  // 4. Construct DayPlan objects from dayBlocks
  const constructedDays: DayPlan[] = dayBlocks.map((block, idx) => {
    // Detect city for this day
    const combinedText = block.rawHeader + ' ' + block.lines.join(' ');
    let detectedCity = '이탈리아';
    for (const cp of cityPatterns) {
      if (cp.kw.some((k) => combinedText.toLowerCase().includes(k))) {
        detectedCity = cp.name;
        break;
      }
    }

    // Extract schedule items
    const scheduleItems: ScheduleItem[] = [];
    let itemCounter = 1;

    for (const l of block.lines) {
      const clean = l.replace(/^[\-\*\•\d\.\s]+/, '').trim();
      if (clean.length < 3) continue;

      // Extract time if any (e.g., 09:00, 14:30)
      const timeMatch = clean.match(/(\d{1,2}[:시]\s*\d{0,2})/);
      const timeStr = timeMatch ? timeMatch[0] : `${9 + (itemCounter * 2)}:00`;

      let category: ScheduleItem['category'] = 'sightseeing';
      if (clean.includes('식사') || clean.includes('점심') || clean.includes('저녁') || clean.includes('맛집') || clean.includes('카페') || clean.includes('파스타') || clean.includes('피자')) {
        category = 'dining';
      } else if (clean.includes('이동') || clean.includes('기차') || clean.includes('비행기') || clean.includes('공항') || clean.includes('버스') || clean.includes('지하철')) {
        category = 'transport';
      } else if (clean.includes('호텔') || clean.includes('체크인') || clean.includes('체크아웃') || clean.includes('숙소')) {
        category = 'hotel';
      } else if (clean.includes('투어') || clean.includes('체험') || clean.includes('곤돌라') || clean.includes('와인')) {
        category = 'activity';
      }

      // Check if matches an extracted reservation
      const matchingRes = extractedReservations.find(
        (r) => clean.toLowerCase().includes(r.title.toLowerCase().slice(0, 10)) || r.title.toLowerCase().includes(clean.toLowerCase().slice(0, 10))
      );

      scheduleItems.push({
        id: `usr-s-${block.dayNum}-${itemCounter++}`,
        time: timeStr,
        title: clean.slice(0, 50),
        location: `${detectedCity} 주요 명소`,
        category,
        description: clean,
        reservationId: matchingRes ? matchingRes.id : undefined,
      });

      if (scheduleItems.length >= 7) break; // keep each day readable
    }

    // Fallback if day had no sub-items
    if (scheduleItems.length === 0) {
      scheduleItems.push({
        id: `usr-s-${block.dayNum}-1`,
        time: '전일 일정',
        title: block.rawHeader.replace(/[#\*\[\]]/g, '').trim(),
        location: detectedCity,
        category: 'sightseeing',
        description: block.lines.join(' ').slice(0, 120) || '자유 일정 및 현지 탐방',
      });
    }

    const defaultCovers = [
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549144511-f099e773c147?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=900&auto=format&fit=crop&q=80',
    ];

    return {
      dayNumber: block.dayNum,
      date: block.dateStr || `Day ${block.dayNum}`,
      dayOfWeek: ['월', '화', '수', '목', '금', '토', '일'][(idx) % 7] + '요일',
      city: detectedCity,
      title: block.rawHeader.replace(/[#\*\[\]]/g, '').trim() || `${detectedCity} 일정`,
      themeSummary: block.lines.slice(0, 2).join(' ') || `${detectedCity} 핵심 관광 및 이동`,
      weatherForecast: {
        temp: '21°C / 13°C',
        condition: '쾌청함',
        icon: '☀️',
      },
      highlightCover: defaultCovers[idx % defaultCovers.length],
      schedule: scheduleItems,
      tipsForDay: [
        '소지품 및 소매치기 유의 (가방 앞으로 메기)',
        '대중교통 이용 전 검표기(타임스탬프) 확인 필수',
      ],
    };
  });

  // 5. Build Landmarks from mentions
  const extractedLandmarks: Landmark[] = [];
  const knownLandmarks = [
    { name: '콜로세움', it: 'Colosseo', city: '로마', cat: '역사/고대' as const, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=900&auto=format&fit=crop&q=80' },
    { name: '바티칸 박물관', it: 'Musei Vaticani', city: '로마', cat: '미술관/박물관' as const, img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=80' },
    { name: '트레비 분수', it: 'Fontana di Trevi', city: '로마', cat: '광장/전망' as const, img: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=900&auto=format&fit=crop&q=80' },
    { name: '판테온', it: 'Pantheon', city: '로마', cat: '역사/고대' as const, img: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=900&auto=format&fit=crop&q=80' },
    { name: '피렌체 두오모 쿠폴라', it: 'Duomo di Firenze', city: '피렌체', cat: '종교/성당' as const, img: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?w=900&auto=format&fit=crop&q=80' },
    { name: '우피치 미술관', it: 'Gallerie degli Uffizi', city: '피렌체', cat: '미술관/박물관' as const, img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=80' },
    { name: '산마르코 광장', it: 'Piazza San Marco', city: '베네치아', cat: '광장/전망' as const, img: 'https://images.unsplash.com/photo-1523906834658-6e2522d4282d?w=900&auto=format&fit=crop&q=80' },
    { name: '부라노 섬', it: 'Isola di Burano', city: '베네치아', cat: '명소' as const, img: 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=900&auto=format&fit=crop&q=80' },
    { name: '밀라노 대성당 (두오모)', it: 'Duomo di Milano', city: '밀라노', cat: '종교/성당' as const, img: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=900&auto=format&fit=crop&q=80' },
  ];

  for (const kl of knownLandmarks) {
    if (rawText.includes(kl.name) || rawText.includes(kl.it)) {
      const matchRes = extractedReservations.find((r) => r.title.includes(kl.name) || r.title.includes(kl.it));
      extractedLandmarks.push({
        id: `lm-usr-${kl.it.toLowerCase().replace(/\s+/g, '-')}`,
        nameKorean: kl.name,
        nameItalian: kl.it,
        city: kl.city,
        category: kl.cat,
        summary: `${kl.city}의 필수 방문 명소로, 문서 일정표에 포함되어 있습니다.`,
        visitingHours: '일정표 참조',
        admissionFee: matchRes ? '예약 완료' : '현장 확인',
        reservationStatus: matchRes ? '예약 완료 (바우처 있음)' : '현장 발권 가능',
        linkedReservationId: matchRes ? matchRes.id : undefined,
        proTips: ['사전 예약 바우처와 여권을 지참하세요.'],
        imageUrl: kl.img,
        locationQuery: `${kl.it}, ${kl.city}`,
      });
    }
  }

  // 6. Build Dining from mentions
  const extractedDining: DiningSpot[] = [];
  for (const line of lines) {
    if (line.includes('식당') || line.includes('맛집') || line.includes('레스토랑') || line.includes('Trattoria') || line.includes('Osteria') || line.includes('Ristorante')) {
      const cleanName = line.replace(/[#\*\-]/g, '').slice(0, 35).trim();
      extractedDining.push({
        id: `din-usr-${extractedDining.length + 1}`,
        name: cleanName,
        city: cleanName.includes('피렌체') ? '피렌체' : cleanName.includes('베네치아') ? '베네치아' : '로마',
        cuisine: cleanName.includes('스테이크') ? '피렌체 티본스테이크' : cleanName.includes('피자') ? '피자 & 포카차' : '정통 파스타',
        signatureDishes: ['현지 대표 추천 메뉴'],
        priceRange: '€€',
        address: '일정표 참조',
        openingHours: '12:00 ~ 22:30',
        recommendationReason: '사용자 여행 일정 문서에 기재된 식당입니다.',
        reservationTip: '방문 전 예약 확인 권장',
        googleRating: 4.6,
      });
      if (extractedDining.length >= 6) break;
    }
  }

  // 7. Build Transport routes from train/flight mentions
  const extractedTransport: TransportRoute[] = extractedReservations
    .filter((r) => r.category === 'train' || r.category === 'flight')
    .map((r, i) => ({
      id: `tr-usr-${i + 1}`,
      type: r.category === 'train' ? '고속열차' : '공항철도',
      operator: r.provider,
      title: r.title,
      route: `${r.city} 구간`,
      departure: r.time,
      arrival: '도착지',
      duration: '일정표 참조',
      bookingCode: r.confirmationCode,
      linkedReservationId: r.id,
      howToBoard: ['승무원 검표 시 모바일 QR코드 제시', '플랫폼 번호(Binario) 전광판 확인'],
      importantNotice: '출발 최소 15분 전 플랫폼에 대기하세요.',
    }));

  return {
    days: constructedDays.length > 0 ? constructedDays : [],
    reservations: extractedReservations,
    landmarks: extractedLandmarks,
    diningSpots: extractedDining,
    transportRoutes: extractedTransport,
    summary: `문서 분석 완료: 총 ${constructedDays.length}일간의 일정과 ${extractedReservations.length}개의 예약 항목이 감지되었습니다.`,
  };
}
