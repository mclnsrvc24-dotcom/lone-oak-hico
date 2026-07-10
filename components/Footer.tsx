export default function Footer() {
  return (
    <footer className="border-t border-forest-dark/10 bg-bone py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 text-sm text-ink/60 md:flex-row md:items-center">
        <p>
          &copy; {new Date().getFullYear()} Lone Oak Home Improvement Co.
        </p>
        <a href="mailto:loneoakhico@yahoo.com" className="hover:text-oak">
          loneoakhico@yahoo.com
        </a>
      </div>
    </footer>
  );
}
