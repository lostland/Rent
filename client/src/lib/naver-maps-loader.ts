const NAVER_MAPS_SCRIPT_ID = "naver-maps-api-script";

type ScriptState = "idle" | "loading" | "loaded" | "failed";

let state: ScriptState = "idle";
let loadPromise: Promise<void> | null = null;
let lastError: Error | null = null;

function removeExistingScript() {
  const existing = document.getElementById(NAVER_MAPS_SCRIPT_ID);
  if (existing && existing.parentNode) {
    existing.parentNode.removeChild(existing);
  }
}

export function getNaverMapsScriptState(): { state: ScriptState; error: Error | null } {
  return { state, error: lastError };
}

export async function loadNaverMapsScript(): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("Naver Maps는 브라우저 환경에서만 사용할 수 있습니다.");
  }

  if (state === "loaded") {
    return;
  }

  if (state === "failed" && lastError) {
    throw lastError;
  }

  if (state === "loading" && loadPromise) {
    return loadPromise;
  }

  state = "loading";

  loadPromise = (async () => {
    const response = await fetch("/api/naver/client-id");
    if (!response.ok) {
      throw new Error("지도 API 설정을 불러오는데 실패했습니다.");
    }

    const data = await response.json();
    if (!data?.clientId) {
      throw new Error("네이버 지도 API 클라이언트 ID가 설정되지 않았습니다.");
    }

    if (window.naver?.maps) {
      state = "loaded";
      return;
    }

    await new Promise<void>((resolve, reject) => {
      removeExistingScript();

      const script = document.createElement("script");
      script.id = NAVER_MAPS_SCRIPT_ID;
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${data.clientId}&submodules=geocoder`;
      script.async = true;

      const handleFailure = (message: string) => {
        const error = new Error(message);
        lastError = error;
        state = "failed";
        script.removeEventListener("load", handleLoad);
        script.removeEventListener("error", handleScriptError);
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        if ((window as any).navermap_authFailure === handleAuthFailure) {
          delete (window as any).navermap_authFailure;
        }
        reject(error);
      };

      const handleLoad = () => {
        if (window.naver?.maps) {
          state = "loaded";
          script.removeEventListener("load", handleLoad);
          script.removeEventListener("error", handleScriptError);
          if ((window as any).navermap_authFailure === handleAuthFailure) {
            delete (window as any).navermap_authFailure;
          }
          resolve();
          return;
        }

        handleFailure("네이버 지도 API가 올바르게 초기화되지 않았습니다.");
      };

      const handleScriptError = () => {
        handleFailure("지도를 불러오는데 실패했습니다.");
      };

      const handleAuthFailure = () => {
        handleFailure("지도 인증에 실패했습니다. 키/도메인 설정을 확인해 주세요.");
      };

      script.addEventListener("load", handleLoad);
      script.addEventListener("error", handleScriptError);
      (window as any).navermap_authFailure = handleAuthFailure;

      document.head.appendChild(script);
    });
  })();

  try {
    await loadPromise;
    state = "loaded";
    lastError = null;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    lastError = err;
    state = "failed";
    throw err;
  } finally {
    if (state === "loaded") {
      loadPromise = Promise.resolve();
    } else if (state !== "loading") {
      loadPromise = null;
    }
  }
}
