// 상담 문의 섹션
import { ArrowRight, Clock, MapPin, PhoneCall, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NaverMap } from "@/components/naver-map";

interface ContactSectionProps {
  onOpenDialog: () => void;
}

export function ContactSection({ onOpenDialog }: ContactSectionProps) {
  return (
    <section id="contact" className="py-24">
      <div className="mx-auto grid w-full gap-16 px-6 md:grid-cols-[1fr_1fr] md:px-12">
        <div className="space-y-8" data-animate>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">contact concierge</p>
          <h3 className="text-3xl font-semibold text-white md:text-4xl">지금 바로 맞춤 렌탈 상담을 예약해 보세요</h3>
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
              아래 버튼을 클릭하시면 빠른 상담 전화를 도와드립니다. 필요 시 카카오톡, 이메일 등 원하는 채널로 이어서 상담하며, 해외 고객을 위한 통역 서비스도 함께 지원합니다. 상담 일정이 확정되면 맞춤 체크리스트와 예상 이동 시나리오를 먼저 공유하여 고객이 준비해야 할 사항을 명확히 파악할 수 있습니다.
            </p>
            <div className="grid gap-3">
              <Button
                className="flex items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-5 text-base font-semibold text-white transition hover:bg-sky-400"
                onClick={onOpenDialog}
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
  );
}
