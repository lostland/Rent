// 상담 다이얼로그 컴포넌트
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ConsultationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: { name: string; phone: string; inquiry: string };
  onFormChange: (field: keyof ConsultationDialogProps["formData"], value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}

export function ConsultationDialog({
  isOpen,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
  isSubmitting,
}: ConsultationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>상담 예약 정보를 남겨주세요</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="consult-name">이름</Label>
            <Input
              id="consult-name"
              value={formData.name}
              onChange={(event) => onFormChange("name", event.target.value)}
              placeholder="이름을 입력해주세요"
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="consult-phone">연락처</Label>
            <Input
              id="consult-phone"
              value={formData.phone}
              onChange={(event) => onFormChange("phone", event.target.value)}
              placeholder="연락 가능한 전화번호"
              autoComplete="tel"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="consult-message">문의 내용</Label>
            <Textarea
              id="consult-message"
              value={formData.inquiry}
              onChange={(event) => onFormChange("inquiry", event.target.value)}
              rows={4}
              placeholder="원하시는 차량, 일정, 목적을 알려주세요"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "접수 중..." : "상담 신청하기"}
          </Button>
          <p className="text-xs text-muted-foreground">
            남겨주신 정보는 상담 목적 외에는 사용되지 않으며, 안전하게 보호됩니다.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
