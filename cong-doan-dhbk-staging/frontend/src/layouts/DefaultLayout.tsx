import { Outlet } from 'react-router-dom';
import Header from './Header';
import SidebarClone from './SidebarClone';
import BackgroundLayout from './BackgroundLayout';

export default function DefaultLayout() {
  return (
    <>
      <SidebarClone />
      <div className="content-container">
        {/* Sidebar here */}
        <BackgroundLayout />
        <Header sidebar_id={'sidebar'} content_id={'content-container'} footer_id={'footer'} />
        <Outlet />
        {/* This will render the content of the page */}
        {/* You can move this component anywhere to suit your needs*/}
        {/* But do not delete this component */}
      </div>
    </>
  );
}
