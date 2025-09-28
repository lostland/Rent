// 관리자 버튼 컴포넌트
import { Settings } from "lucide-react";

interface AdminButtonProps {
  onClick: () => void;
}

export function AdminButton({ onClick }: AdminButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/80 text-slate-200 backdrop-blur transition hover:text-white"
      aria-label="Admin settings"
      title="Admin"
    >
      <Settings className="h-5 w-5" />
    </button>
  );
}
