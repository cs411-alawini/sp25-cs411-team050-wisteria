import Image from "next/image";
import React from "react";

import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showDropdown) return;
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showDropdown]);

  const handleSignOut = () => {
    // Placeholder: implement actual sign out logic
    alert("Signed out!");
  };

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-md px-8 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={120}
          height={40}
          className="h-10 w-auto"
        />
        <h1 className="ml-2 text-2xl font-bold text-gray-800">agri</h1>
      </div>
      <div className="flex items-center gap-6">
        <a href="#" className="text-gray-700 hover:text-blue-700 font-medium">
          Dashboard
        </a>
        <a href="#" className="text-gray-700 hover:text-blue-700 font-medium">
          Lists
        </a>
        <div className="relative">
          <button
            ref={buttonRef}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-all"
            onClick={() => setShowDropdown((v) => !v)}
          >
            Account
          </button>
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2 flex flex-col"
            >
              <a
                href="/profile"
                className="px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition rounded-t-lg"
                onClick={() => setShowDropdown(false)}
              >
                View Profile
              </a>
              <button
                className="px-4 py-2 text-left text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition rounded-b-lg"
                onClick={() => {
                  setShowDropdown(false);
                  handleSignOut();
                }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
