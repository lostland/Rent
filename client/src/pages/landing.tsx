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
import heroCar from "@assets/xw0MTtfRZ3rCjnBiosoX8_1758442035276.png";

const highlights = [
  {
    title: "프리미엄 차량 라인업",
    description: "벤츠, BMW, 제네시스 등 최신형 수입/국산 차량을 상황에 맞춰 추천해 드립니다.",
    icon: Sparkles,
  },
  {
    title: "맞춤 컨설팅",
    description: "출장/여행/비즈니스 목적에 따라 최적의 차량과 요금제를 설계해 드립니다.",
    icon: Navigation2,
  },
  {
    title: "365일 고객 케어",
    description: "배차부터 반납까지 담당 매니저가 실시간으로 안내해 드립니다.",
    icon: ShieldCheck,
  },
];

const fleet = [
  {
    name: "Executive Sedan",
    detail: "비즈니스 미팅과 장거리 이동을 위한 안락한 세단",
    tags: ["E-Class", "G80", "5 Series"],
  },
  {
    name: "Luxury SUV",
    detail: "패밀리 여행과 VIP 픽업에 최적화된 프리미엄 SUV",
    tags: ["GV80", "XC90", "X5"],
  },
  {
    name: "Specialty Fleet",
    detail: "웨딩카, 프로모션, 행사 전용으로 커스터마이징 가능한 차량",
    tags: ["AMG", "Convertible", "Sprinter"],
  },
];

const steps = [
  {
    title: "상담 신청",
    description: "간단한 문의만 남겨도 담당 매니저가 즉시 연락을 드립니다.",
  },
  {
    title: "맞춤 제안",
    description: "필요 일정과 목적에 맞춘 차량/기사/서비스 플랜을 제안합니다.",
  },
  {
    title: "안전 배차",
    description: "완벽한 점검을 마친 차량과 전문 드라이버가 약속된 장소로 배차됩니다.",
  },
  {
    title: "사후 케어",
    description: "이용 후 추가 일정이나 연장이 필요하면 즉시 이어서 지원해 드립니다.",
  },
];

const statsData = [
  { label: "연간 배차 건수", value: 12000, suffix: "+" },
  { label: "재이용 고객 비율", value: 92, suffix: "%" },
  { label: "전담 매니저", value: 24, suffix: "h" },
];

