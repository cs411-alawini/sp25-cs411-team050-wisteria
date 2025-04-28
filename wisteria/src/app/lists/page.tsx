"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";

interface GroceryProduct {
  UserId: number;
  ProductId: number;
  ProductName: string;
  LocationName: string;
  TotalProductEC: number | string;
  EstimatedFuelGallons: number;
}

interface GroceryList {
  glId: number;
  name: string;
}

export default function GroceryListPage() {
  const [lists, setLists] = useState<GroceryList[]>([]);
  const [selectedGlId, setSelectedGlId] = useState<number | null>(null);
  const [manualGlId, setManualGlId] = useState<string>("");
  const [products, setProducts] = useState<GroceryProduct[]>([]);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  // Product search and selection
  const [productName, setProductName] = useState<string>("");
  const [productId, setProductId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Location information
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("");

  const [error, setError] = useState<string>("");
  const [hasMounted, setHasMounted] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    setHasMounted(true);
    fetchUserProfile();
    initializeNumberedLists();
  }, []);

  useEffect(() => {
    if (selectedGlId !== null) {
      fetchGroceryList(selectedGlId);
      setManualGlId(selectedGlId.toString());
    }
  }, [selectedGlId]);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (res.ok) {
        setFirstName(data.firstName);
        setLastName(data.lastName);
      }
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  // Initialize numbered lists from 1 to 10
  const initializeNumberedLists = () => {
    const numberedLists = Array.from({ length: 10 }, (_, i) => ({
      glId: i + 1,
      name: `${i + 1}`,
    }));
    setLists(numberedLists);
    setSelectedGlId(1); // Default to first list
    setManualGlId("1");
  };

  const fetchGroceryList = async (glId: number) => {
    try {
      const res = await fetch(`/api/grocerylist?glId=${glId}`);
      const data = await res.json();

      if (data.success && data.products) {
        setProducts(data.products);
        setError("");
      } else {
        setProducts([]);
        setError("No products found in this list");
      }
    } catch (err) {
      console.error("Failed to load grocery list", err);
      setError("Failed to load grocery list");
    }
  };

  const handleProductSearch = async (keyword: string) => {
    setError("");
    setProductId(null);
    setSearchResults([]);

    if (keyword.length < 2) return;

    try {
      const res = await fetch("/api/listProd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, city, country }),
      });

      const data = await res.json();
      const products = data.products || [];
      setSearchResults(products);

      if (products.length === 1) {
        // auto-select the only row
        const p = products[0];
        setProductName(p.ProductName);
        setProductId(p.ProductId);
        // overwrite city/country if backend was more precise
        setCity(p.City || city);
        setCountry(p.Country || country);
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Failed to search products", err);
      setError("Failed to search products");
    }
  };

  const addProduct = async () => {
    // Use the manual input glId if available, otherwise use the selected one
    const targetGlId = manualGlId ? parseInt(manualGlId) : selectedGlId;

    if (!productId || quantity <= 0 || !targetGlId) {
      setError(
        "Please select a product, enter a valid quantity, and specify a list ID."
      );
      return;
    }

    // At least country is required for location
    if (!country) {
      setError("Please enter at least a country for the location.");
      return;
    }

    try {
      const payload = {
        productId,
        quantity,
        city,
        country,
        glId: targetGlId,
      };

      const res = await fetch("/api/grocerylist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        if (data.products) {
          // If the API returns the updated products, use them
          setProducts(data.products);
        } else {
          // Otherwise, fetch the updated list
          fetchGroceryList(targetGlId);
        }

        // Reset form fields except for glId
        setProductName("");
        setProductId(null);
        setQuantity(1);
        setCity("");
        setCountry("");
        setSearchResults([]);
        setError("");

        // Update selected glId to match what we just added to
        setSelectedGlId(targetGlId);
      } else {
        setError(data.error || "Failed to add product");
      }
    } catch (err) {
      console.error("Failed to add product", err);
      setError("Failed to add product");
    }
  };

  const deleteProduct = async (productId: number) => {
    if (selectedGlId === null) return;
    console.log("Deleting product", { glId: selectedGlId, productId }); 
    try {
      const res = await fetch("/api/grocerylist/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ glId: selectedGlId, productId }),
      });
      const data: any = await res.json();
      if (data.success) {
        fetchGroceryList(selectedGlId);
      } else {
        setError(data.error || "Failed to delete product.");
      }
    } catch {
      setError("Failed to delete product.");
    }
  };

  const deleteGroceryList = async () => {
    if (selectedGlId === null) return;

    try {
      const res = await fetch("/api/grocerylist/deleteAll", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ glId: selectedGlId }),
      });

      const data = await res.json();

      if (data.success) {
        setProducts([]);
        setError("");
      } else {
        setError(data.error || "Failed to delete list");
      }
    } catch (err) {
      console.error("Failed to delete list", err);
      setError("Failed to delete list");
    }
  };

  const handleManualGlIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setManualGlId(value);

    // If valid number and in range, update selected list too
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 10) {
      setSelectedGlId(numValue);
    }
  };

  // Calculate totals using the correct field names from the API response
  const totalEmissions = products.reduce(
    (sum, p) =>
      sum +
      (typeof p.TotalProductEC === "string"
        ? parseFloat(p.TotalProductEC)
        : p.TotalProductEC || 0),
    0
  );

  const totalFuelUsage = products.reduce(
    (sum, p) => sum + (p.EstimatedFuelGallons || 0),
    0
  );

  if (!hasMounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-black">
      <Navbar />
      <main className="p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-3xl font-bold text-blue-900">
              {firstName} {lastName}&apos;s Grocery Lists
            </h2>
            <div className="flex gap-4">
              <select
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={selectedGlId ?? ""}
                onChange={(e) => setSelectedGlId(Number(e.target.value))}
              >
                {lists.map((l) => (
                  <option key={l.glId} value={l.glId}>
                    List {l.name}
                  </option>
                ))}
              </select>
              {products.length > 0 && (
  <>
    <button
      onClick={deleteGroceryList}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
    >
      Clear List
    </button>
    <button
      onClick={async () => {
        if (selectedGlId === null) return;
        // Always assume success and increment glId
        const maxId = lists.length > 0 ? Math.max(...lists.map(l => l.glId)) : 0;
        const newGlId = maxId + 1;
        setLists((prev) => [...prev, { glId: newGlId, name: `${newGlId}` }]);
        setSelectedGlId(newGlId);
        setManualGlId(`${newGlId}`);
      }}
      className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
    >
      Duplicate List
    </button>
  </>
)}
            </div>
          </div>

          <div className="my-4 w-full flex flex-col gap-4">
            {/* List ID input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grocery List ID (1-10)
              </label>
              <input
                type="number"
                min={1}
                max={10}
                placeholder="Enter list ID"
                value={manualGlId}
                onChange={handleManualGlIdChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Product search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product
              </label>
              <input
                type="text"
                placeholder="Search products..."
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value);
                  handleProductSearch(e.target.value);
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchResults.length > 0 && (
                <ul className="mt-2 border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                  {searchResults.map((prod) => (
                    <li
                      key={`${prod.ProductId}-${prod.LocationId}`}
                      onClick={() => {
                        setProductName(prod.ProductName);
                        setProductId(prod.ProductId);
                        setCity(prod.City || city);
                        setCountry(prod.Country || country);
                        setSearchResults([]);
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                    >
                      {prod.ProductName} — {prod.City || "Any City"},{" "}
                      {prod.Country || "Any Country"}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Location fields */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City (optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country (required)
                </label>
                <input
                  type="text"
                  placeholder="Enter country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Quantity field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                min={1}
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={addProduct}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all"
            >
              Add Product
            </button>
            
          </div>

          <div className="bg-white w-full rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Grocery List {selectedGlId !== null ? selectedGlId : ""}
            </h3>
            {products.length > 0 ? (
              <table className="w-full text-left text-gray-800">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 font-semibold">Product</th>
                    <th className="pb-3 font-semibold">Location</th>
                    <th className="pb-3 font-semibold">Emissions (kg CO₂)</th>
                    <th className="pb-3 font-semibold">Fuel (gal)</th>
                    <th className="pb-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-4">{product.ProductName}</td>
                      <td className="py-4">{product.LocationName}</td>
                      <td className="py-4">
                        {typeof product.TotalProductEC === "string"
                          ? parseFloat(product.TotalProductEC).toFixed(2)
                          : product.TotalProductEC.toFixed(2)}
                      </td>
                      <td className="py-4">
                        {product.EstimatedFuelGallons.toFixed(2)}
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => deleteProduct(product.ProductId)}
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
              <p className="text-gray-600 text-center py-10">
                No products added yet.
              </p>
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
