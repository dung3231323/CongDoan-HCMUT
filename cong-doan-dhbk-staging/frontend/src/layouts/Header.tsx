import { useRef } from 'react';

import SmallMenu from './SmallMenu';
import 'primeicons/primeicons.css';

interface elementID {
  sidebar_id: string;
  content_id: string;
  footer_id: string;
}
export default function Header(divElement: elementID) {
  const headRef = useRef<HTMLDivElement>(null);

  const handleTransition = () => {
    const sidebar_items = document.querySelector(`.${divElement.sidebar_id}`);
    const close_items = document.querySelector('.pi-times');
    const bg_layout = document.querySelector('.background-layout');
    const content_part = document.querySelector(`.${divElement.content_id}`);
    const footer_part = document.querySelector(`.${divElement.footer_id}`);
    // add more class to sidebar, footer
    const w = window.innerWidth;
    if (w <= 768) {
      sidebar_items?.classList.toggle('translate-x-0');
      close_items?.classList.toggle('block');
      bg_layout?.classList.toggle('block');
    } else {
      sidebar_items?.classList.toggle('translate-x-[-100%]');
      content_part?.classList.toggle('ml-0');
      footer_part?.classList.toggle('left-0');
    }
  };
  return (
    <div className="header" ref={headRef}>
      {/* Menu button */}
      <button className="pi pi-bars menu-bar" id="menu-button" onClick={handleTransition}></button>

      {/* Small-menu */}
      <SmallMenu />
    </div>
  );
}
