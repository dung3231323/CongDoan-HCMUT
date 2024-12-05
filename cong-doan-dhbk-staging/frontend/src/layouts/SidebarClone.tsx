import { useRef, useState } from 'react';
import LogoBK from '../assets/uot_logo.png';
import LogoCdv from '../assets/trade_union_member.png';
import { Link } from 'react-router-dom';
import 'primeicons/primeicons.css';

export default function SidebarClone() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [path, setPath] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const sidebar_content_clone = [
    {
      name: 'Quản lý tài khoản',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="nav-icon" role="img" aria-hidden="true"><path fill="var(--ci-primary-color, currentColor)" d="M88,160A64,64,0,1,0,24,96,64.072,64.072,0,0,0,88,160Zm0-96A32,32,0,1,1,56,96,32.036,32.036,0,0,1,88,64Z" class="ci-primary"></path><path fill="var(--ci-primary-color, currentColor)" d="M256,32a64,64,0,1,0,64,64A64.072,64.072,0,0,0,256,32Zm0,96a32,32,0,1,1,32-32A32.036,32.036,0,0,1,256,128Z" class="ci-primary"></path><path fill="var(--ci-primary-color, currentColor)" d="M424,160a64,64,0,1,0-64-64A64.072,64.072,0,0,0,424,160Zm0-96a32,32,0,1,1-32,32A32.036,32.036,0,0,1,424,64Z" class="ci-primary"></path><path fill="var(--ci-primary-color, currentColor)" d="M88,192a64,64,0,1,0,64,64A64.072,64.072,0,0,0,88,192Zm0,96a32,32,0,1,1,32-32A32.036,32.036,0,0,1,88,288Z" class="ci-primary"></path><path fill="var(--ci-primary-color, currentColor)" d="M256,192a64,64,0,1,0,64,64A64.072,64.072,0,0,0,256,192Zm0,96a32,32,0,1,1,32-32A32.036,32.036,0,0,1,256,288Z" class="ci-primary"></path><path fill="var(--ci-primary-color, currentColor)" d="M424,192a64,64,0,1,0,64,64A64.072,64.072,0,0,0,424,192Zm0,96a32,32,0,1,1,32-32A32.036,32.036,0,0,1,424,288Z" class="ci-primary"></path><path fill="var(--ci-primary-color, currentColor)" d="M424,352a64,64,0,1,0,64,64A64.072,64.072,0,0,0,424,352Zm0,96a32,32,0,1,1,32-32A32.036,32.036,0,0,1,424,448Z" class="ci-primary"></path><rect width="32" height="32" x="56" y="408" fill="var(--ci-primary-color, currentColor)" class="ci-primary"></rect><rect width="32" height="32" x="152" y="408" fill="var(--ci-primary-color, currentColor)" class="ci-primary"></rect><rect width="32" height="32" x="248" y="408" fill="var(--ci-primary-color, currentColor)" class="ci-primary"></rect></svg>',
      subNav: [],
      path: '/account',
      icon: 'pi pi-clipboard nav-icon',
      pi_angle_down: '',
    },
    {
      name: 'Quản lý hoạt động',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="nav-icon" role="img" aria-hidden="true"><path fill="var(--ci-primary-color, currentColor)" d="M304,136H128V288h80v88H384V224H304ZM160,256V168H272v88H160Zm192,0v88H240V288h64V256Z" class="ci-primary"></path><path fill="var(--ci-primary-color, currentColor)" d="M400,48H112V16H16v96H48V400H16v96h96V464H400v32h96V400H464V112h32V16H400ZM48,48H80V80H48ZM80,464H48V432H80Zm384,0H432V432h32ZM432,48h32V80H432Zm0,352H400v32H112V400H80V112h32V80H400v32h32Z" class="ci-primary"></path></svg>',
      subNav: [
        { name: 'Hoạt động', path: '/activity' },
        { name: 'Loại hoạt động', path: '/category' },
      ],
      path: path,
      icon: 'pi pi-objects-column nav-icon',
      pi_angle_down: 'pi pi-angle-down',
    },
    {
      name: 'QL Công đoàn viên',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="nav-icon" role="img" aria-hidden="true"><path fill="var(--ci-primary-color, currentColor)" d="M462.541,316.3l-64.344-42.1,24.774-45.418A79.124,79.124,0,0,0,432.093,192V120A103.941,103.941,0,0,0,257.484,43.523L279.232,67a71.989,71.989,0,0,1,120.861,53v72a46.809,46.809,0,0,1-5.215,21.452L355.962,284.8l89.058,58.274a42.16,42.16,0,0,1,19.073,35.421V432h-72v32h104V378.494A74.061,74.061,0,0,0,462.541,316.3Z" class="ci-primary"></path><path fill="var(--ci-primary-color, currentColor)" d="M318.541,348.3l-64.343-42.1,24.773-45.418A79.124,79.124,0,0,0,288.093,224V152A104.212,104.212,0,0,0,184.04,47.866C126.723,47.866,80.093,94.581,80.093,152v72a78,78,0,0,0,9.015,36.775l24.908,45.664L50.047,348.3A74.022,74.022,0,0,0,16.5,410.4L16,496H352.093V410.494A74.061,74.061,0,0,0,318.541,348.3ZM320.093,464H48.186l.31-53.506a42.158,42.158,0,0,1,19.073-35.421l88.682-58.029L117.2,245.452A46.838,46.838,0,0,1,112.093,224V152a72,72,0,1,1,144,0v72a46.809,46.809,0,0,1-5.215,21.452L211.962,316.8l89.058,58.274a42.16,42.16,0,0,1,19.073,35.421Z" class="ci-primary"></path></svg>',
      subNav: [
        { name: 'Thông tin cá nhân', path: '/participants' },
        { name: 'Thi đua - khen thưởng', path: '/' },
      ],
      path: path,
      icon: 'pi pi-users nav-icon',
      pi_angle_down: 'pi pi-angle-down',
    },
    {
      name: 'Các danh mục',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="nav-icon" role="img" aria-hidden="true"><path fill="var(--ci-primary-color, currentColor)" d="M446.754,47.9a20.075,20.075,0,0,0-21.307-2.745L32,229.835v37l165.349,66.139L303.317,496h37L453.281,68.369A20.072,20.072,0,0,0,446.754,47.9ZM317.124,458.524l-98.473-151.5-148.9-59.561L415.779,85.044Z" class="ci-primary"></path></svg>',
      subNav: [
        { name: 'Công đoàn bộ phận', path: '/' },
        { name: 'Khoa/ Phòng ban/ TT', path: '/' },
      ],
      path: path,
      icon: 'pi pi-list nav-icon',
      pi_angle_down: 'pi pi-angle-down',
    },
  ];
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  // Used for remove close  button and backgroundLayout
  const handleSidebar = () => {
    const bg_layout = document.querySelector('.background-layout');
    sidebarRef.current?.classList.remove('translate-x-0');
    closeRef.current?.classList.remove('block');
    bg_layout?.classList.remove('block');
  };

  // Used for selected items in sidebar
  const toggle = (i: number) => {
    if (selectedIndex === i) {
      setOpen(false);
      return setSelectedIndex(-1);
    }
    setOpen(true);
    setSelectedIndex(i);
  };
  //

  return (
    <div className="sidebar" ref={sidebarRef}>
      <div className="h-16 bg-[#2c384af2] flex items-center">
        {/* Hai cái biểu tượng */}
        <Link
          to={'/'}
          className="h-12 w-7 ml-12
          rounded-xl bg-white flex items-center cursor-pointer"
        >
          <div>
            <img src={LogoCdv} alt="Logo" className="h-10 ml-4 rounded-lg"></img>
          </div>
          <div>
            <img src={LogoBK} alt="Logo" className="h-9 ml-3"></img>
          </div>
        </Link>
      </div>
      {/* For close icon */}
      <button className="pi pi-times" ref={closeRef} onClick={handleSidebar}>
        <div className="close-noti">Close</div>
      </button>
      <div className="head-of-sidebar">
        {/* Collapsible sidebar */}
        <div className="collapsible">
          {sidebar_content_clone.map((items, index) => (
            <div
              className="item"
              key={index}
              onClick={() => {
                if (index === 0) {
                  handleSidebar();                           
                } 
              }}
            >
              <Link
                to={items.path}
                onClick={() => {
                  setPath(items.path);                      
                }}
              >
                <div
                  className={selectedIndex === index ? 'label label-selected' : 'label'}
                  onClick={() => {
                    toggle(index);                    
                  }}
                >
                  <i className={items.icon}></i>
                  {items.name}
                  <i
                    className={
                      selectedIndex === index && items.subNav.length !== 0
                        ? 'pi pi-angle-up'
                        : items.pi_angle_down
                    }
                  ></i>
                </div>
              </Link>

              {/* Make the subItem appear or not */}
              <div className={selectedIndex === index && open ? 'content show' : 'content'}>
                {items.subNav?.map((subItem, subIndex) => (
                  <Link
                    to={subItem.path}
                    onClick={() => {
                      setPath(subItem.path);       
                      toggle(index);
                    }}
                    key={subIndex}
                  >
                    <div
                      key={subIndex}
                      className="label"
                      onClick={() => {
                        handleSidebar();
                      }}
                    >
                      {subItem.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="footer">Công đoàn bộ phận trường ĐH Bách Khoa (ĐHQG-HCM)</div>
      </div>
    </div>
  );
}
