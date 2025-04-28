"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";

interface GroceryProduct {
  ProductName: string;
  Location: string;
  TotalEmissions: number;
  FuelUsageGallons: number;
}

interface SearchResult {
  ProductName: string;
}

export default function GroceryListPage() {
  const [products, setProducts] = useState<GroceryProduct[]>([]);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [newProduct, setNewProduct] = useState<string>("");
  const [newCity, setNewCity] = useState<string>("");
  const [newCountry, setNewCountry] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (res.ok) {
          setFirstName(data.firstName);
          setLastName(data.lastName);
        }
      } catch (err) {
        console.error("Failed to fetch user profile.");
      }
    };

    const fetchGroceryList = async () => {
      try {
        const response = await fetch("/api/grocerylist");
        const data = await response.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        setError("Failed to load grocery list.");
      }
    };

    fetchUserProfile();
    fetchGroceryList();
  }, []);

  const searchProducts = async (keyword: string) => {
    try {
      const res = await fetch("/api/grocerylist/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      const data = await res.json();
      if (res.ok) {
        setSearchResults(data.products || []);
      }
    } catch (err) {
      console.error("Product search failed.");
    }
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewProduct(value);
    if (value.length > 1) {
      searchProducts(value);
    } else {
      setSearchResults([]);
    }
  };

  const addProduct = async () => {
    if (!newProduct || !newCountry || newQuantity <= 0) {
      setError("Please enter a product, location, and valid quantity.");
      return;
    }

    try {
      const response = await fetch("/api/grocerylist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: newProduct,
          city: newCity || null,
          country: newCountry,
          quantity: newQuantity,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
        setNewProduct("");
        setNewCity("");
        setNewCountry("");
        setNewQuantity(1);
        setError("");
        setSearchResults([]);
      } else {
        setError(data.error || "Failed to add product.");
      }
    } catch (err) {
      setError("Failed to add product.");
    }
  };

  const deleteProduct = async (productName: string) => {
    try {
      const response = await fetch("/api/grocerylist/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName }),
      });
      const data = await response.json();
      if (data.success) {
        setProducts(products.filter((product) => product.ProductName !== productName));
      }
    } catch (err) {
      setError("Failed to delete product.");
    }
  };

  const deleteGroceryList = async () => {
    try {
      const response = await fetch("/api/grocerylist/deleteAll", { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        setProducts([]);
      }
    } catch (err) {
      setError("Failed to delete the entire grocery list.");
    }
  };

  const totalEmissions = products.reduce((acc, product) => acc + product.TotalEmissions, 0);
  const totalFuelUsage = products.reduce((acc, product) => acc + product.FuelUsageGallons, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <main className="p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-3xl font-bold text-blue-900">
              {firstName} {lastName}'s Grocery List
            </h2>
            {products.length === 0 ? (
              <button
                onClick={addProduct}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold text-lg cursor-pointer hover:bg-emerald-700 transition-all shadow-sm"
              >
                Add Product
              </button>
            ) : (
              <button
                onClick={deleteGroceryList}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-lg cursor-pointer hover:bg-red-700 transition-all shadow-sm"
              >
                Delete Entire List
              </button>
            )}
          </div>

          {/* Form to Add Product */}
          <div className="my-4 w-full flex flex-col md:flex-row gap-4">
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Product"
                value={newProduct}
                onChange={handleProductChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
              {searchResults.length > 0 && (
                <select
                  className="absolute top-full mt-1 w-full border border-gray-300 rounded-lg shadow-sm bg-white z-10"
                  onChange={(e) => setNewProduct(e.target.value)}
                >
                  <option value="">Select a product</option>
                  {searchResults.map((result) => (
                    <option key={result.ProductName} value={result.ProductName}>
                      {result.ProductName}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <input
              type="text"
              placeholder="City (optional)"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <input
              type="text"
              placeholder="Country"
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newQuantity}
              onChange={(e) => setNewQuantity(Number(e.target.value))}
              min="1"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {error && <div className="text-red-600 mb-4">{error}</div>}

          {products.length > 0 && (
            <div className="bg-white w-full rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-2xl font-bold mb-4">Grocery List</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div key={product.ProductName} className="flex justify-between items-center border-b py-4">
                    <div>
                      <h4 className="text-xl">{product.ProductName}</h4>
                      <p className="text-gray-600">Location: {product.Location}</p>
                      <p className="text-gray-600">Emissions: {product.TotalEmissions} kg CO₂</p>
                      <p className="text-gray-600">Fuel Usage: {product.FuelUsageGallons} gallons</p>
                    </div>
                    <button
                      onClick={() => deleteProduct(product.ProductName)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer hover:bg-red-700 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-end gap-4">
                <div className="font-semibold text-xl">Total Emissions: {totalEmissions} kg CO₂</div>
                <div className="font-semibold text-xl">Total Fuel Usage: {totalFuelUsage} gallons</div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
