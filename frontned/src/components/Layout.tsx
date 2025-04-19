import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useEffect, useState, useRef } from "react";

export default function Layout() {
  // Add state to track header height
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);
  const mainRef = useRef(null);

  // Measure the actual header height on mount and window resize
  useEffect(() => {
    const updateHeaderHeight = () => {
      const headerElement = document.querySelector('header');
      if (headerElement) {
        const height = headerElement.offsetHeight;
        setHeaderHeight(height);
        
        // If we have a ref to the main element, update its padding directly
        if (mainRef.current) {
          mainRef.current.style.paddingTop = `${height}px`;
        }
      }
    };

    // Initial measurement
    updateHeaderHeight();
    
    // Update on resize
    window.addEventListener('resize', updateHeaderHeight);
    
    // Additional measurement after DOM content is fully loaded
    window.addEventListener('DOMContentLoaded', updateHeaderHeight);
    
    // Also measure after a slight delay to ensure all styles are applied
    const timeoutId = setTimeout(updateHeaderHeight, 200);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      window.removeEventListener('DOMContentLoaded', updateHeaderHeight);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header ref={headerRef} />
      
      <main 
        ref={mainRef}
        className="flex-1 bg-gray-50 content-container py-8" 
        style={{ paddingTop: `${headerHeight || 64}px` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
