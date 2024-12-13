import { useState } from 'react'

const Navbar = ()=> {
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

  return (
    <nav className="navbar">
      <button className="nav-drawer-button" onClick={toggleSidebar}>
        <span className="material-icons">
          {isSidebarOpen ? 'close' : 'menu'}
        </span>
      </button>
      <div className="nav-main-item">
        <img src={`${process.env.PUBLIC_URL}/img/logoTitle.png`} className="nav-logo" alt="logoTitle"/>
        <h2 className="nav-title">HomeMade</h2>
      </div>
      <div className="nav-items">
        <div className="search-icon">
          <span className="material-icons">search</span>
        </div>
        <div className="nav-theme" onClick={toggleTheme}>
          {theme === 'light' ? (
            <span className="material-icons">dark_mode</span>
          ) : (
            <span className="material-icons">light_mode</span>
          )}
        </div>
        <div className="nav-user">
          <span className="nav-circle-letter">{"P"}</span>
        </div>
        <div className="nav-login-logout">
          <span className="nav-login">Login/Sign Up</span>
          <span className="nav-logout">Logout</span>
        </div>
      </div>
      <div className={`sidebar-items ${isSidebarOpen ? 'show' : 'hide'}`}>
        <div className="sidebar-item">Item 1</div>
        <div className="sidebar-item">Item 2</div>
        <div className="sidebar-item">Item 3</div>
        <div className="sidebar-item">Item 4</div>
        <div className="sidebar-item">Item 5</div>
      </div>
    </nav>
  )
}

export default Navbar;