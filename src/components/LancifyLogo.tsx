import Image from "next/image";
import Link from "next/link";

export function LancifyLogo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.png"
        alt="Lancify Logo"
        width="32"
        height="32"
        className="shrink-0 object-contain"
      />
      <span className="text-[22px] font-bold tracking-tight text-gray-900">
        Lan<span className="text-green-600">cify</span>
      </span>
    </Link>
  );
}
