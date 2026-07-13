export default function Footer() {
  return (
    <footer className="border-t border-ink/8 bg-parchment">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-text-soft">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ink">
              <span className="h-2 w-2 rounded-full bg-mango" />
            </span>
            <span className="font-display italic text-text">PayFlow</span>
          </div>
          <p>Built for businesses accepting M-Pesa across Kenya.</p>
        </div>
      </div>
    </footer>
  );
}
