import { Link, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function TopNavigation() {
  const { pathname } = useLocation();
  const onHome = pathname === '/';

  return (
    <nav className="border-b border-border bg-panel-bg">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          aria-label="BLTM home"
          className="flex min-w-0 items-center gap-3 rounded-lg outline-none ring-offset-2 ring-offset-app-bg focus-visible:ring-2 focus-visible:ring-live-cyan sm:gap-3.5"
        >
          <img
            src="/logo.png"
            alt=""
            width={50}
            height={50}
            className="h-[50px] w-[50px] shrink-0 object-contain object-center"
            decoding="async"
          />
          <span className="min-w-0 truncate text-base font-bold leading-none tracking-tight text-text-strong sm:text-lg">
            BLT<span className="text-live-sky">M</span>
          </span>
        </Link>
        <Link
          to="/"
          className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            onHome
              ? 'bg-live-sky/95 text-[#0a1628] shadow-[0_0_20px_-4px_rgba(125,211,252,0.55)]'
              : 'text-text-muted hover:bg-panel-bg-secondary hover:text-live-sky'
          }`}
        >
          <Home className="h-4 w-4 shrink-0" aria-hidden />
          <span className="hidden sm:inline">Home</span>
        </Link>
      </div>
    </nav>
  );
}

// Made with Bob
