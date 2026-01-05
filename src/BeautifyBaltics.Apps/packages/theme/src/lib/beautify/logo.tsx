export default function Logo() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bbGradient" x1="4" y1="4" x2="36" y2="36">
          <stop offset="0%" stopColor="#f9abbc" />
          <stop offset="40%" stopColor="#e77487" />
          <stop offset="100%" stopColor="#c3485b" />
        </linearGradient>
        <linearGradient id="bbLine" x1="12" y1="12" x2="30" y2="28">
          <stop offset="0%" stopColor="#fff7f8" />
          <stop offset="100%" stopColor="#ffe4e9" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#bbGradient)" />
      <path
        d="M13 9.5H21.75C26 9.5 29.2 11.95 29.2 15.7C29.2 18.66 27.4 20.7 24.68 21.43C27.9 22.1 30 24.43 30 27.66C30 32.32 26.27 35.5 20.93 35.5H13V9.5ZM18.4 13.3V18.75H21.45C23.47 18.75 24.68 17.76 24.68 15.96C24.68 14.02 23.24 13.3 21.26 13.3H18.4ZM18.4 22.45V31.7H21.32C24.07 31.7 25.58 30.41 25.58 27.85C25.58 25.5 24.07 24.02 21.47 24.02H18.4V22.45Z"
        fill="url(#bbLine)"
      />
      <circle cx="11.5" cy="11.5" r="3" fill="#ffe5eb" stroke="#fff" strokeWidth="0.8" />
    </svg>
  );
}
