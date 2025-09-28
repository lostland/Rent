// 헤더 섹션
import { Car, PhoneCall } from "lucide-react";

interface LandingHeaderProps {
  onContactClick?: () => void;
}

export function LandingHeader({ onContactClick }: LandingHeaderProps) {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-3" data-animate>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/20 text-sky-400">
            <Car className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-sky-400">Seoul Luxury Mobility</p>
            <h1 className="text-xl font-semibold leading-tight text-white">서울 프리미엄 렌트&리무진</h1>
          </div>
        </div>

        <div className="hidden items-center gap-10 text-sm font-medium text-slate-200 md:flex" data-animate data-animate-delay="0.05s">
          <a href="#fleet" className="transition hover:text-white">
            서비스 소개
          </a>
          <a href="#process" className="transition hover:text-white">
            이용 절차
          </a>
          <a href="#contact" className="transition hover:text-white">
            상담 문의
          </a>
        </div>

        <a
          href="tel:02-123-4567"
          onClick={onContactClick}
          className="flex items-center gap-2 rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
          data-animate
          data-animate-delay="0.1s"
        >
          <PhoneCall className="h-4 w-4" />
          02-123-4567
        </a>
      </div>
    </header>
  );
}
