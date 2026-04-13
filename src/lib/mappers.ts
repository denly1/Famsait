// Утилиты для маппинга данных из БД (snake_case) в формат фронтенда (camelCase)

export function mapEventFromDB(dbEvent: any): any {
  if (!dbEvent) return {
    id: '',
    title: '',
    subtitle: '',
    date: '',
    time: '',
    venue: '',
    address: '',
    ageLimit: '18+',
    price: 0,
    currency: '₽',
    image: '',
    description: '',
    lineup: [],
    features: [],
    isPast: false,
    ticketUrl: '#',
    ticketLink: '#',
    gallery: [],
  };
  
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    subtitle: dbEvent.subtitle || '',
    date: dbEvent.date,
    time: dbEvent.time || '',
    venue: dbEvent.venue || '',
    address: dbEvent.address || '',
    ageLimit: dbEvent.age_limit || '18+',
    price: dbEvent.price || 0,
    currency: dbEvent.currency || '₽',
    image: dbEvent.image || '',
    description: dbEvent.description || '',
    lineup: Array.isArray(dbEvent.lineup) ? dbEvent.lineup : [],
    features: Array.isArray(dbEvent.features) ? dbEvent.features : [],
    isPast: dbEvent.is_past || false,
    isPinned: dbEvent.is_pinned || false,
    hideFromPast: dbEvent.hide_from_past || false,
    ticketUrl: dbEvent.ticket_url || '#',
    ticketLink: dbEvent.ticket_link || dbEvent.ticket_url || '#',
    gallery: Array.isArray(dbEvent.gallery) ? dbEvent.gallery : [],
    isDouble: dbEvent.is_double || false,
    day2Date: dbEvent.day2_date || '',
    day2Time: dbEvent.day2_time || '',
    day2Venue: dbEvent.day2_venue || '',
    day2Address: dbEvent.day2_address || '',
    day2TicketUrl: dbEvent.day2_ticket_url || '',
    day2Description: dbEvent.day2_description || '',
    day2Lineup: Array.isArray(dbEvent.day2_lineup) ? dbEvent.day2_lineup : [],
    day2Features: Array.isArray(dbEvent.day2_features) ? dbEvent.day2_features : [],
  };
}

export function mapEventsFromDB(dbEvents: any[]) {
  return dbEvents.map(mapEventFromDB);
}
