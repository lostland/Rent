// 푸터 섹션
export function LandingFooter() {
  return (
    <footer className="bg-slate-950/80 py-8 text-xs text-slate-500">
      <div className="mx-auto flex w-full flex-col items-center justify-between gap-4 px-6 md:flex-row md:px-12">
        <p>ⓒ {new Date().getFullYear()} Seoul Premium Rent. All Rights Reserved.</p>
        <div className="flex gap-6">
          <span>사업자등록번호 123-45-67890</span>
          <span>통신판매업 2024-서울강남-0001</span>
        </div>
      </div>
    </footer>
  );
}
