import {
  CalendarCheck2,
  CalendarClock,
  LayoutDashboard,
  Palette,
  Search,
  Star,
  UserPlus2,
  UsersRound,
} from 'lucide-react';

export type JourneyStepDefinition = {
  key: string;
  icon: React.ComponentType<{ size?: number }>;
  imageSrc?: string;
  imageAltKey?: string;
  badges?: ('requested' | 'confirmed' | 'completed')[];
};

export const MASTER_STEPS: JourneyStepDefinition[] = [
  {
    key: 'register',
    icon: UserPlus2,
    imageSrc: '/salon.jpg',
    imageAltKey: 'howTo.masters.steps.register.imageAlt',
  },
  { key: 'services', icon: Palette },
  { key: 'availability', icon: CalendarClock },
  {
    key: 'bookings',
    icon: LayoutDashboard,
    badges: ['requested', 'confirmed', 'completed'],
  },
];

export const CLIENT_STEPS: JourneyStepDefinition[] = [
  {
    key: 'discover',
    icon: Search,
    imageSrc: '/salon2.jpg',
    imageAltKey: 'howTo.clients.steps.discover.imageAlt',
  },
  { key: 'booking', icon: CalendarCheck2 },
  { key: 'management', icon: UsersRound },
  { key: 'reviews', icon: Star },
];
