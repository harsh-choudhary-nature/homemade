"use client";

import { Sun, Moon, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Chip from '../Chip/Chip';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css'
import { useUser } from '@/contexts/UserContext';

const Navbar = () => {

  const { user, logout } = useUser();

  const router = useRouter();
  const [theme, setTheme] = useState('light');
  const [isSidebarOpen, setSidebarOpen] = useState(false);


  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogoutClick = async () => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_ROOT_URL + '/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }, credentials: 'include', // send cookies!
      });
      if (res.ok) {
        const data = await res.json();  // parse JSON body
        console.log('response data:', data);  // logs { message: "Logged out successfully" }


        logout();
        router.replace("/login");
        
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };


  return (
    <nav className={styles["navbar"]}>
      <button className={styles["nav-drawer-button"]} onClick={toggleSidebar}>
        {isSidebarOpen ? <X className={styles["material-icons"]} /> : <Menu className={styles["material-icons"]} />}
      </button>

      <div className={styles["nav-main-item"]}>
        <img src={`/img/logoTitle.png`} className={styles["nav-logo"]} alt="logoTitle" />
        <h2 className={styles["nav-title"]}>HomeMade</h2>
      </div>
      <div className={styles["nav-items"]}>

        <div className={styles["nav-theme"]} onClick={toggleTheme}>
          {theme === 'light' ? (
            <Moon className={styles["material-icons"]} />
          ) : (
            <Sun className={styles["material-icons"]} />
          )}
        </div>
        {user ? (
          <>
            <Link href="/dashboard/profile">
              <div className={styles["nav-user"]}>
                <span className={styles["nav-circle-letter"]}>
                  {user.username[0].toUpperCase()}
                </span>
              </div>
            </Link>

            <Chip
              label="Logout"
              onClick={handleLogoutClick}
            />
          </>
        ) : (
          <>
            <Link href="/login">
              <Chip
                label="Login"
              />
            </Link>
            <Link href="/signup">
              <Chip
                label="Signup"
              />
            </Link>
          </>
        )}
      </div>
      <div className={`${styles['sidebar-items']} ${isSidebarOpen ? styles.show : styles.hide}`}>
        <div className={styles["sidebar-item"]}>Item 1</div>
        <div className={styles["sidebar-item"]}>Item 2</div>
        <div className={styles["sidebar-item"]}>Item 3</div>
        <div className={styles["sidebar-item"]}>Item 4</div>
        <div className={styles["sidebar-item"]}>Item 5</div>
      </div>
    </nav>
  )
}

export default Navbar;