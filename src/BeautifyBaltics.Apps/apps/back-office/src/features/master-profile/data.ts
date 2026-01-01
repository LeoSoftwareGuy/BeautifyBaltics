export type MasterProfile = {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  priceLabel: '$' | '$$' | '$$$';
  image: string;
  address: string;
  phone: string;
  email: string;
  bio: string;
  portfolio: Array<{ id: number; url: string; alt: string }>;
  services: Array<{ id: number; name: string; duration: string; price: number }>;
  availableSlots: string[];
};

export const MASTER_PROFILES: Record<string, MasterProfile> = {
  '1': {
    id: 1,
    name: "Elena's Barbershop",
    category: 'Barber',
    rating: 4.9,
    reviews: 127,
    priceLabel: '$$',
    image: '/placeholder.svg',
    address: '123 Main Street, Downtown Manhattan, NY 10001',
    phone: '+1 (555) 123-4567',
    email: 'elena@barbershop.com',
    bio: 'With over 10 years of experience, Elena specializes in modern haircuts, classic styles, and beard grooming. Her attention to detail and passion for the craft has made her one of the most sought-after barbers in Manhattan.',
    portfolio: Array.from({ length: 6 }).map((_, idx) => ({
      id: idx + 1,
      url: '/placeholder.svg',
      alt: `Haircut style ${idx + 1}`,
    })),
    services: [
      { id: 1, name: "Men's Haircut", duration: '45 min', price: 35 },
      { id: 2, name: 'Beard Trim', duration: '30 min', price: 20 },
      { id: 3, name: 'Haircut + Beard', duration: '60 min', price: 50 },
      { id: 4, name: 'Hot Towel Shave', duration: '40 min', price: 40 },
      { id: 5, name: 'Hair Color', duration: '90 min', price: 80 },
    ],
    availableSlots: [
      '09:00 AM',
      '10:00 AM',
      '11:00 AM',
      '01:00 PM',
      '02:00 PM',
      '03:00 PM',
      '04:00 PM',
      '05:00 PM',
    ],
  },
};
