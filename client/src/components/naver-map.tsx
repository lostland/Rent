import { useEffect, useRef, useState } from "react";
import {
  loadNaverMapsScript,
  getNaverMapsScriptState,
} from "@/lib/naver-maps-loader";

// Declare naver global for TypeScript
declare global {
  interface Window {
    naver: any;
    initNaverMap?: () => void;
  }
}

interface NaverMapProps {
  width?: string;
  height?: string;
  center?: {
    lat: number;
    lng: number;
  };
  /** 좌표 지오코딩 실패 시 사용할 예비 좌표 */
  fallbackCenter?: { lat: number; lng: number };
  address?: string;
  addressLabel?: string;
  addressBubbleHtml?: string;
  customMarkerHtml?: string;
  zoom?: number;
  markers?: Array<{
    lat: number;
    lng: number;
    title?: string;
    content?: string;
  }>;
  className?: string;
  [key: string]: any; // Allow additional props like data-testid
}
export function NaverMap({width = "100%",
  height = "400px",
  center = { lat: 37.5137, lng: 127.0982 }, // Default to Seoul coordinates
  zoom = 15,
  markers = [],
  className = "",
  address, addressLabel, addressBubbleHtml, customMarkerHtml, fallbackCenter, ...rest
}: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  console.log('NaverMap: Rendering...');

  // 1) 스크립트 '한 번만' 로드
  useEffect(() => {
    let cancelled = false;

    const { state, error } = getNaverMapsScriptState();

    if (state === "failed" && error) {
      setLoadError(error.message);
      return;
    }

    if (state === "loaded" && window.naver?.maps) {
      setIsLoaded(true);
      setLoadError(null);
      return;
    }

    loadNaverMapsScript()
      .then(() => {
        if (!cancelled) {
          console.log('NaverMap: Already loaded!');
          setIsLoaded(true);
          setLoadError(null);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('[NAVER] load failure', error);
          setLoadError(
            error instanceof Error
              ? error.message
              : '지도를 불러오는데 실패했습니다.',
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // 2) 지도 초기화 (isLoaded가 true가 된 뒤 한 번)
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.naver?.maps) 
    {
      console.log('2-1--------------------');
      return;
    }
    console.log('2--------------------');

    try {
      console.log('NaverMap: Initializing map...');
      console.log('NaverMap: mapRef.current=', mapRef.current);

      const map = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(center.lat, center.lng),
        zoom,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: window.naver.maps.MapTypeControlStyle.BUTTON,
          position: window.naver.maps.Position.TOP_RIGHT,
        },
        zoomControl: true,
        zoomControlOptions: {
          style: window.naver.maps.ZoomControlStyle.SMALL,
          position: window.naver.maps.Position.TOP_LEFT,
        },
      });

      console.log('NaverMap: Map initialized!');

      mapInstanceRef.current = map;
      setLoadError(null);
    } catch {
      setLoadError('지도 초기화에 실패했습니다.');
    }

  }, [isLoaded]);


  
  // 3) 중심/줌 업데이트
  useEffect(() => {
    if (!mapInstanceRef.current || !window.naver?.maps) 
    {
      console.log('3-1--------------------');
      return;
    }
    console.log('3--------------------');

    console.log('NaverMap: Updating center/zoom...');
    mapInstanceRef.current.setCenter(
      new window.naver.maps.LatLng(center.lat, center.lng)
    );
    mapInstanceRef.current.setZoom(zoom);
    console.log('NaverMap: Center/zoom updated!');
  }, [center.lat, center.lng, zoom]);

  // 4) 마커 업데이트
  useEffect(() => {
    if (!mapInstanceRef.current || !window.naver?.maps) 
    {
      console.log('4-1--------------------');
      return;
    }
    console.log('4--------------------');

    // 기존 마커 정리
    console.log('NaverMap: Updating markers...');
    markersRef.current.forEach(({ marker, listener }) => {
      if (listener) window.naver.maps.Event.removeListener(listener);
      if (marker) marker.setMap(null);
    });
    markersRef.current = [];

    const arr: any[] = [];
    markers.forEach(m => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(m.lat, m.lng),
        map: mapInstanceRef.current,
        title: m.title || '',
      });

       console.log('NaverMap: Marker created!', marker)
      // (infoWindow 처리 필요 시 여기서)
      arr.push({ marker, listener: null });
    });
    markersRef.current = arr;
  }, [markers]);

  // 2.5) 주소 기반 지오코딩 (주소가 주어진 경우 중심/마커 갱신)
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !window.naver?.maps || !address) return;
    try {
      const { maps } = window.naver;
      // @ts-ignore
      if (!maps.Service || !maps.Service.geocode) {
        console.warn("Naver Maps Geocoder not available — using fallbackCenter or center");
        const lat = (fallbackCenter?.lat ?? center.lat);
        const lng = (fallbackCenter?.lng ?? center.lng);
        const ll = new maps.LatLng(lat, lng);
        mapInstanceRef.current!.setCenter(ll);
        const marker = new maps.Marker({ position: ll, map: mapInstanceRef.current!, icon: customMarkerHtml ? { content: customMarkerHtml, size: new maps.Size(24, 34), anchor: new maps.Point(12, 34) } : undefined, });
        const bubbleHtml = addressBubbleHtml || `<div style=\"display:inline-block; padding:10px 12px; font-size:13px; font-weight:600; background:#fff; border:1px solid rgba(0,0,0,0.15); box-shadow:0 4px 12px rgba(0,0,0,0.15); border-radius:10px; color:#111; white-space:nowrap;\">${addressLabel || address}</div>`;
        const iw = new maps.InfoWindow({ content: bubbleHtml, borderWidth: 0, disableAnchor: false });
        iw.open(mapInstanceRef.current!, marker);
        return;
      }

      // @ts-ignore
      maps.Service.geocode({ query: address }, (status: any, response: any) => {
        // @ts-ignore
        if (status !== maps.Service.Status.OK) {
          console.warn("Geocode failed:", status, "— using fallbackCenter or center");
          const lat = (fallbackCenter?.lat ?? center.lat);
          const lng = (fallbackCenter?.lng ?? center.lng);
          const ll = new maps.LatLng(lat, lng);
          mapInstanceRef.current!.setCenter(ll);
          const marker = new maps.Marker({ position: ll, map: mapInstanceRef.current!, icon: customMarkerHtml ? { content: customMarkerHtml, size: new maps.Size(24, 34), anchor: new maps.Point(12, 34) } : undefined, });
          const bubbleHtml = addressBubbleHtml || `<div style=\"display:inline-block; padding:10px 12px; font-size:13px; font-weight:600; background:#fff; border:1px solid rgba(0,0,0,0.15); box-shadow:0 4px 12px rgba(0,0,0,0.15); border-radius:10px; color:#111; white-space:nowrap;\">${addressLabel || address}</div>`;
          const iw = new maps.InfoWindow({ content: bubbleHtml, borderWidth: 0, disableAnchor: false });
          iw.open(mapInstanceRef.current!, marker);
          return;
        }
        const item = response?.v2?.addresses?.[0];
        if (!item) return;
        const lat = parseFloat(item.y);
        const lng = parseFloat(item.x);
        const ll = new maps.LatLng(lat, lng);
        mapInstanceRef.current!.setCenter(ll);

        console.log('NaverMap: Geocode success!', ll);

        const marker = new maps.Marker({
          position: ll,
          map: mapInstanceRef.current!,
          icon: customMarkerHtml ? {
            content: customMarkerHtml,
            size: new maps.Size(24, 34),
            anchor: new maps.Point(12, 34),
          } : undefined,
        });
        const bubbleHtml = addressBubbleHtml || `<div style=\"display:inline-block; padding:10px 12px; font-size:13px; font-weight:600; background:#fff; border:1px solid rgba(0,0,0,0.15); box-shadow:0 4px 12px rgba(0,0,0,0.15); border-radius:10px; color:#111; white-space:nowrap;\">${addressLabel || address}</div>`;
        const iw = new maps.InfoWindow({ content: bubbleHtml, borderWidth: 0, disableAnchor: false });
        iw.open(mapInstanceRef.current!, marker);
      });
    } catch (e) {
      console.warn("Geocode error:", e);
    }
  }, [isLoaded, address, addressLabel, addressBubbleHtml, customMarkerHtml]);


  if (loadError) {
    console.error('NaverMap: Error loading map:', loadError);
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{ width, height }}
        data-testid="map-error"
      >
        <div className="text-center">
          <p className="text-red-500 mb-2">🗺️</p>
          <p className="text-sm text-gray-600">{loadError}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    console.log('NaverMap: Loading...');
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{ width, height }}
        data-testid="map-loading"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">지도 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className={className}
      style={{ width, height }}
      {...rest}
    />
  );
}