export default function AppFooter() {
  return (
    <footer className="mt-auto shrink-0 border-t border-border bg-panel-bg">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-text-subtle">
          Developed in partnership with{' '}
          <span className="font-semibold text-live-sky drop-shadow-[0_0_12px_rgba(125,211,252,0.35)]">
            IBM Bob
          </span>{' '}
          — AI-powered development assistant
        </p>
      </div>
    </footer>
  );
}
