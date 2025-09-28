import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NaverMap } from "@/components/naver-map";
import {
  ArrowRight,
  CalendarRange,
  Car,
  CheckCircle2,
  Clock,
  Gauge,
  MapPin,
  Navigation2,
  PhoneCall,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import heroCar from "@assets/1.jpg";
import highlightLineupImg from "@assets/2.jpg";
import highlightConsultingImg from "@assets/3.jpg";
import highlightCareImg from "@assets/4.jpg";
import fleetSedanImg from "@assets/5.jpg";
import fleetSuvImg from "@assets/6.jpg";
import fleetSpecialtyImg from "@assets/7.jpg";
import stepBg1 from "@assets/9.jpg";
import stepBg2 from "@assets/10.jpg";
import stepBg3 from "@assets/11.jpg";
import stepBg4 from "@assets/12.jpg";

type MediaAsset =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; poster?: string; alt?: string };

interface HighlightItem {
  title: string;
  description: string;
  icon: LucideIcon;
  media: MediaAsset;
}

interface FleetItem {
  name: string;
  detail: string;
  tags: string[];
  media: MediaAsset;
}

function CardMedia({ media }: { media: MediaAsset }) {
  if (media.type === "video") {
    return (
      <video
        className="h-64 w-full object-cover md:h-80"
        autoPlay
        loop
        muted
        playsInline
        poster={media.poster}
        aria-hidden="true"
      >
        <source src={media.src} type="video/mp4" />
      </video>
    );
  }

  return (
    <img
      src={media.src}
      alt={media.alt ?? ""}
      className="h-64 w-full object-cover md:h-80"
      loading="lazy"
      aria-hidden={media.alt ? undefined : true}
    />
  );
}

const highlights: HighlightItem[] = [
  {
    title: "프리미엄 차량 라인업",
    description:
      "벤츠, BMW, 제네시스 등 최신형 수입·국산 차량을 목적과 이동 인원에 맞춰 세심하게 추천합니다. 모든 차량은 주행 전 상태 점검과 실내 살균을 완료하여 언제나 전용차처럼 깨끗한 컨디션을 유지합니다.",
    icon: Sparkles,
    media: {
      type: "image",
      src: highlightLineupImg,
      alt: "프리미엄 차량 라운지",
    },
  },
  {
    title: "맞춤 컨설팅",
    description:
      "출장, 여행, 비즈니스 등 상황별 이동 목적을 분석해 최적의 차량과 기사, 요금제를 설계합니다. 현장 동선과 예상 이동시간까지 고려한 세부 플랜을 제안해 한 번의 예약으로 모든 일정을 안정적으로 진행할 수 있습니다.",
    icon: Navigation2,
    media: {
      type: "image",
      src: highlightConsultingImg,
      alt: "컨설팅을 위한 대기 공간",
    },
  },
  {
    title: "365일 고객 케어",
    description:
      "배차부터 반납까지 전담 매니저가 실시간으로 동행하며 예상치 못한 일정 변경도 즉시 조율합니다. 24시간 케어 센터에서 돌발 상황을 모니터링해 고객이 이동 중에도 안심하고 본연의 일정에 집중할 수 있도록 지원합니다.",
    icon: ShieldCheck,
    media: {
      type: "image",
      src: highlightCareImg,
      alt: "서비스 케어 장면",
    },
  },
];

const fleet: FleetItem[] = [
  {
    name: "Executive Sedan",
    detail:
      "비즈니스 미팅과 장거리 이동을 위한 안락한 세단으로, 에어 서스펜션과 프리미엄 사운드 시스템이 탑재되어 장시간 이동에도 피로감을 줄여 줍니다. 내부 미니바와 충전 설비까지 준비하여 VIP 고객 응대에도 완벽합니다.",
    tags: ["E-Class", "G80", "5 Series"],
    media: {
      type: "image",
      src: fleetSedanImg,
      alt: "프리미엄 세단 차량",
    },
  },
  {
    name: "Luxury SUV",
    detail:
      "패밀리 여행과 VIP 픽업에 최적화된 프리미엄 SUV로, 넓은 적재 공간과 독립식 시트 배열을 통해 탑승객 모두가 여유롭게 휴식할 수 있습니다. 파노라마 루프와 엔터테인먼트 시스템이 장착되어 장거리 이동도 즐겁게 만듭니다.",
    tags: ["GV80", "XC90", "X5"],
    media: {
      type: "image",
      src: fleetSuvImg,
      alt: "럭셔리 SUV 차량",
    },
  },
  {
    name: "Specialty Fleet",
    detail:
      "웨딩카, 프로모션, 행사 전용으로 커스터마이징 가능한 차량으로, 색상 데코와 브랜드 래핑 등 목적에 맞춘 연출이 가능합니다. 전문 코디네이터가 사전 리허설까지 진행해 행사의 분위기를 완벽하게 완성합니다.",
    tags: ["AMG", "Convertible", "Sprinter"],
    media: {
      type: "image",
      src: fleetSpecialtyImg,
      alt: "스페셜 이벤트 차량",
    },
  },
];

