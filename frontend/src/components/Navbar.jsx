"use client";

import { Sun, Moon, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import Chip from './Chip';
import Link from 'next/link';
import styles from './Navbar.module.css'

const Navbar = () => {
  const { user, logout } = useUser();
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

  const handleLogoutClick = () => {
    logout(); // Call logout from context
  };

  const handleLoginClick = () => {

  };

  const handleSignupClick = () => {

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

        {
          user &&
          <div className={styles["search-icon"]}>
            <Search className={styles["material-icons"]} />
          </div>
        }
        <div className={styles["nav-theme"]} onClick={toggleTheme}>
          {theme === 'light' ? (
            <Moon className={styles["material-icons"]} />
          ) : (
            <Sun className={styles["material-icons"]} />
          )}
        </div>
        {user ? (
          <>
            <div className={styles["nav-user"]}>
              <span className={styles["nav-circle-letter"]}>
                {user.email[0].toUpperCase()}
              </span>
            </div>

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
                onClick={handleLoginClick}
              />
            </Link>
            <Link href="/signup">
              <Chip
                label="Signup"
                onClick={handleSignupClick}
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