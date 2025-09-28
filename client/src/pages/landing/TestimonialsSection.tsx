// 고객 후기 섹션
import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

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

export function TestimonialsSection() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const currentTestimonial = useMemo(
    () => testimonials[testimonialIndex] ?? testimonials[0],
    [testimonialIndex],
  );

  useEffect(() => {
    const current = currentTestimonial;
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
  }, [currentTestimonial, isDeleting, typedText]);

  return (
    <section className="py-20">
      <div className="mx-auto grid w-full gap-12 px-6 md:grid-cols-[0.95fr_1.05fr] md:px-12">
        <div className="space-y-6" data-animate>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">client stories</p>
          <h3 className="text-3xl font-semibold text-white md:text-4xl">고객이 말하는 서울 프리미엄 렌트</h3>
          <p className="text-sm leading-relaxed text-slate-200">
            반복 이용 고객들의 신뢰로 성장한 프리미엄 렌탈 서비스. 목적에 맞춘 차량, 매너 있는 드라이버, 그리고 전담 매니저의 섬세한 케어까지 경험해 보세요. 예약 이후에도 만족도 모니터링을 이어가며 더 나은 이동 환경을 제안합니다. 고객이 원하는 콘텐츠 촬영, 미팅 준비, 휴식 지원까지 여유롭게 연결되는 서울만의 럭셔리 라이프스타일을 만나볼 수 있습니다.
          </p>
          <div data-animate data-animate-delay="0.05s">
            <p className="text-xs uppercase tracking-[0.35em] text-sky-300">real voice</p>
            <p className="mt-4 min-h-[120px] text-sm leading-relaxed text-slate-100">
              “{typedText}
              <span className="typing-cursor" />”
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{currentTestimonial?.name}</p>
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
  );
}