const steps = [
  {
    title: "상담 신청",
    description:
      "간단한 문의만 남겨도 담당 매니저가 즉시 연락을 드리고 이동 목적을 세부적으로 확인합니다. 고객의 일정, 동선, 동반 인원, 필요 서비스 등을 체크하여 가장 편안한 이동을 설계할 준비를 마칩니다.",
    background: stepBg1,
  },
  {
    title: "맞춤 제안",
    description:
      "필요 일정과 목적에 맞춘 차량·기사·서비스 플랜을 제안하고, 예상 경로에 따른 소요 시간과 비용까지 투명하게 안내합니다. 고객이 원하는 경우 현장 실사를 통해 픽업 동선을 사전에 점검합니다.",
    background: stepBg2,
  },
  {
    title: "안전 배차",
    description:
      "완벽한 점검을 마친 차량과 전문 드라이버가 약속된 장소로 배차되며, 실시간 위치 공유를 통해 고객이 대기 시간을 최소화할 수 있습니다. 모든 드라이버는 정기 안전 교육을 이수하고 다국어 의사소통도 지원합니다.",
    background: stepBg3,
  },
  {
    title: "사후 케어",
    description:
      "이용 후 추가 일정이나 연장이 필요하면 즉시 이어서 지원하며, 차량 상태 보고와 다음 예약 일정 조율까지 한 번에 진행합니다. 장기 계약 고객에게는 전용 프로모션과 주기적인 서비스 점검을 제공합니다.",
    background: stepBg4,
  },
];

const statsData = [
  { label: "연간 배차 건수", value: 2700, suffix: "+" },
  { label: "재이용 고객 비율", value: 92, suffix: "%" },
  { label: "전담 매니저", value: 24, suffix: "h" },
];

const testimonials = [
  {
    name: "김현수 / 글로벌 기업 임원",
    quote:
      "출장 일정마다 차량과 기사를 매번 맞춤으로 준비해 주셔서 중요한 미팅에 집중할 수 있었습니다. 돌발 일정이 생겼을 때도 실시간으로 경로를 조정해 주어 해외 본사에서도 서비스 품질을 높게 평가했습니다.",
  },
  {
    name: "박서연 / 웨딩 플래너",
    quote:
      "예식 컨셉에 맞춘 차량 데코와 드라이버 매너까지 완벽했습니다. 고객 만족도가 최고 수준이에요. 예행연습부터 본식까지 매니저가 함께해 신부님이 긴장하지 않고 행사에 집중할 수 있었어요.",
  },
  {
    name: "홍지훈 / 여행 크리에이터",
    quote:
      "장거리 로드트립도 안심하고 맡길 수 있는 차량 상태와 24시간 대응이 가장 큰 장점입니다. 촬영 장비를 많이 싣고 다니는데 적재 관리와 충전 지원까지 해결해 주셔서 콘텐츠 제작 효율이 크게 올랐습니다.",
  },
];

