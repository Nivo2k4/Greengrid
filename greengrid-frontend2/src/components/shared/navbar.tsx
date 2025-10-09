import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigationItems = [
    { name: 'Home', route: '' },
    { name: 'Tracking Map', route: 'tracking' },
    { name: 'Community', route: 'community' },
    { name: 'Contact', route: 'contact' }
  ];

  return (
    <nav className="relative bg-white shadow">
      <div className="container px-6 py-4 mx-auto">
        <div className="lg:flex lg:items-center lg:justify-between">
          {/* Left side */}
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center mr-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-lg">
              <span className="text-primary-foreground font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
              GreenGrid
            </span>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="text-gray-500 hover:text-gray-600  focus:outline-none"
                aria-label="toggle menu"
              >
                {!isOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Menu items */}
          <div
            className={`absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out 
              bg-white lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent 
              lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center
              ${isOpen
                ? "translate-x-0 opacity-100"
                : "opacity-0 -translate-x-full lg:opacity-100"
              }`}
          >
            <div className="flex flex-col -mx-6 lg:flex-row lg:items-center lg:mx-8">
              {navigationItems.map(
                (item) => (
                  <a
                    key={item.name}
                    href={item.route}
                    className="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 
                      transform rounded-md lg:mt-0  
                      hover:bg-gray-100"
                  >
                    {item.name}
                  </a>
                )
              )}
            </div>
            
            {/*Add Login Button*/}
            <div className="flex items-center justify-center mt-4 lg:mt-0 lg:justify-center">
                <Link to="/login">
                    <Button>Login</Button>
                </Link>
                </div>
          </div>
        </div>
      </div>
    </nav>
  );
}