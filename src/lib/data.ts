export interface Event {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  ageLimit: string;
  price: number;
  currency: string;
  image: string;
  description: string;
  lineup: string[];
  features: string[];
  isPast: boolean;
  isLive?: boolean;
  ticketUrl?: string;
  ticketLink?: string;
  gallery?: string[];
  accentColor?: string;
}

export const events: Event[] = [
  {
    id: "uglystephan-march",
    title: "UGLYSTEPHAN В МОСКВЕ",
    subtitle: "by THE FAMILY",
    date: "01.03.2026",
    time: "20:00",
    venue: "BASE",
    address: "ул. Орджоникидзе, 11, стр. 1",
    ageLimit: "16+",
    price: 0,
    currency: "₽",
    image: "/афишафэмэли.jpg",
    description: "Открываем весну концертом на котором вы услышите ваши любимые треки \n\nВыход артиста после 20:00\n\nПромокод — FAMILY\n\nПри себе иметь документ удостоверяющий личность\n\nFC/DC 16+ (Рекомендация)",
    lineup: ["UGLYSTEPHAN"],
    features: ["LIVE CONCERT", "ПРОМОКОД FAMILY"],
    isPast: false,
    isLive: false,
    ticketUrl: "https://moscow.qtickets.events/210374-uglystephan",
    ticketLink: "https://moscow.qtickets.events/210374-uglystephan",
    accentColor: "#8B5CF6",
  },
  {
    id: "tinder-party-feb",
    title: "TINDER PARTY",
    subtitle: "by THE FAMILY x D12 TUSA",
    date: "14.02.2026",
    time: "16:00 – 22:00",
    venue: "ATMOSPHERE MOSCOW",
    address: "Шмитовский пр-д, 32А, стр. 1",
    ageLimit: "14+",
    price: 500,
    currency: "₽",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    description: "Самая романтичная вечеринка года! Найди свою пару на Valentine's Day. Конкурсы, знакомства, музыка и невероятная атмосфера.",
    lineup: ["DJ SMOKE", "MC RICH", "SPECIAL GUESTS"],
    features: ["SPEED DATING", "LOVE ZONE", "PHOTO BOOTH", "COCKTAIL BAR", "LIVE DJ SET"],
    isPast: false,
    ticketUrl: "#",
  },
  {
    id: "neon-nights-feb",
    title: "NEON NIGHTS",
    subtitle: "by THE FAMILY",
    date: "22.02.2026",
    time: "20:00 – 04:00",
    venue: "ARBAT HALL",
    address: "Новый Арбат, 21",
    ageLimit: "18+",
    price: 500,
    currency: "₽",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    description: "Самая яркая неоновая вечеринка этой зимы! Погрузись в атмосферу неона, музыки и драйва. Специальные UV-зоны, неоновый боди-арт и лучшие DJ Москвы.",
    lineup: ["DJ SMOKE", "VANYA VEGA", "LERA FOXX", "MC RICH"],
    features: ["UV ZONE", "NEON BODY ART", "PHOTO BOOTH", "COCKTAIL BAR", "LIVE VOCAL"],
    isPast: false,
    ticketUrl: "#",
    ticketLink: "#",
    accentColor: "#F59E0B",
  },
  {
    id: "family-vibes-march",
    title: "FAMILY VIBES",
    subtitle: "Spring Edition",
    date: "08.03.2026",
    time: "19:00 – 03:00",
    venue: "IZI",
    address: "Басманный пер., 8, стр. 1",
    ageLimit: "18+",
    price: 700,
    currency: "₽",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
    description: "Весенний Family Vibes — вечеринка, которую ты ждал! Три танцпола, лучший звук и атмосфера настоящей семьи.",
    lineup: ["SEEMEE", "BLAGO WHITE", "DJ RELL", "KATE NOVA"],
    features: ["3 ТАНЦПОЛА", "LIVE ВЫСТУПЛЕНИЯ", "ФОТОЗОНА", "МЕРЧ КОРНЕР", "FOOD COURT"],
    isPast: false,
    ticketUrl: "#",
    ticketLink: "#",
    accentColor: "#10B981",
  },
  {
    id: "underground-session",
    title: "UNDERGROUND SESSION",
    subtitle: "by THE FAMILY",
    date: "15.03.2026",
    time: "22:00 – 06:00",
    venue: "ANIMA",
    address: "Сущёвская ул., 21",
    ageLimit: "21+",
    price: 400,
    currency: "₽",
    image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80",
    description: "Андеграунд сессия для настоящих ценителей электронной музыки. Минимал, техно, хаус — только лучшее.",
    lineup: ["TECHNO COLLECTIVE", "MINIMAL MIKE", "DEEP ANNA"],
    features: ["DARK ROOM", "VINYL SET", "SMOKE MACHINE", "LASER SHOW"],
    isPast: false,
    ticketUrl: "#",
    ticketLink: "#",
    accentColor: "#3B82F6",
  },
  {
    id: "summer-rooftop-2025",
    title: "ROOFTOP PARTY",
    subtitle: "Summer 2025",
    date: "15.07.2025",
    time: "18:00 – 02:00",
    venue: "VIBE",
    address: "Бутырская ул., 46, стр. 1",
    ageLimit: "18+",
    price: 600,
    currency: "₽",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
    description: "Легендарная летняя вечеринка на крыше с видом на Москву.",
    lineup: ["DJ SMOKE", "LERA FOXX", "MC RICH"],
    features: ["ROOFTOP VIEW", "SUNSET DJ SET", "COCKTAILS"],
    isPast: true,
    gallery: [
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
      "https://images.unsplash.com/photo-1504680177321-2e6a879aac86?w=600&q=80",
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80",
    ],
  },
  {
    id: "halloween-bash-2025",
    title: "HALLOWEEN BASH",
    subtitle: "by THE FAMILY",
    date: "31.10.2025",
    time: "21:00 – 05:00",
    venue: "CASTLE HALL",
    address: "м. Тушинская",
    ageLimit: "18+",
    price: 800,
    currency: "₽",
    image: "https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=600&q=80",
    description: "Самый страшный и самый крутой Хэллоуин в Москве!",
    lineup: ["VANYA VEGA", "DARK SIDE DJ", "MC HORROR"],
    features: ["КОСТЮМ КОНКУРС", "HORROR ZONE", "FACE PAINTING"],
    isPast: true,
    gallery: [
      "https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?w=600&q=80",
      "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=600&q=80",
      "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600&q=80",
      "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=600&q=80",
    ],
  },
  {
    id: "new-year-2025",
    title: "NEW YEAR PARTY",
    subtitle: "Welcome 2026",
    date: "31.12.2025",
    time: "22:00 – 08:00",
    venue: "PRAVDA",
    address: "ул. Правды, 24, стр. 3",
    ageLimit: "18+",
    price: 1500,
    currency: "₽",
    image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=600&q=80",
    description: "Встречай Новый Год с The Family! 10 часов музыки, шоу и безумия.",
    lineup: ["ALL THE FAMILY DJS", "SPECIAL GUEST", "LIVE BAND"],
    features: ["COUNTDOWN", "FIREWORKS VIEW", "CHAMPAGNE BAR", "CONFETTI SHOW"],
    isPast: true,
    gallery: [
      "https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=600&q=80",
      "https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?w=600&q=80",
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&q=80",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
    ],
  },
];

