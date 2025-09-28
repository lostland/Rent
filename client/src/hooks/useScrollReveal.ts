import type { DependencyList, RefObject } from "react";
import { useEffect } from "react";

type UseScrollRevealOptions = {
  /** 관찰할 요소를 선택하기 위한 셀렉터. 기본값은 `[data-animate]` 입니다. */
  selector?: string;
  /** 인터섹션 관찰 임계값. 기본값은 0.2 입니다. */
  threshold?: number;
  /** 루트 마진 값. */
  rootMargin?: string;
  /** 요소가 보일 때 한 번만 애니메이션을 실행할지 여부. */
  once?: boolean;
  /** 의존성 배열. 해당 값이 변경되면 옵저버를 다시 설정합니다. */
  dependencies?: DependencyList;
};

/**
 * 스크롤 시 요소가 부드럽게 나타나는 효과를 적용합니다.
 * data-animate 속성을 가진 요소를 찾아 `is-visible` 클래스를 추가합니다.
 */
export function useScrollReveal(
  containerRef: RefObject<HTMLElement>,
  {
    selector = "[data-animate]",
    threshold = 0.2,
    rootMargin = "0px",
    once = true,
    dependencies = [],
  }: UseScrollRevealOptions = {},
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = Array.from(
      container.querySelectorAll<HTMLElement>(selector),
    );

    if (!elements.length) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.classList.add("is-visible");
            if (once) {
              observer.unobserve(target);
            }
          } else if (!once) {
            target.classList.remove("is-visible");
          }
        });
      },
      { threshold, rootMargin },
    );

    elements.forEach((element) => {
      if (element.dataset.animateDelay) {
        element.style.transitionDelay = element.dataset.animateDelay;
      }
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [containerRef, selector, threshold, rootMargin, once, ...dependencies]);
}
