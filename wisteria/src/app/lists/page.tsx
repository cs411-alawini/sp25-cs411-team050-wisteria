"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";

interface GroceryProduct {
  ProductName: string;
  Location: string;
  TotalEmissions: number;
  FuelUsageGallons: number;
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
  const [hasMounted, setHasMounted] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedProductRow, setSelectedProductRow] = useState<any | null>(null);

  useEffect(() => {
    setHasMounted(true);
    fetchUserProfile();
    fetchGroceryList();
  }, []);

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

  const handleProductSearch = async (keyword: string) => {
    if (keyword.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch("/api/productSearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword,
          city: newCity || null,
          country: newCountry,
        }),
      });

      const data = await response.json();
      if (data.products) {
        setSearchResults(data.products);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Failed to search products:", err);
      setSearchResults([]);
    }
  };

  const addProduct = async () => {
    if (!selectedProductRow || !newCountry || newQuantity <= 0) {
      setError("Please select a valid product from the dropdown, enter location, and quantity.");
      return;
    }
  
    try {
      const response = await fetch("/api/grocerylist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: selectedProductRow.ProductName, // use selected product object
          city: newCity || null,
          country: newCountry,
          quantity: newQuantity,
        }),
      });
  
      const data = await response.json();
      if (data.success) {
        fetchGroceryList();
        setNewProduct("");
        setNewCity("");
        setNewCountry("");
        setNewQuantity(1);
        setSelectedProductRow(null);  // clear selection
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
      } else {
        setError("Failed to delete product.");
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
      } else {
        setError("Failed to delete the entire grocery list.");
      }
    } catch (err) {
      setError("Failed to delete the entire grocery list.");
    }
  };

  const totalEmissions = products.reduce((acc, product) => acc + (product.TotalEmissions || 0), 0);
  const totalFuelUsage = products.reduce((acc, product) => acc + (product.FuelUsageGallons || 0), 0);

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <main className="p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl flex flex-col gap-6">

          <div className="flex justify-between items-center w-full">
            <h2 className="text-3xl font-bold text-blue-900">
              {firstName} {lastName}&apos;s Grocery List
            </h2>
            {products.length > 0 && (
              <button
                onClick={deleteGroceryList}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-lg cursor-pointer hover:bg-red-700 transition-all shadow-sm"
              >
                Delete Entire List
              </button>
            )}
          </div>

          {/* Updated Add Product Form */}
          <div className="my-4 w-full flex flex-col gap-4">
            <input
              type="text"
              placeholder="Product"
              value={newProduct}
              onChange={(e) => {
                setNewProduct(e.target.value);
                setSelectedProductRow(null); // reset selection if they start typing
                handleProductSearch(e.target.value);
              }}
              
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm placeholder-gray-600"
            />

            {/* Dropdown results */}
            {searchResults.length > 0 && (
              <ul className="border rounded-lg max-h-60 overflow-y-auto">
                {searchResults.map((product) => (
                  <li
                    key={product.ProductName}
                    onClick={() => {
                      setNewProduct(product.ProductName);
                      setSelectedProductRow(product);  // store the full product object!
                      setSearchResults([]);
                    }}                    
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {product.ProductName}
                  </li>
                ))}
              </ul>
            )}

            <input
              type="text"
              placeholder="City (optional)"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm placeholder-gray-600"
            />
            <input
              type="text"
              placeholder="Country"
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm placeholder-gray-600"
            />
            <input
              type="number"
              placeholder="Quantity"
              min={1}
              value={newQuantity}
              onChange={(e) => setNewQuantity(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm placeholder-gray-600"
            />

            <button
              onClick={addProduct}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-emerald-700 transition-all"
            >
              Add Product
            </button>

            {error && <div className="text-red-600 mt-2">{error}</div>}
          </div>

          {/* Grocery List Table */}
          <div className="bg-white w-full rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Grocery List</h3>

            {products.length > 0 ? (
              <table className="w-full text-left text-gray-800">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 font-semibold">Product</th>
                    <th className="pb-3 font-semibold">Location</th>
                    <th className="pb-3 font-semibold">Emissions (kg CO₂)</th>
                    <th className="pb-3 font-semibold">Fuel Usage (gallons)</th>
                    <th className="pb-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.ProductName} className="border-b">
                      <td className="py-4">{product.ProductName}</td>
                      <td className="py-4">{product.Location}</td>
                      <td className="py-4">
                        {typeof product.TotalEmissions === "number"
                          ? product.TotalEmissions.toFixed(2)
                          : "0.00"}
                      </td>
                      <td className="py-4">
                        {typeof product.FuelUsageGallons === "number"
                          ? product.FuelUsageGallons.toFixed(2)
                          : "0.00"}
                      </td>

                      <td className="py-4">
                        <button
                          onClick={() => deleteProduct(product.ProductName)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600 text-center py-10">No products added yet.</p>
            )}

            {products.length > 0 && (
              <div className="mt-6 flex justify-end gap-8 text-xl font-bold text-blue-900">
                <div>Total Emissions: {totalEmissions.toFixed(2)} kg CO₂</div>
                <div>Total Fuel Usage: {totalFuelUsage.toFixed(2)} gallons</div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
