import { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import HoleList from "../UI/HoleList";
import Footer from "../UI/Footer";
import "./Sidebar.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setIsOpen(true);
      else setIsOpen(false);
    };

    // Set initial state
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {isMobile && (
        <button 
          className={`hamburger-button ${isOpen ? 'open' : ''}`}
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <FiMenu />
        </button>
      )}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="new-chat-button">
          <span>+</span> New Chat
        </button>
        <HoleList />
        <Footer />
      </aside>
      {isOpen && isMobile && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}
    </>
  );
}
