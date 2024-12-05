import { Link } from 'react-router-dom';
import AuthService from '@/services/auth';
import LogoBK from '../assets/uot_logo.png';
import 'primeicons/primeicons.css';

import { useEffect, useRef, useState } from 'react';

export default function SmallMenu() {
  const smallMenuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const menu_items = [
    {
      name: 'Account',
      classItem: 'menu-items rounded-t-lg',
      icon: '',
      path: '',
      method: () => {},
      subItems: [
        {
          name: 'Updates',
          icon: 'pi pi-bell icon',
          classItem: 'menu-subitems',
          path: '/',
        },
        {
          name: 'Messages',
          icon: 'pi pi-inbox icon',
          classItem: 'menu-subitems',
          path: '/',
        },
        {
          name: 'Tasks',
          icon: 'pi pi-list-check icon',
          classItem: 'menu-subitems',
          path: '/',
        },
        {
          name: 'Comments',
          icon: 'pi pi-comments icon',
          classItem: 'menu-subitems',
          path: '/',
        },
      ],
    },
    {
      name: 'Settings',
      classItem: 'menu-items',
      icon: '',
      path: '',
      method: () => {},
      subItems: [
        {
          name: 'Profile',
          icon: 'pi pi-user icon',
          classItem: 'menu-subitems',
          path: '/',
        },
        {
          name: 'Settings',
          icon: 'pi pi-cog icon',
          classItem: 'menu-subitems',
          path: '/',
        },
        {
          name: 'Payments',
          icon: 'pi pi-credit-card icon',
          classItem: 'menu-subitems',
          path: '/',
        },
        {
          name: 'Projects',
          icon: 'pi pi-file icon',
          classItem: 'menu-subitems',
          path: '/',
        },
      ],
    },
    {
      name: 'Log out',
      subItems: [],
      icon: 'pi pi-sign-out icon',
      classItem: 'log-out',
      path: '/login',
      method: () => {
        AuthService.logout();
      },
    },
  ];
  // Make a small menu disappear when mouse is clicked outside of it
  const handler = (e: MouseEvent) => {
    if (smallMenuRef.current && !smallMenuRef.current?.contains(e.target as Node)) {
      setOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);
  return (
    <div ref={smallMenuRef}>
      <button className="avatar-container" onClick={() => setOpen(!open)}>
        <img src={LogoBK} alt="Logo" className="avatar"></img>
      </button>
      <div className={open ? 'small-menu block' : 'small-menu'}>
        {menu_items.map((val, index) => (
          <div key={index}>
            <Link to={val.path} onClick={val.method}>
              <div className={val.classItem}>
                <i className={val.icon}></i>
                {val.name}
              </div>
            </Link>
            <div>
              {val.subItems.length === 0
                ? ''
                : val.subItems.map((subVal, subIndex) => (
                    <Link to={subVal.path} key={subIndex}>
                      <div className={subVal.classItem}>
                        <i className={subVal.icon}></i>
                        {subVal.name}
                      </div>
                    </Link>
                  ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
