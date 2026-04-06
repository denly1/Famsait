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
  };
}

export function mapEventsFromDB(dbEvents: any[]) {
  return dbEvents.map(mapEventFromDB);
}
