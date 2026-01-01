export type MasterCategory = 'all' | 'barber' | 'tattoo' | 'nails' | 'makeup';

export interface Master {
  id: number;
  name: string;
  category: MasterCategory;
  rating: number;
  reviews: number;
  priceLabel: '$' | '$$' | '$$$';
  priceValue: number;
  address: string;
  image: string;
}

export const CATEGORIES: Array<{ id: MasterCategory; label: string }> = [
  { id: 'all', label: 'All Services' },
  { id: 'barber', label: 'Barbers' },
  { id: 'tattoo', label: 'Tattoo Artists' },
  { id: 'nails', label: 'Nail Artists' },
  { id: 'makeup', label: 'Makeup Artists' },
];

export const SAMPLE_MASTERS: ReadonlyArray<Master> = [
  {
    id: 1,
    name: "Elena's Barbershop",
    category: 'barber',
    rating: 4.9,
    reviews: 127,
    priceLabel: '$$',
    priceValue: 35,
    address: 'Downtown Manhattan',
    image: '/placeholder.svg',
  },
  {
    id: 2,
    name: 'Ink Masters Studio',
    category: 'tattoo',
    rating: 4.8,
    reviews: 89,
    priceLabel: '$$$',
    priceValue: 150,
    address: 'Midtown West',
    image: '/placeholder.svg',
  },
  {
    id: 3,
    name: 'Luxe Nails & Spa',
    category: 'nails',
    rating: 4.7,
    reviews: 203,
    priceLabel: '$$',
    priceValue: 45,
    address: 'East Village',
    image: '/placeholder.svg',
  },
  {
    id: 4,
    name: 'Glamour Beauty Bar',
    category: 'makeup',
    rating: 4.9,
    reviews: 156,
    priceLabel: '$$$',
    priceValue: 120,
    address: 'Upper West Side',
    image: '/placeholder.svg',
  },
  {
    id: 5,
    name: 'Classic Cuts',
    category: 'barber',
    rating: 4.6,
    reviews: 94,
    priceLabel: '$',
    priceValue: 25,
    address: 'Lower East Side',
    image: '/placeholder.svg',
  },
];
