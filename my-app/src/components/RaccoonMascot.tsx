export default function RaccoonMascot({ className = '' }: { className?: string }) {
  return (
    <div className={`select-none ${className}`} aria-hidden title="Trash panda mascot">
      <pre
        style={{ fontFamily: "'Baloo 2', sans-serif" }}
        className="m-0 whitespace-pre-wrap text-center text-xl leading-snug md:text-[1.62rem]"
      >
        🦝{'\n'}
        (cheeky lil chaos)
      </pre>
    </div>
  )
}