export const faqItems = [
  {
    question: "Как купить билет?",
    answer: "Билеты можно приобрести на нашем сайте, нажав кнопку «Купить билет» на странице мероприятия. Оплата картой или через СБП. После оплаты билет придёт на вашу почту.",
  },
  {
    question: "Можно ли вернуть билет?",
    answer: "Возврат билета возможен не позднее чем за 48 часов до начала мероприятия. Для возврата напишите нам на почту tusa2026@mail.ru с номером заказа.",
  },
  {
    question: "Есть ли дресс-код?",
    answer: "На большинстве наших мероприятий дресс-код свободный. Для тематических вечеринок мы указываем рекомендации в описании события.",
  },
  {
    question: "Как работают промокоды?",
    answer: "Промокод вводится при покупке билета. Скидка применяется автоматически. Промокоды нельзя суммировать и использовать повторно.",
  },
  {
    question: "Есть ли возрастные ограничения?",
    answer: "Да, возрастное ограничение указано на каждом мероприятии. Не забудьте взять паспорт — на входе проверяют возраст.",
  },
  {
    question: "Как стать партнёром The Family?",
    answer: "Напишите нам на почту partners@family-moscow.ru или в Telegram @family_partners. Мы открыты к сотрудничеству с брендами, площадками и артистами.",
  },
  {
    question: "Где проходят мероприятия?",
    answer: "Наши мероприятия проходят на лучших площадках Москвы: Arbat Hall, IZI, Anima, Vibe, Base, VK Stadium, Castle Hall, Pravda. Точный адрес указан на странице каждого события.",
  },
];
