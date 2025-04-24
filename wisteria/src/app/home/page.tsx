"use client";
import React, { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/navbar";
import {} from "react-icons/ri";
import { FaGasPump, FaTint } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { BiCloudLightning, BiShare } from "react-icons/bi";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <Navbar />

      <main className="p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="flex flex-row gap-4 w-full my-6">
            <input
              type="text"
              placeholder="Item"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              aria-label="Food search"
            />
            <input
              type="text"
              placeholder="Location"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              aria-label="Location search"
            />
            <button className="bg-cyan-800 text-white px-6 py-3 rounded-lg font-semibold text-lg cursor-pointer hover:bg-blue-700 transition-all shadow-sm">
              Search
            </button>
          </div>
          <section className="mb-8 text-black bg-gradient-to-br from-white to-blue-50 p-8 rounded-xl shadow-md border border-blue-100">
            <div className="flex flex-col md:flex-row justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-blue-900 flex items-center">
                  <BiCloudLightning className="h-8 w-8 mr-3 text-yellow-500" />
                  Total Energy Consumed
                </h2>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
                  <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <FaGasPump className="h-8 w-8 text-blue-800 mb-2" />
                    <span className="text-2xl font-bold text-gray-800">23</span>
                    <span className="text-gray-600 text-sm">gallons gas</span>
                  </div>

                  <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <FaTint className="h-8 w-8 text-blue-600 mb-2" />
                    <span className="text-2xl font-bold text-gray-800">80</span>
                    <span className="text-gray-600 text-sm">liters water</span>
                  </div>

                  <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <BiCloudLightning className="h-8 w-8 text-yellow-500 mb-2" />
                    <span className="text-2xl font-bold text-gray-800">
                      4,000
                    </span>
                    <span className="text-gray-600 text-sm">
                      kJ electricity
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 md:mt-0">
                <div className="bg-blue-900 text-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm uppercase font-semibold mb-1">
                    Carbon Footprint
                  </div>
                  <div className="text-3xl font-bold">42%</div>
                  <div className="text-blue-200 text-xs">below average</div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex">
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-base cursor-pointer hover:bg-green-500 transition-all shadow-sm flex items-center">
                <AiOutlinePlus className="h-5 w-5 mr-2" />
                Add to Grocery List
              </button>

              <button className="ml-4 border border-blue-300 text-blue-700 px-6 py-3 rounded-lg font-semibold text-base cursor-pointer hover:bg-blue-50 transition-all flex items-center">
                <BiShare className="h-5 w-5 mr-2" />
                Share Report
              </button>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center min-h-[350px] shadow-sm">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">
              Food Source Locations
            </h3>
            <div className="w-full h-[280px] bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Map visualization area</span>
            </div>
          </section>
          <section className="mt-8 w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900">
                GROCERY LISTS
              </h2>
              <button
                className="bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold text-lg cursor-pointer hover:bg-blue-600 transition-all shadow-sm"
                onClick={() => setShowCreate(true)}
              >
                Create Grocery List
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
              {groceryLists.map((list, idx) => (
                <button
                  key={list}
                  className="border-2 border-gray-200 rounded-xl py-6 text-xl font-semibold text-gray-800 hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm"
                  onClick={() => setOpenList(idx)}
                >
                  {list}
                </button>
              ))}
            </div>
          </section>
          {openList !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
                <h3 className="text-2xl font-bold mb-4 text-blue-900">
                  {groceryLists[openList]}
                </h3>
                <p className="mb-6 text-gray-700">
                  [Grocery list details and actions go here]
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all"
                    onClick={() => setOpenList(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                    onClick={() => setOpenList(null)}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
          {showCreate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
                <h3 className="text-2xl font-bold mb-4 text-blue-900">
                  Create Grocery List
                </h3>
                <input
                  type="text"
                  placeholder="List Name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mb-6 text-gray-700">
                  [Grocery list creation form goes here]
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all"
                    onClick={() => setShowCreate(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                    onClick={() => setShowCreate(false)}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