export default function Landing() {
  const pageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", inquiry: "" });
  const [animatedStats, setAnimatedStats] = useState<number[]>(() => statsData.map(() => 0));
  const [statsActivated, setStatsActivated] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/inquiries", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "상담 신청 완료",
        description: "담당 매니저가 빠르게 연락드리겠습니다.",
      });
      setFormData({ name: "", phone: "", inquiry: "" });
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/inquiries"] });
    },
    onError: () => {
      toast({
        title: "신청 실패",
        description: "상담 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const container = pageRef.current;
    const elements = container?.querySelectorAll<HTMLElement>("[data-animate]");
    if (!elements?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    elements.forEach((el) => {
      const delay = el.dataset.animateDelay;
      if (delay) {
        el.style.transitionDelay = delay;
      }
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

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

  useEffect(() => {
    const current = testimonials[testimonialIndex];
    if (!current) return;

    if (isDeleting && typedText === "") {
      setIsDeleting(false);
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
      return;
    }

    if (!isDeleting && typedText === current.quote) {
      const holdTimer = window.setTimeout(() => setIsDeleting(true), 1600);
      return () => window.clearTimeout(holdTimer);
    }

    const timer = window.setTimeout(() => {
      const nextLength = typedText.length + (isDeleting ? -1 : 1);
      setTypedText(current.quote.slice(0, Math.max(0, nextLength)));
    }, isDeleting ? 18 : 45);

    return () => window.clearTimeout(timer);
  }, [isDeleting, testimonialIndex, typedText]);

  const currentTestimonial = useMemo(
    () => testimonials[testimonialIndex] ?? testimonials[0],
    [testimonialIndex],
  );

  const handleFormChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.inquiry.trim()) {
      toast({
        title: "입력 확인",
        description: "이름, 연락처, 문의 내용을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      inquiry: formData.inquiry.trim(),
    });
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50"
    >
      <header className="fixed top-0 inset-x-0 z-40 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-5">
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
            className="flex items-center gap-2 rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
            data-animate
            data-animate-delay="0.1s"
          >
            <PhoneCall className="h-4 w-4" />
            02-123-4567
          </a>
        </div>
      </header>

      <main className="pt-28 md:pt-32">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_60%)]" />
          <div className="container mx-auto grid items-start gap-14 px-4 pb-24 pt-12">
            <div className="space-y-10">
              <div
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-cover bg-center p-8 shadow-2xl shadow-sky-500/10 backdrop-blur-sm sm:p-10"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(2, 6, 23, 0.72)), url(${heroCar})`,
                }}
                data-animate
              >
                <div className="relative space-y-8">
                  <p className="text-xs uppercase tracking-[0.35em] text-sky-200" data-animate>
                    tailored luxury
                  </p>
                  <h2
                    className="text-4xl font-semibold leading-[1.15] text-white md:text-6xl"
                    data-animate
                    data-animate-delay="0.05s"
                  >
                    맞춤 컨설팅으로 완성하는<br />
                    <span className="text-sky-300">프리미엄 차량 렌탈 서비스</span>
                  </h2>
                  <p
                    className="text-base leading-relaxed text-slate-100 md:text-lg"
                    data-animate
                    data-animate-delay="0.1s"
                  >
                    일정, 동선, 목적에 따라 가장 완벽한 이동 경험을 설계해 드립니다. 첫 문의부터 차량 반납까지 모든 과정을 전담 매니저가 케어하고, 공항 픽업·호텔 체크인·비즈니스 미팅 등 세부 동선까지 함께 점검하여 고객의 시간을 아껴 드립니다. 서울 곳곳의 파트너 시설과 연계된 특화 혜택으로 이동 이후 일정까지 연속성 있게 이어집니다.
                  </p>
                  <div
                    className="flex flex-col items-center justify-center gap-3 sm:flex-row"
                    data-animate
                    data-animate-delay="0.15s"
                  >
                    <Button
                      className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-sky-500 px-8 text-base font-semibold text-white transition hover:bg-sky-400 sm:w-auto"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      컨시어지 예약하기
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <a
                      href="tel:02-123-4567"
                      className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-white/10 px-8 text-base font-semibold text-white transition hover:bg-white/20 sm:w-auto"
                    >
                      <PhoneCall className="h-5 w-5" /> 전화 상담
                    </a>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-100/90" data-animate data-animate-delay="0.18s">
                    고객 전용 앱을 통해 실시간 배차 현황과 기사 정보를 확인하고 필요한 서류를 간편하게 업로드할 수 있습니다. 예약 변경이 발생해도 즉시 알림으로 안내받아 이동 계획을 유연하게 조정할 수 있습니다.
                  </p>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-3" ref={statsRef}>
                {statsData.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="space-y-1"
                    data-animate
                    data-animate-delay={`${0.2 + index * 0.05}s`}
                  >
                    <p className="text-4xl font-semibold text-white">
                      {animatedStats[index]?.toLocaleString("ko-KR")}
                      {statsActivated ? stat.suffix : ""}
                    </p>
                    <p className="text-sm text-slate-300">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6" data-animate data-animate-delay="0.25s">
              <div
                className="h-1 w-full max-w-2xl rounded-full bg-gradient-to-r from-transparent via-sky-400/80 to-transparent"
                aria-hidden="true"
              />
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <Gauge className="h-5 w-5 text-sky-300" />
                <span>
                  월간 무제한 주행 옵션과 공항 전용 패스트트랙을 함께 제공하여 장기 이용 고객의 이동 시간을 대폭 단축합니다.
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <ShieldCheck className="h-5 w-5 text-sky-300" />
                <span>
                  전 차량 자차 손해 면책과 도착지별 기사 대기 서비스가 포함되어 있어 이동 중 발생할 수 있는 변수를 철저히 관리합니다.
                </span>
              </div>
              <div className="h-1 w-full max-w-2xl rounded-full bg-gradient-to-r from-transparent via-sky-400/80 to-transparent" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto flex flex-col gap-16 px-4">
            <div className="space-y-8">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">signature service</p>
              <h3 className="text-3xl font-semibold text-white md:text-4xl" data-animate>
                서울 전 지역 프리미엄 맞춤 렌탈 & 리무진 컨시어지
              </h3>
              <p className="text-base leading-relaxed text-slate-200" data-animate data-animate-delay="0.05s">
                수입차 단기 렌트부터 VIP 의전, 웨딩 차량까지 목적별 이동 솔루션을 제공해 드립니다. 전담 매니저가 이동 동선에 맞춰 휴게 지점과 체크인 시간을 조율하고, 필요 시 통역과 보안 인력까지 연계하여 완벽한 토탈 케어를 제공합니다.
              </p>
              <div className="space-y-12">
                {highlights.map((highlight, index) => (
                  <article
                    key={highlight.title}
                    className="space-y-6"
                    data-animate
                    data-animate-delay={`${0.1 + index * 0.05}s`}
                  >
                    <CardMedia media={highlight.media} />
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/20 text-sky-200">
                        <highlight.icon className="h-6 w-6" />
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-xl font-semibold text-white">{highlight.title}</h4>
                        <p className="text-sm leading-relaxed text-slate-200">{highlight.description}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-12" id="fleet">
              {fleet.map((item, index) => (
                <article
                  key={item.name}
                  className="space-y-6"
                  data-animate
                  data-animate-delay={`${0.05 + index * 0.05}s`}
                >
                  <CardMedia media={item.media} />
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-300">fleet</p>
                      <h5 className="mt-2 text-2xl font-semibold text-white">{item.name}</h5>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-200">{item.detail}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-200">
                      {item.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div data-animate>
                <p className="text-sm uppercase tracking-[0.35em] text-sky-300">how it works</p>
                <h3 className="mt-4 text-3xl font-semibold text-white md:text-4xl">4단계로 완성되는 프리미엄 예약 프로세스</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-200" data-animate data-animate-delay="0.1s">
                <CalendarRange className="mr-2 inline h-4 w-4 text-sky-300" aria-hidden="true" /> 모든 상담은 24시간 이내 응답해 드리며, 야간에도 긴급 배차 전담팀이 상시 대기하고 있습니다.
              </p>
            </div>
            <div className="grid gap-10 md:grid-cols-2">
              {steps.map((step, index) => (
                <article
                  key={step.title}
                  className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 p-8 shadow-xl shadow-slate-950/40 transition hover:border-sky-400/60 hover:shadow-sky-900/40"
                  data-animate
                  data-animate-delay={`${0.05 + index * 0.08}s`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${step.background})` }}
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 bg-slate-950/75" aria-hidden="true" />
                  <div className="relative space-y-4">
                    <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-slate-200">
                      <span>step {index + 1}</span>
                      <CheckCircle2 className="h-5 w-5 text-sky-300" />
                    </div>
                    <h4 className="text-2xl font-semibold text-white">{step.title}</h4>
                    <p className="text-sm leading-relaxed text-slate-100">{step.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto grid gap-12 px-4 md:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6" data-animate>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">client stories</p>
              <h3 className="text-3xl font-semibold text-white md:text-4xl">고객이 말하는 서울 프리미엄 렌트</h3>
              <p className="text-sm leading-relaxed text-slate-200">
                반복 이용 고객들의 신뢰로 성장한 프리미엄 렌탈 서비스. 목적에 맞춘 차량, 매너 있는 드라이버, 그리고 전담 매니저의 섬세한 케어까지 경험해 보세요. 예약 이후에도 만족도 모니터링을 이어가며 더 나은 이동 환경을 제안합니다.
              </p>
              <div data-animate data-animate-delay="0.05s">
                <p className="text-xs uppercase tracking-[0.35em] text-sky-300">real voice</p>
                <p className="mt-4 min-h-[120px] text-sm leading-relaxed text-slate-100">
                  “{typedText}
                  <span className="typing-cursor" />”
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {currentTestimonial?.name}
                </p>
              </div>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((item, index) => (
                <article
                  key={item.name}
                  className="flex h-full flex-col gap-4"
                  data-animate
                  data-animate-delay={`${0.1 + index * 0.05}s`}
                >
                  <div className="flex items-center gap-2 text-sky-300">
                    <Sparkles className="h-4 w-4" /> verified review
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-slate-100">“{item.quote}”</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{item.name}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-24">
          <div className="container mx-auto grid gap-16 px-4 md:grid-cols-[1fr_1fr]">
            <div className="space-y-8" data-animate>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">contact concierge</p>
              <h3 className="text-3xl font-semibold text-white md:text-4xl">
                지금 바로 맞춤 렌탈 상담을 예약해 보세요
              </h3>
              <p className="text-sm leading-relaxed text-slate-200">
                원하는 차량, 이용 일정, 기사 동반 여부를 알려주시면 가장 효율적인 플랜을 제안해 드립니다. 위급한 일정도 실시간으로 빠르게 배차해 드리고, 장기 이용 고객에게는 정기 차량 관리 리포트와 주차·숙박 제휴 혜택을 함께 제공합니다.
              </p>
              <div className="flex flex-col gap-3 text-sm text-slate-200">
                <p className="flex items-center gap-3">
                  <PhoneCall className="h-5 w-5 text-sky-300" /> 대표번호 : 02-123-4567 (24시간 상담)
                </p>
                <p className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-sky-300" /> 서울특별시 강남구 테헤란로 123, 18F 서울 프리미엄 렌트 라운지
                </p>
                <p className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-sky-300" /> 운영시간 : 연중무휴 / 실시간 긴급 배차 지원
                </p>
              </div>
            </div>

            <div className="space-y-10">
              <div data-animate>
                <NaverMap
                  height="320px"
                  address="서울특별시 강남구 테헤란로 123"
                  addressLabel="서울 프리미엄 렌트 라운지"
                  fallbackCenter={{ lat: 37.501274, lng: 127.039585 }}
                  className="h-full w-full"
                />
              </div>
              <div className="space-y-6" data-animate data-animate-delay="0.08s">
                <h4 className="text-2xl font-semibold text-white">컨시어지 상담 신청</h4>
                <p className="text-sm leading-relaxed text-slate-200">
                  아래 버튼을 클릭하시면 빠른 상담 전화를 도와드립니다. 필요 시 카카오톡, 이메일 등 원하는 채널로 이어서 상담하며, 해외 고객을 위한 통역 서비스도 함께 지원합니다.
                </p>
                <div className="grid gap-3">
                  <Button
                    className="flex items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-5 text-base font-semibold text-white transition hover:bg-sky-400"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    즉시 상담 연결
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <a
                    href="tel:02-123-4567"
                    className="flex items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-5 text-base font-semibold text-white transition hover:bg-white/20"
                  >
                    <PhoneCall className="h-5 w-5" /> 전화 바로 걸기
                  </a>
                </div>
                <p className="text-xs leading-relaxed text-slate-300">
                  <ShieldCheck className="mr-2 inline h-4 w-4 text-sky-300" aria-hidden="true" /> 모든 차량은 출고 3년 이내, 주행거리 5만km 이하 차량만 배차하며, 매 이용 전·후 전문 검수를 진행합니다.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950/80 py-8 text-xs text-slate-500">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <p>ⓒ {new Date().getFullYear()} Seoul Premium Rent. All Rights Reserved.</p>
          <div className="flex gap-6">
            <span>사업자등록번호 123-45-67890</span>
            <span>통신판매업 2024-서울강남-0001</span>
          </div>
        </div>
      </footer>

      <button
        onClick={() => navigate("/admin")}
        className="fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/80 text-slate-200 backdrop-blur transition hover:text-white"
        aria-label="Admin settings"
        title="Admin"
      >
        <Settings className="h-5 w-5" />
      </button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>상담 예약 정보를 남겨주세요</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="consult-name">이름</Label>
              <Input
                id="consult-name"
                value={formData.name}
                onChange={(event) => handleFormChange("name", event.target.value)}
                placeholder="이름을 입력해주세요"
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consult-phone">연락처</Label>
              <Input
                id="consult-phone"
                value={formData.phone}
                onChange={(event) => handleFormChange("phone", event.target.value)}
                placeholder="연락 가능한 전화번호"
                autoComplete="tel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consult-message">문의 내용</Label>
              <Textarea
                id="consult-message"
                value={formData.inquiry}
                onChange={(event) => handleFormChange("inquiry", event.target.value)}
                rows={4}
                placeholder="원하시는 차량, 일정, 목적을 알려주세요"
              />
            </div>
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? "접수 중..." : "상담 신청하기"}
            </Button>
            <p className="text-xs text-muted-foreground">
              남겨주신 정보는 상담 목적 외에는 사용되지 않으며, 안전하게 보호됩니다.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
