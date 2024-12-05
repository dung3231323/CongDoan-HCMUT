// This background is used when the innerWidth of browser is smaller than
// 768px

export default function BackgroundLayout() {
  const handleSidebar = () => {
    const sidebarRef = document.querySelector('.sidebar');
    const closeRef = document.querySelector('.pi-times');
    const bg_layout = document.querySelector('.background-layout');
    sidebarRef?.classList.remove('translate-x-0');
    closeRef?.classList.remove('block');
    bg_layout?.classList.remove('block');
  };
  return <div className="background-layout" onClick={handleSidebar}></div>;
}
