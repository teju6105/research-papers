import Link from "next/link";
import { BookOpenCheck } from "lucide-react";

type BrandProps = {
  compact?: boolean;
};

export function Brand({ compact = false }: BrandProps) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-[#183b81] text-white shadow-sm">
        <BookOpenCheck size={19} strokeWidth={2} />
      </span>
      {!compact && (
        <span className="text-[15px] font-semibold tracking-tight text-slate-950">
          Research<span className="text-blue-800">Atlas</span>
        </span>
      )}
    </Link>
  );
}