const testimonials = [
  {
    name: "김현수 / 글로벌 기업 임원",
    quote:
      "출장 일정마다 차량과 기사를 매번 맞춤으로 준비해 주셔서 중요한 미팅에 집중할 수 있었습니다.",
  },
  {
    name: "박서연 / 웨딩 플래너",
    quote:
      "예식 컨셉에 맞춘 차량 데코와 드라이버 매너까지 완벽했습니다. 고객 만족도가 최고 수준이에요.",
  },
  {
    name: "홍지훈 / 여행 크리에이터",
    quote:
      "장거리 로드트립도 안심하고 맡길 수 있는 차량 상태와 24시간 대응이 가장 큰 장점입니다.",
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
      <header className="fixed top-0 inset-x-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
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
            className="flex items-center gap-2 rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 hover:bg-sky-400"
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
          <div className="container mx-auto grid items-center gap-12 px-4 pb-24 pt-12 md:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-8">
              <div
                className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-sky-300"
                data-animate
              >
                tailored luxury
              </div>
              <h2
                className="text-4xl font-semibold leading-[1.15] text-white md:text-6xl"
                data-animate
                data-animate-delay="0.05s"
              >
                맞춤 컨설팅으로 완성하는<br />
                <span className="text-sky-400">프리미엄 차량 렌탈 서비스</span>
              </h2>
              <p
                className="text-base leading-relaxed text-slate-200 md:text-lg"
                data-animate
                data-animate-delay="0.1s"
              >
                일정, 동선, 목적에 따라 가장 완벽한 이동 경험을 설계해 드립니다. 첫 문의부터 차량 반납까지 모든 과정을 전담 매니저가 케어해 드리는 서울 프리미엄 렌트 전용 서비스입니다.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row" data-animate data-animate-delay="0.15s">
                <Button
                  className="group flex items-center gap-2 rounded-full bg-sky-500 px-8 py-6 text-base font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 hover:bg-sky-400"
                  onClick={() => setIsDialogOpen(true)}
                >
                  컨시어지 예약하기
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <a
                  href="tel:02-123-4567"
                  className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-6 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/40"
                >
                  <PhoneCall className="h-5 w-5" /> 전화 상담
                </a>
              </div>
              <div className="grid gap-4 md:grid-cols-3" ref={statsRef}>
                {statsData.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/5 bg-white/5 p-5"
                    data-animate
                    data-animate-delay={`${0.15 + index * 0.05}s`}
                  >
                    <p className="text-3xl font-semibold text-white">
                      {animatedStats[index]?.toLocaleString("ko-KR")}
                      {statsActivated ? stat.suffix : ""}
                    </p>
                    <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-8 top-10 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
              <div className="absolute -right-6 bottom-0 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
              <div
                className="relative rounded-[48px] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-10 shadow-2xl backdrop-blur"
                data-animate
                data-animate-delay="0.25s"
              >
                <div className="absolute inset-0 rounded-[48px] border border-white/10" />
                <img
                  src={heroCar}
                  alt="프리미엄 렌터카"
                  className="relative z-10 w-full max-w-xl -translate-y-6 drop-shadow-[0_40px_80px_rgba(14,165,233,0.35)]"
                />
                <div className="relative z-10 mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-slate-100">
                  <div className="flex items-center gap-3">
                    <Gauge className="h-5 w-5 text-sky-300" />
                    <div>
                      <p className="font-semibold">월간 무제한 주행 옵션</p>
                      <p className="text-xs text-slate-300">장기 렌트 고객 전용</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
                    <ShieldCheck className="h-4 w-4" /> All Covered
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/5 bg-white/5 py-20">
          <div className="container mx-auto grid gap-12 px-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-8">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">signature service</p>
              <h3 className="text-3xl font-semibold text-white md:text-4xl" data-animate>
                서울 전 지역 프리미엄 맞춤 렌탈 & 리무진 컨시어지
              </h3>
              <p className="text-base leading-relaxed text-slate-200" data-animate data-animate-delay="0.05s">
                수입차 단기 렌트부터 VIP 의전, 웨딩 차량까지 목적별 이동 솔루션을 제공해 드립니다. 스케줄 관리, 기사 배정, 주유 및 세차까지 매 순간 최고의 컨디션을 유지합니다.
              </p>
              <div className="grid gap-6 md:grid-cols-3">
                {highlights.map((highlight, index) => (
                  <div
                    key={highlight.title}
                    className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-6 backdrop-blur"
                    data-animate
                    data-animate-delay={`${0.1 + index * 0.05}s`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/15 text-sky-300">
                      <highlight.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{highlight.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">{highlight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6" id="fleet">
              {fleet.map((item, index) => (
                <div
                  key={item.name}
                  className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/10 via-white/5 to-transparent p-8 shadow-xl"
                  data-animate
                  data-animate-delay={`${0.1 + index * 0.05}s`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">fleet</p>
                      <h5 className="mt-2 text-2xl font-semibold text-white">{item.name}</h5>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-sky-200">
                      <Sparkles className="h-4 w-4" /> curated
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-200">{item.detail}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="border-b border-white/5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div data-animate>
                <p className="text-sm uppercase tracking-[0.35em] text-sky-300">how it works</p>
                <h3 className="mt-4 text-3xl font-semibold text-white md:text-4xl">3단계로 완료되는 프리미엄 예약 프로세스</h3>
              </div>
              <div
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-200"
                data-animate
                data-animate-delay="0.1s"
              >
                <p className="flex items-center gap-2">
                  <CalendarRange className="h-4 w-4 text-sky-300" /> 모든 상담은 24시간 이내 응답 드립니다.
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur"
                  data-animate
                  data-animate-delay={`${0.05 + index * 0.08}s`}
                >
                  <div className="absolute -left-12 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-sky-500/10 blur-2xl" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">step {index + 1}</span>
                    <CheckCircle2 className="h-5 w-5 text-sky-300" />
                  </div>
                  <h4 className="mt-5 text-2xl font-semibold text-white">{step.title}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-slate-200">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/5 bg-white/5 py-20">
          <div className="container mx-auto grid gap-10 px-4 md:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6" data-animate>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">client stories</p>
              <h3 className="text-3xl font-semibold text-white md:text-4xl">고객이 말하는 서울 프리미엄 렌트</h3>
              <p className="text-sm leading-relaxed text-slate-200">
                반복 이용 고객들의 신뢰로 성장한 프리미엄 렌탈 서비스. 목적에 맞춘 차량, 매너 있는 드라이버, 그리고 전담 매니저의 섬세한 케어까지 경험해 보세요.
              </p>
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-lg" data-animate data-animate-delay="0.05s">
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
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((item, index) => (
                <div
                  key={item.name}
                  className="flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/40 p-6"
                  data-animate
                  data-animate-delay={`${0.1 + index * 0.05}s`}
                >
                  <div className="flex items-center gap-2 text-sky-300">
                    <Sparkles className="h-4 w-4" /> verified review
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-slate-100">“{item.quote}”</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-24">
          <div className="container mx-auto grid gap-12 px-4 md:grid-cols-[1fr_1fr]">
            <div className="space-y-6" data-animate>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">contact concierge</p>
              <h3 className="text-3xl font-semibold text-white md:text-4xl">
                지금 바로 맞춤 렌탈 상담을 예약해 보세요
              </h3>
              <p className="text-sm leading-relaxed text-slate-200">
                원하는 차량, 이용 일정, 기사 동반 여부를 알려주시면 가장 효율적인 플랜을 제안해 드립니다. 위급한 일정도 실시간으로 빠르게 배차해 드려요.
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

            <div className="relative space-y-6">
              <div
                className="overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/40 shadow-xl"
                data-animate
              >
                <NaverMap
                  height="260px"
                  address="서울특별시 강남구 테헤란로 123"
                  addressLabel="서울 프리미엄 렌트 라운지"
                  fallbackCenter={{ lat: 37.501274, lng: 127.039585 }}
                  className="rounded-[30px]"
                />
              </div>
              <div
                className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/5 p-8 backdrop-blur"
                data-animate
                data-animate-delay="0.08s"
              >
                <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-sky-500/20 blur-3xl" />
                <div className="relative space-y-6">
                  <h4 className="text-2xl font-semibold text-white">컨시어지 상담 신청</h4>
                  <p className="text-sm leading-relaxed text-slate-200">
                    아래 버튼을 클릭하시면 빠른 상담 전화를 도와드립니다. 필요 시 카카오톡, 이메일 등 원하는 채널로 이어서 상담합니다.
                  </p>
                  <div className="grid gap-3">
                    <Button
                      className="flex items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-5 text-base font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 hover:bg-sky-400"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      즉시 상담 연결
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                    <a
                      href="tel:02-123-4567"
                      className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-5 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/40"
                    >
                      <PhoneCall className="h-5 w-5" /> 전화 바로 걸기
                    </a>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
                    <p className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-sky-300" /> 모든 차량은 출고 3년 이내, 주행거리 5만km 이하 차량만 배차합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-slate-950/80 py-8 text-xs text-slate-500">
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
        className="fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/80 text-slate-200 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:text-white"
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
