import Image from "next/image";
import React from "react";

const Navbar = () => {
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
        <button className="bg-blue-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all">
          Account
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
