"use client";
import React, { useState } from "react";

const groceryLists = [
  "Weekly Shopping",
  "Party Prep",
  "Camping Trip",
  "Office Snacks",
];

export default function Home() {
  const [openList, setOpenList] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  return (
    <main className="min-h-screen bg-white p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Search Bars */}
        <div className="flex flex-row gap-4 w-full mb-8">
          <input
            type="text"
            placeholder="Item"
            className="flex-1 border border-gray-300 rounded-b px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Food search"
          />
          <input
            type="text"
            placeholder="Location"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Location search"
          />
          <button className="bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold text-lg cursor-pointer hover:bg-blue-600 transition-colors">Search</button>
        </div>

        {/* Energy Summary */}
        <section className="mb-8 text-black">
          <h2 className="text-3xl font-bold mb-4">TOTAL ENERGY CONSUMED:</h2>
          <ul className="list-disc list-inside text-xl space-y-1">
            <li>23 gallons gas</li>
            <li>80 liters water</li>
            <li>4,000 kJ electricity</li>
          </ul>
          <button className="mt-4 bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-base cursor-pointer hover:bg-green-600 transition-colors">Add to Grocery List</button>
        </section>

        {/* Map Area */}
        <section className="bg-gray-100 border border-gray-300 rounded-lg p-6 flex flex-col items-center min-h-[350px]">
          <span className="text-lg text-black mb-2">[Interactive Map Placeholder]</span>
          {/* The actual map and connecting lines will be implemented here in the future */}
          <div className="w-full h-[250px] bg-white border border-dashed border-gray-400 rounded-lg flex items-center justify-center">
            <span className="text-black">Map visualization area</span>
          </div>
        </section>
        {/* Grocery Lists Section */}
        <section className="mt-12 w-full">
          <h2 className="text-2xl font-bold mb-6 text-black">GROCERY LISTS</h2>
          <button
            className="bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold text-lg cursor-pointer hover:bg-blue-600 transition-colors"
            onClick={() => setShowCreate(true)}
          >
            Create Grocery List
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {groceryLists.map((list, idx) => (
              <button
                key={list}
                className="border-2 border-gray-300 rounded-xl py-6 text-2xl font-semibold text-black hover:bg-blue-50 transition-colors"
                onClick={() => setOpenList(idx)}
              >
                {list}
              </button>
            ))}
          </div>
        </section>

        {/* Popups for Grocery Lists */}
        {openList !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">{groceryLists[openList]}</h3>
              <p className="mb-6 text-black">[Grocery list details and actions go here]</p>
              <button
                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => setOpenList(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
        {/* Popup for Create Grocery List */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Create Grocery List</h3>
              <p className="mb-6 text-black">[Grocery list creation form goes here]</p>
              <button
                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => setShowCreate(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}


