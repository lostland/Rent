// 히어로 섹션
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Gauge, PhoneCall, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

import heroCar from "@assets/1.jpg";

type StatItem = {
  label: string;
  value: number;
  suffix: string;
};

const statsData: StatItem[] = [
  { label: "연간 배차 건수", value: 2700, suffix: "+" },
  { label: "재이용 고객 비율", value: 92, suffix: "%" },
  { label: "전담 매니저", value: 24, suffix: "h" },
];

interface HeroSectionProps {
  onOpenDialog: () => void;
}

export function HeroSection({ onOpenDialog }: HeroSectionProps) {
  const statsRef = useRef<HTMLDivElement>(null);
  const [animatedStats, setAnimatedStats] = useState<number[]>(() => statsData.map(() => 0));
  const [statsActivated, setStatsActivated] = useState(false);

  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsActivated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsActivated) return;
    const duration = 1500;
    const start = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    let frameId = 0;

    const step = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = easeOutCubic(progress);
      setAnimatedStats(statsData.map((stat) => Math.round(stat.value * eased)));
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [statsActivated]);

  const displayStats = useMemo(
    () => statsData.map((stat, index) => ({ ...stat, value: animatedStats[index] ?? 0 })),
    [animatedStats],
  );

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_60%)]" />
      <div className="mx-auto grid w-full items-start gap-14 px-6 pb-24 pt-12 md:px-12">
        <div className="space-y-10">
          <div
            className="relative -mx-6 overflow-hidden bg-cover bg-center px-6 py-14 sm:px-10 sm:py-16 md:-mx-12"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(2, 6, 23, 0.68)), url(${heroCar})`,
            }}
            data-animate
          >
            <div className="relative space-y-8">
              <p className="text-xs uppercase tracking-[0.35em] text-sky-200" data-animate>
                tailored luxury
              </p>
              <h2 className="text-4xl font-semibold leading-[1.15] text-white md:text-6xl" data-animate data-animate-delay="0.05s">
                맞춤 컨설팅으로 완성하는<br />
                <span className="text-sky-300">프리미엄 차량 렌탈 서비스</span>
              </h2>
              <p className="text-base leading-relaxed text-slate-100 md:text-lg" data-animate data-animate-delay="0.1s">
                일정, 동선, 목적에 따라 가장 완벽한 이동 경험을 설계해 드립니다. 첫 문의부터 차량 반납까지 모든 과정을 전담 매니저가 케어하고, 공항 픽업·호텔 체크인·비즈니스 미팅 등 세부 동선까지 함께 점검하여 고객의 시간을 아껴 드립니다. 서울 곳곳의 파트너 시설과 연계된 특화 혜택으로 이동 이후 일정까지 연속성 있게 이어집니다. 최신형 차량 라인업과 숙련된 기사 네트워크, 목적지와 연계된 맞춤 서비스까지 유기적으로 연결하여 단순한 이동을 넘어서는 고급 모빌리티 경험을 제공합니다.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row" data-animate data-animate-delay="0.15s">
                <Button
                  className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-sky-500 px-8 text-base font-semibold text-white transition hover:bg-sky-400 sm:w-auto"
                  onClick={onOpenDialog}
                >
                  컨시어지 예약하기
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <a
                  href="tel:02-123-4567"
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-white/50 px-8 text-base font-semibold text-white transition hover:bg-white/20 sm:w-auto"
                >
                  <PhoneCall className="h-5 w-5" /> 전화 상담
                </a>
              </div>
              <p className="text-sm leading-relaxed text-slate-100/90" data-animate data-animate-delay="0.18s">
                고객 전용 앱을 통해 실시간 배차 현황과 기사 정보를 확인하고 필요한 서류를 간편하게 업로드할 수 있습니다. 예약 변경이 발생해도 즉시 알림으로 안내받아 이동 계획을 유연하게 조정할 수 있습니다. 장기 계약 고객에게는 기사 프로필 관리, 자주 방문하는 목적지 자동 등록, 공항 VIP 라운지 동반 등 다양한 부가 혜택이 제공되어 한층 여유로운 여행과 비즈니스 일정이 완성됩니다.
              </p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3" ref={statsRef}>
            {displayStats.map((stat, index) => (
              <div
                key={stat.label}
                className="space-y-1"
                data-animate
                data-animate-delay={`${0.2 + index * 0.05}s`}
              >
                <p className="text-4xl font-semibold text-white">
                  {stat.value.toLocaleString("ko-KR")}
                  {statsActivated ? stat.suffix : ""}
                </p>
                <p className="text-sm text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6" data-animate data-animate-delay="0.25s">
          <div className="h-1 w-full max-w-2xl rounded-full bg-gradient-to-r from-transparent via-sky-400/80 to-transparent" aria-hidden="true" />
          <div className="flex items-center gap-3 text-base text-slate-200">
            <Gauge className="h-5 w-5 text-sky-300" />
            <span>
              월간 무제한 주행 옵션과 공항 전용 패스트트랙을 함께 제공하여 장기 이용 고객의 이동 시간을 대폭 단축합니다. 필요 시 여행 스케줄 관리팀이 일정을 통합 관리하며, 이동 간격에 맞춘 휴식 공간 예약까지 제안합니다.
            </span>
          </div>
          <div className="flex items-center gap-3 text-base text-slate-200">
            <ShieldCheck className="h-5 w-5 text-sky-300" />
            <span>
              전 차량 자차 손해 면책과 도착지별 기사 대기 서비스가 포함되어 있어 이동 중 발생할 수 있는 변수를 철저히 관리합니다. 고객의 보안 등급에 따라 비공개 출입 동선 설계와 현장 보안 인력 연계도 지원합니다.
            </span>
          </div>
          <div className="h-1 w-full max-w-2xl rounded-full bg-gradient-to-r from-transparent via-sky-400/80 to-transparent" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
