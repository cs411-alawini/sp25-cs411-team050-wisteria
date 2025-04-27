"use client";

import React, { useState } from "react";
import Navbar from "@/components/navbar";
import { FaGasPump, FaTint } from "react-icons/fa";
import { BiCloudLightning, BiShare } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";

interface Product {
  ProductName: string;
  CarbonFootprint_per_kg: number;
  LandUse_per_kg: number;
  WaterUse_per_kg: number;
  TotalEmissions: number;
  FuelUsageGallons: number;
}

const groceryLists = [
  "Weekly Shopping",
  "Party Prep",
  "Camping Trip",
  "Office Snacks",
];

export default function Home() {
  const [openList, setOpenList] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductName, setSelectedProductName] = useState<string>("");
  const [error, setError] = useState("");

  const searchProducts = async () => {
    try {
      const response = await fetch("/api/productSearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword,
          city: city || "",
          country: country || "",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Something went wrong");
        setProducts([]);
        return;
      }

      const data = await response.json();
      setProducts(data.products);
      setError("");

      if (data.products.length === 1) {
        setSelectedProductName(data.products[0].ProductName);
      } else {
        setSelectedProductName("");
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Network error");
    }
  };

  const selectedProduct = products.find(
    (p) => p.ProductName === selectedProductName
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <main className="p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl flex flex-col gap-6">
          {/* Search Section */}
          <div className="flex flex-col md:flex-row gap-4 w-full my-6">
            <input
              type="text"
              placeholder="Item"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              aria-label="Food search"
            />
            <input
              type="text"
              placeholder="City (optional)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              aria-label="City search"
            />
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              aria-label="Country search"
            />
            <button
              onClick={searchProducts}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold text-lg cursor-pointer hover:bg-emerald-700 transition-all shadow-sm"
            >
              Search
            </button>
          </div>

          {/* Error Message */}
          {error && <div className="text-red-600 mb-4">{error}</div>}

          {/* No Products Found */}
          {!error && products.length === 0 && keyword && (
            <div className="text-gray-600 mb-4">No matching products found.</div>
          )}


          {/* Dropdown if multiple products */}
          {products.length > 1 && (
            <div className="mb-6 w-full">
              <select
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                value={selectedProductName}
                onChange={(e) => setSelectedProductName(e.target.value)}
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.ProductName} value={product.ProductName}>
                    {product.ProductName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Energy Section */}
          {selectedProduct && (
            <section className="text-black bg-gradient-to-br from-white to-blue-50 p-8 rounded-xl shadow-md border border-blue-100 w-full">
              <h2 className="text-3xl font-bold mb-6 text-blue-900 flex items-center">
                <BiCloudLightning className="h-8 w-8 mr-3 text-yellow-500" />
                Product Impact
              </h2>

              <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <h3 className="text-2xl font-bold mb-4">{selectedProduct.ProductName}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-gray-600 text-sm">Carbon Footprint (kg CO₂/kg)</div>
                    <div className="text-2xl font-semibold">{selectedProduct.CarbonFootprint_per_kg}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm">Land Use (m²/kg)</div>
                    <div className="text-2xl font-semibold">{selectedProduct.LandUse_per_kg}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm">Water Use (liters/kg)</div>
                    <div className="text-2xl font-semibold">{selectedProduct.WaterUse_per_kg}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm">Total Emissions (kg CO₂)</div>
                    <div className="text-2xl font-semibold">{selectedProduct.TotalEmissions}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm">Fuel Usage (gallons)</div>
                    <div className="text-2xl font-semibold">{selectedProduct.FuelUsageGallons}</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Map Section */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center min-h-[350px] shadow-sm">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">
              Food Source Locations
            </h3>
            <div className="w-full h-[280px] bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Map visualization area</span>
            </div>
          </section>

          {/* Grocery List Section */}
          <section className="mt-8 w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900">GROCERY LISTS</h2>
              <button
                className="bg-emerald-600 text-white px-5 py-3 rounded-lg font-semibold text-lg cursor-pointer hover:bg-emerald-700 transition-all shadow-sm"
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

          {/* Modals */}
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
