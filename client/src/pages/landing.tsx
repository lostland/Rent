import { useRef, useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { apiRequest } from "@/lib/queryClient";

import { LandingHeader } from "./landing/LandingHeader";
import { HeroSection } from "./landing/HeroSection";
import { SignatureSection } from "./landing/SignatureSection";
import { ProcessSection } from "./landing/ProcessSection";
import { TestimonialsSection } from "./landing/TestimonialsSection";
import { ContactSection } from "./landing/ContactSection";
import { LandingFooter } from "./landing/LandingFooter";
import { AdminButton } from "./landing/AdminButton";
import { ConsultationDialog } from "./landing/ConsultationDialog";

export default function Landing() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", inquiry: "" });

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

  useScrollReveal(pageRef);

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

  const openDialog = () => setIsDialogOpen(true);

  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <LandingHeader onContactClick={openDialog} />
      <main className="pt-12 md:pt-16">
        <HeroSection onOpenDialog={openDialog} />
        <SignatureSection />
        <ProcessSection />
        <TestimonialsSection />
        <ContactSection onOpenDialog={openDialog} />
      </main>
      <LandingFooter />
      <AdminButton onClick={() => navigate("/admin")} />
      <ConsultationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}
