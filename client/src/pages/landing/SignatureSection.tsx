// 시그니처 서비스 섹션
import type { LucideIcon } from "lucide-react";
import { Navigation2, ShieldCheck, Sparkles } from "lucide-react";

import highlightLineupImg from "@assets/2.jpg";
import highlightConsultingImg from "@assets/3.jpg";
import highlightCareImg from "@assets/4.jpg";
import fleetSedanImg from "@assets/5.jpg";
import fleetSuvImg from "@assets/6.jpg";
import fleetSpecialtyImg from "@assets/7.jpg";

interface MediaAsset {
  type: "image" | "video";
  src: string;
  alt?: string;
  poster?: string;
}

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
  const commonClasses = "block aspect-[16/9] w-full object-cover";
  const wrapperClass = "full-bleed";

  if (media.type === "video") {
    return (
      <div className={wrapperClass}>
        <video
          className={commonClasses}
          autoPlay
          loop
          muted
          playsInline
          poster={media.poster}
          aria-hidden="true"
        >
          <source src={media.src} type="video/mp4" />
        </video>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <img
        src={media.src}
        alt={media.alt ?? ""}
        className={commonClasses}
        loading="lazy"
        aria-hidden={media.alt ? undefined : true}
      />
    </div>
  );
}

const highlights: HighlightItem[] = [
  {
    title: "프리미엄 차량 라인업",
    description:
      "벤츠, BMW, 제네시스 등 최신형 수입·국산 차량을 목적과 이동 인원에 맞춰 세심하게 추천합니다. 모든 차량은 주행 전 상태 점검과 실내 살균을 완료하여 언제나 전용차처럼 깨끗한 컨디션을 유지합니다. 고객의 드레스 코드나 브랜드 이미지에 맞춘 컬러 코디네이션, 향기 연출까지 가능해 특별한 순간을 더욱 돋보이게 합니다.",
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
      "출장, 여행, 비즈니스 등 상황별 이동 목적을 분석해 최적의 차량과 기사, 요금제를 설계합니다. 현장 동선과 예상 이동시간까지 고려한 세부 플랜을 제안해 한 번의 예약으로 모든 일정을 안정적으로 진행할 수 있습니다. 필요 시 숙박 및 레스토랑 예약, 회의 공간 준비 등 연계 서비스도 함께 제공해 이동과 접객이 하나의 흐름으로 이어지도록 돕습니다.",
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
      "배차부터 반납까지 전담 매니저가 실시간으로 동행하며 예상치 못한 일정 변경도 즉시 조율합니다. 24시간 케어 센터에서 돌발 상황을 모니터링해 고객이 이동 중에도 안심하고 본연의 일정에 집중할 수 있도록 지원합니다. 이용 후에는 피드백을 바탕으로 맞춤 리포트를 제공하여 다음 예약 시 더 완성도 높은 이동 솔루션을 제안합니다.",
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
      "비즈니스 미팅과 장거리 이동을 위한 안락한 세단으로, 에어 서스펜션과 프리미엄 사운드 시스템이 탑재되어 장시간 이동에도 피로감을 줄여 줍니다. 내부 미니바와 충전 설비까지 준비하여 VIP 고객 응대에도 완벽합니다. 방음 처리된 실내 공간과 프라이버시 커튼, 개별 온도 조절 시스템으로 밀도 높은 업무 미팅을 이동 중에도 이어갈 수 있습니다.",
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
      "패밀리 여행과 VIP 픽업에 최적화된 프리미엄 SUV로, 넓은 적재 공간과 독립식 시트 배열을 통해 탑승객 모두가 여유롭게 휴식할 수 있습니다. 파노라마 루프와 엔터테인먼트 시스템이 장착되어 장거리 이동도 즐겁게 만듭니다. 유아 시트와 반려동물 전용 키트도 옵션으로 제공되어 세대와 라이프스타일을 아우르는 이동 환경을 구성합니다.",
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
      "웨딩카, 프로모션, 행사 전용으로 커스터마이징 가능한 차량으로, 색상 데코와 브랜드 래핑 등 목적에 맞춘 연출이 가능합니다. 전문 코디네이터가 사전 리허설까지 진행해 행사의 분위기를 완벽하게 완성합니다. 퍼레이드 주행, 현장 음향, 포토존 구성까지 한 번에 대응해 브랜드 메시지가 자연스럽게 전달되도록 서포트합니다.",
    tags: ["AMG", "Convertible", "Sprinter"],
    media: {
      type: "image",
      src: fleetSpecialtyImg,
      alt: "스페셜 이벤트 차량",
    },
  },
];

export function SignatureSection() {
  return (
    <section className="py-0">
      <div className="mx-auto flex w-full flex-col gap-16 px-6 md:px-12">
        <div className="space-y-8">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">signature service</p>
          <h3 className="text-3xl font-semibold text-white md:text-4xl" data-animate>
            서울 전 지역 프리미엄 맞춤 렌탈 & 리무진 컨시어지
          </h3>
          <p className="text-base leading-relaxed text-slate-200" data-animate data-animate-delay="0.05s">
            수입차 단기 렌트부터 VIP 의전, 웨딩 차량까지 목적별 이동 솔루션을 제공해 드립니다. 전담 매니저가 이동 동선에 맞춰 휴게 지점과 체크인 시간을 조율하고, 필요 시 통역과 보안 인력까지 연계하여 완벽한 토탈 케어를 제공합니다. 고객의 브랜드 캠페인이나 행사 콘셉트에 맞춘 커스터마이징 제안도 함께 드려 서울에서의 모든 순간이 자연스럽게 연결되도록 돕습니다.
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
  );
}
