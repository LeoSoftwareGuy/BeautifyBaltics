export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export type Booking = {
  id: string;
  masterName: string;
  masterPhoto: string;
  service: string;
  date: string;
  time: string;
  location: string;
  price: number;
  status: BookingStatus;
};

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: '1',
    masterName: 'Maria Santos',
    masterPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    service: 'Haircut & Styling',
    date: '2024-12-15',
    time: '14:00',
    location: '123 Beauty Ave, Downtown',
    price: 85,
    status: 'upcoming',
  },
  {
    id: '2',
    masterName: 'Alex Rivera',
    masterPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    service: 'Tattoo Session',
    date: '2024-12-20',
    time: '10:00',
    location: '456 Art Studio, Midtown',
    price: 250,
    status: 'upcoming',
  },
  {
    id: '3',
    masterName: 'Sofia Chen',
    masterPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    service: 'Manicure & Pedicure',
    date: '2024-11-28',
    time: '16:00',
    location: '789 Nail Salon, Eastside',
    price: 65,
    status: 'completed',
  },
  {
    id: '4',
    masterName: 'James Wilson',
    masterPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    service: 'Beard Trim',
    date: '2024-11-15',
    time: '11:00',
    location: '321 Barber Shop, Westend',
    price: 35,
    status: 'completed',
  },
  {
    id: '5',
    masterName: 'Emma Thompson',
    masterPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    service: 'Hair Coloring',
    date: '2024-11-10',
    time: '09:00',
    location: '555 Color Studio, Central',
    price: 150,
    status: 'cancelled',
  },
];
