// Утилиты для маппинга данных из БД (snake_case) в формат фронтенда (camelCase)

export function mapEventFromDB(dbEvent: any) {
  if (!dbEvent) return null;
  
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
    ticketUrl: dbEvent.ticket_url || '#',
    ticketLink: dbEvent.ticket_link || dbEvent.ticket_url || '#',
    gallery: Array.isArray(dbEvent.gallery) ? dbEvent.gallery : [],
  };
}

export function mapEventsFromDB(dbEvents: any[]) {
  return dbEvents.map(mapEventFromDB).filter(Boolean);
}
