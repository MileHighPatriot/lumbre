export function Agave({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path fill="currentColor" d="M32 58c-1.2-9-2-16-2-24 0-8 1-16 2-22 1 6 2 14 2 22s-.8 15-2 24z" />
      <path fill="currentColor" d="M32 40c-8 1-16 6-22 12 8-2 16-7 22-12zM32 40c8 1 16 6 22 12-8-2-16-7-22-12z" />
      <path fill="currentColor" d="M32 32c-9-1-16 2-22 8 8-1 16-5 22-8zM32 32c9-1 16 2 22 8-8-1-16-5-22-8z" />
      <path fill="currentColor" d="M32 24c-6-7-10-12-12-16 6 2 10 8 12 16zM32 24c6-7 10-12 12-16-6 2-10 8-12 16z" />
    </svg>
  );
}

export function Papel() {
  return (
    <div className="flex h-7 overflow-hidden text-chile" aria-hidden>
      {Array.from({ length: 24 }, (_, index) => (
        <svg key={index} viewBox="0 0 36 28" className="h-7 w-9 shrink-0">
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M1 0h34v18l-5.6 4-5.7-4-5.7 4-5.7-4L6.6 22 1 18V0zm17 5.2a3.2 3.2 0 1 0 .01 0z"
          />
        </svg>
      ))}
    </div>
  );
}
