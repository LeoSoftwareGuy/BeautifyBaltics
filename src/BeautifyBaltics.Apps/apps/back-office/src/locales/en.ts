const en = {
  brand: {
    name: 'Beautify Baltics',
  },
  language: {
    switcherLabel: 'Switch language',
  },
  general: {
    notFound: 'Not Found',
    noData: 'No data available',
    today: 'Today',
  },
  actions: {
    logout: 'Log out',
    cancel: 'Cancel',
    done: 'Done',
  },
  cta: {
    tryAgain: 'Try again',
  },
  navigation: {
    userMenu: {
      fallbackName: 'Beautify Baltics user',
    },
    client: {
      home: 'Home',
      dashboard: 'Dashboard',
      explore: 'Explore',
      bookings: 'My Bookings',
    },
    master: {
      dashboard: 'Dashboard',
      bookings: 'Bookings',
      timeSlots: 'Time Slots',
      services: 'Services',
      settings: 'Settings',
    },
    breadcrumbs: {
      brand: 'Beautify Baltics',
      home: 'Home',
      login: 'Login',
      register: 'Register',
      explore: 'Explore',
      clientExplore: 'Discover Masters',
      clientBookings: 'My Bookings',
      dashboard: 'Dashboard',
      masterDashboard: 'Master Dashboard',
      masterBookings: 'Bookings',
      masterServices: 'Services',
      masterTimeSlots: 'Time Slots',
      masterSettings: 'Settings',
      masterProfile: 'Master Profile',
    },
  },
  auth: {
    shared: {
      labels: {
        firstName: 'First name',
        lastName: 'Last name',
        email: 'Email address',
        password: 'Password',
        phoneNumber: 'Phone number',
      },
      placeholders: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'you@example.com',
        password: '••••••••',
        phoneNumber: '+123456789',
      },
      validation: {
        firstNameMin: 'First name must be at least 3 characters',
        lastNameMin: 'Last name must be at least 3 characters',
        emailInvalid: 'Invalid email address',
        passwordMin: 'Password must be at least 6 characters',
        phoneRequired: 'Phone number is required',
      },
    },
    login: {
      title: 'Welcome back',
      subtitle: 'Sign in with your Beautify Baltics account to continue.',
      registeredTitle: 'Registration successful',
      registeredMessage: 'Please log in with your new credentials.',
      noAccount: 'Don\'t have an account?',
      createAccountLink: 'Create one',
    },
    register: {
      title: 'Create an account',
      subtitle: 'Register to access Beautify Baltics.',
      accountTypeLabel: 'Account type',
      accountTypeHint: 'Choose how you want to use Beautify Baltics',
      roleClient: 'Client',
      roleMaster: 'Master',
      submitButton: 'Create account',
      notifications: {
        checkInboxTitle: 'Check your inbox',
        checkInboxMessage: 'Please confirm your email before signing in.',
        successTitle: 'Account created',
        successMessage: 'Welcome to Beautify Baltics!',
        failureTitle: 'Registration failed',
        failureMessage: 'Registration failed. Please try again.',
      },
    },
  },
  map: {
    unavailableTitle: 'Map unavailable',
    unavailableDescription: 'Google Maps API key is not configured',
    coordinatesMissing: 'Location coordinates not available',
  },
  explore: {
    header: {
      searchPlaceholder: 'Search by service, master, or location...',
    },
    filters: {
      title: 'Filters',
      priceRange: 'Price range',
    },
    categories: {
      all: 'All Services',
      unnamed: 'Unnamed category',
    },
    masterCard: {
      unnamed: 'Unnamed master',
      locationFallback: 'Location not specified',
      new: 'New',
      ratingLabel: 'Rating',
      awaitingReviews: 'Awaiting reviews',
    },
    page: {
      loadingCategories: 'Loading categories...',
      categoriesErrorTitle: 'Unable to load categories',
      categoriesErrorMessage: 'Something went wrong while fetching job categories.',
      mastersErrorTitle: 'Unable to load masters',
      mastersErrorMessage: 'Something went wrong while fetching masters.',
      emptyTitle: 'No masters found',
      emptySubtitle: 'Adjust filters or try a different search.',
    },
  },
  client: {
    dashboard: {
      title: 'Client Dashboard Overview',
      subtitle: 'Manage your sessions and track your service activity.',
      stats: {
        upcoming: 'Upcoming',
        completed: 'Completed',
        totalSpent: 'Total Spent',
      },
    },
    recentBookings: {
      title: 'Recent Bookings',
      subtitle: 'Your booking history',
      table: {
        columns: {
          service: 'Service & Master',
          date: 'Date',
          duration: 'Duration',
          price: 'Price',
          status: 'Status',
        },
      },
    },
    bookings: {
      headerTitle: 'My Bookings',
      headerSubtitle: 'View and manage your appointments',
      bookCta: 'Book New Appointment',
      empty: 'No bookings found',
      notifications: {
        cancelSuccessTitle: 'Booking cancelled',
        cancelSuccessMessage: 'Your booking has been cancelled successfully.',
        cancelErrorTitle: 'Failed to cancel booking',
        cancelErrorMessage: 'An error occurred while cancelling the booking.',
      },
      table: {
        columns: {
          master: 'Master',
          service: 'Service',
          location: 'Location',
          scheduledAt: 'Date & Time',
          duration: 'Duration',
          price: 'Price',
          status: 'Status',
          actions: 'Actions',
        },
      },
      status: {
        requested: 'Requested',
        confirmed: 'Confirmed',
        completed: 'Completed',
        cancelled: 'Cancelled',
        rated: 'Rated',
      },
      actions: {
        cancel: 'Cancel booking',
        rate: 'Rate this booking',
      },
      locationFallback: 'Location not provided',
      filters: {
        allStatuses: 'All statuses',
        dateLabel: 'Filter by date',
        datePlaceholder: 'Select date range',
        statusLabel: 'Status',
        statusPlaceholder: 'Filter by status',
      },
    },
    ratingModal: {
      title: 'Rate your experience',
      successTitle: 'Rating submitted',
      successMessage: 'Thank you for your feedback!',
      successSubtext: 'Your rating helps other clients find great masters.',
      errorTitle: 'Rating failed',
      errorFallback: 'Failed to submit rating',
      errorMessage: 'Failed to submit rating. Please try again.',
      withLabel: 'with {{name}}',
      prompt: 'How would you rate this service?',
      ratingLabels: {
        0: 'Select a rating',
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent',
      },
      commentLabel: 'Comment (optional)',
      commentPlaceholder: 'Share your experience with this master...',
      submitting: 'Submitting...',
      submit: 'Submit Rating',
    },
    nextSession: {
      title: 'Your Next Session',
      emptyTitle: 'No upcoming sessions',
      emptySubtitle: 'Book a session with one of our masters to get started.',
      badges: {
        today: 'UPCOMING TODAY',
      },
      startsInDays_one: 'Starts in {{count}} day',
      startsInDays_other: 'Starts in {{count}} days',
      startsInHours: 'Starts in {{hours}}h {{minutes}}m',
      startsInMinutes: 'Starts in {{minutes}}m',
      startingSoon: 'Starting soon',
      withLabel: 'with {{name}}',
      viewDetails: 'View Details',
    },
    bookingDetails: {
      title: 'Booking Details',
      serviceSection: {
        service: 'Service',
        price: 'Price',
        duration: 'Duration',
        date: 'Date',
      },
      locationSection: {
        title: 'Service Location',
      },
      infoSection: {
        title: 'Booking Info',
        scheduledTime: 'Scheduled Time',
        status: 'Status',
      },
      contactSection: {
        title: 'Contact Details',
        empty: 'No contact details available',
      },
    },
    explore: {
      header: {
        searchPlaceholder: 'Search services or keywords...',
        locationPlaceholder: 'Location...',
        searchButton: 'Search',
        categoryLabel: 'Category',
        categoryPlaceholder: 'All Categories',
        serviceLabel: 'Service',
        servicePlaceholder: 'All Services',
        priceRange: 'Price Range',
      },
      results: {
        title: 'Top Rated Masters',
        subtitle: 'Discover expert professionals',
        subtitleWithLocation: 'Discover expert professionals near {{location}}',
        count: 'Showing {{count}} results',
        errorTitle: 'Unable to load masters',
        errorMessage: 'Something went wrong while fetching masters.',
        emptyTitle: 'No masters found',
        emptySubtitle: 'Adjust filters or try a different search.',
      },
      card: {
        viewProfile: 'View Profile',
      },
    },
  },
  home: {
    hero: {
      badge: 'Discover Beauty Professionals Near You',
      titleLineOne: 'Book Your Perfect',
      titleHighlight: 'Beauty Experience',
      subtitle: 'Connect with talented barbers, tattoo artists, and beauty masters in your city. Browse portfolios, check availability, and book appointments seamlessly.',
      cta: 'Explore Masters',
      highlights: {
        verified: 'Verified Professionals',
        instant: 'Instant Booking',
        secure: 'Secure Payments',
      },
    },
    features: {
      title: 'Why Choose Beautify Baltics',
      subtitle: 'Everything you need to discover and book the best beauty professionals in your area.',
      items: {
        booking: {
          title: 'Easy Booking',
          description: 'Book appointments instantly with real-time availability updates.',
        },
        portfolio: {
          title: 'Portfolio Showcase',
          description: 'Browse master portfolios to find the perfect match for your style.',
        },
        reviews: {
          title: 'Verified Reviews',
          description: 'Read authentic reviews from real customers to make informed decisions.',
        },
        security: {
          title: 'Secure Platform',
          description: 'Safe and secure booking with verified professionals only.',
        },
      },
    },
  },
  megaSearch: {
    placeholder: 'Search...',
    shortcuts: {
      navigate: 'to navigate',
      select: 'to select',
    },
  },
  master: {
    dashboard: {
      title: 'Dashboard',
      stats: {
        totalBookings: 'Total Bookings',
        monthlyEarnings: 'Monthly Earnings',
        averageRating: 'Average Rating',
        noRatings: 'No ratings',
        reviewsLabel: '{{count}} reviews',
      },
    },
  },
} as const;

type DeepStringRecord<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringRecord<T[K]>;
};

export type CommonLocale = DeepStringRecord<typeof en>;

export default en;
