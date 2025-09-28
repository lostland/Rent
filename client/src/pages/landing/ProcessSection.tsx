// 이용 절차 섹션
import { CalendarRange, CheckCircle2 } from "lucide-react";

import stepBg1 from "@assets/9.jpg";
import stepBg2 from "@assets/10.jpg";
import stepBg3 from "@assets/11.jpg";
import stepBg4 from "@assets/12.jpg";

const steps = [
  {
    title: "상담 신청",
    description:
      "간단한 문의만 남겨도 담당 매니저가 즉시 연락을 드리고 이동 목적을 세부적으로 확인합니다. 고객의 일정, 동선, 동반 인원, 필요 서비스 등을 체크하여 가장 편안한 이동을 설계할 준비를 마칩니다. 고객이 참고할 수 있도록 예상 견적과 차량 라인업 브로슈어도 함께 전달해 의사 결정 시간을 최소화합니다.",
    background: stepBg1,
  },
  {
    title: "맞춤 제안",
    description:
      "필요 일정과 목적에 맞춘 차량·기사·서비스 플랜을 제안하고, 예상 경로에 따른 소요 시간과 비용까지 투명하게 안내합니다. 고객이 원하는 경우 현장 실사를 통해 픽업 동선을 사전에 점검합니다. 국제행사나 대규모 촬영처럼 복합적인 프로젝트에도 일정 관리 전문가가 투입되어 각 파트너사와의 협업을 조율합니다.",
    background: stepBg2,
  },
  {
    title: "안전 배차",
    description:
      "완벽한 점검을 마친 차량과 전문 드라이버가 약속된 장소로 배차되며, 실시간 위치 공유를 통해 고객이 대기 시간을 최소화할 수 있습니다. 모든 드라이버는 정기 안전 교육을 이수하고 다국어 의사소통도 지원합니다. 차량 내부에는 공기질 모니터링 시스템과 비상 의료 키트를 비치하여 이동 중 발생할 수 있는 돌발 상황에 즉시 대응합니다.",
    background: stepBg3,
  },
  {
    title: "사후 케어",
    description:
      "이용 후 추가 일정이나 연장이 필요하면 즉시 이어서 지원하며, 차량 상태 보고와 다음 예약 일정 조율까지 한 번에 진행합니다. 장기 계약 고객에게는 전용 프로모션과 주기적인 서비스 점검을 제공합니다. 만족도 조사를 바탕으로 기사 평가와 서비스 업그레이드 제안서를 전달하여 지속적으로 품질을 개선합니다.",
    background: stepBg4,
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="py-24">
      <div className="mx-auto w-full px-6 md:px-12">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div data-animate>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300">how it works</p>
            <h3 className="mt-4 text-3xl font-semibold text-white md:text-4xl">4단계로 완성되는 프리미엄 예약 프로세스</h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-200" data-animate data-animate-delay="0.1s">
            <CalendarRange className="mr-2 inline h-4 w-4 text-sky-300" aria-hidden="true" /> 모든 상담은 24시간 이내 응답해 드리며, 야간에도 긴급 배차 전담팀이 상시 대기하고 있습니다. 예약 진행 상황은 모바일 알림으로 투명하게 공유되어 고객이 언제든 진행 상황을 확인할 수 있습니다.
          </p>
        </div>
        <div className="grid gap-10">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="relative overflow-hidden bg-slate-950/70 px-8 py-12"
              data-animate
              data-animate-delay={`${0.05 + index * 0.08}s`}
            >
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${step.background})` }} aria-hidden="true" />
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
  );
}
