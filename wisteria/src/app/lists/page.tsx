"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";

interface GroceryProduct {
  ProductId: number;
  ProductName: string;
  Location: string;
  TotalEmissions: number;
  FuelUsageGallons: number;
}

interface GroceryList {
  glId: number;
  name: string;
}

export default function GroceryListPage() {
  const [lists, setLists] = useState<GroceryList[]>([]);
  const [selectedGlId, setSelectedGlId] = useState<number | null>(null);
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
  const [selectedProductRow, setSelectedProductRow] = useState<any | null>(
    null
  );

  useEffect(() => {
    setHasMounted(true);
    fetchUserProfile();
    fetchLists();
  }, []);

  useEffect(() => {
    if (selectedGlId !== null) {
      fetchGroceryList(selectedGlId);
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
    } catch {
      console.error("Failed to fetch user profile");
    }
  };

  const fetchLists = async () => {
    try {
      const res = await fetch("/api/grocerylists");
      const data: any = await res.json();
      if (data.lists) {
        setLists(data.lists);
        if (data.lists.length > 0 && selectedGlId === null) {
          setSelectedGlId(data.lists[0].glId);
        }
      }
    } catch {
      console.error("Failed to fetch grocery lists");
    }
  };

  const fetchGroceryList = async (glId: number) => {
    try {
      const res = await fetch(`/api/grocerylist?glId=${glId}`);
      const data: any = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch {
      setError("Failed to load grocery list.");
    }
  };

  const handleProductSearch = async (keyword: string) => {
    setError("");
    setSelectedProductRow(null);
    setSearchResults([]);
    if (keyword.length < 2) return;
    try {
      const res = await fetch("/api/productSearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword,
          city: newCity || null,
          country: newCountry,
        }),
      });
      const data: any = await res.json();
      setSearchResults(data.products || []);
    } catch {
      console.error("Failed to search products");
    }
  };

  const addProduct = async () => {
    if (
      !selectedProductRow ||
      !newCountry ||
      newQuantity <= 0 ||
      selectedGlId === null
    ) {
      setError("Select product, location, quantity, and list.");
      return;
    }
    try {
      const res = await fetch("/api/grocerylist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProductRow.ProductId,
          quantity: newQuantity,
          locationId:
            selectedProductRow.Location.locationId ??
            selectedProductRow.LocationId,
          glId: selectedGlId,
        }),
      });
      const data: any = await res.json();
      if (data.success) {
        fetchGroceryList(selectedGlId);
        setNewProduct("");
        setNewCity("");
        setNewCountry("");
        setNewQuantity(1);
        setSelectedProductRow(null);
        setSearchResults([]);
        setError("");
      } else {
        setError(data.error || "Failed to add product.");
      }
    } catch {
      setError("Failed to add product.");
    }
  };

  const deleteProduct = async (productId: number) => {
    if (selectedGlId === null) return;
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
      const data: any = await res.json();
      if (data.success) {
        setProducts([]);
        fetchLists();
      } else {
        setError(data.error || "Failed to delete list.");
      }
    } catch {
      setError("Failed to delete list.");
    }
  };

  const totalEmissions = products.reduce(
    (sum, p) => sum + (p.TotalEmissions || 0),
    0
  );
  const totalFuelUsage = products.reduce(
    (sum, p) => sum + (p.FuelUsageGallons || 0),
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
                    {l.name}
                  </option>
                ))}
              </select>
              {products.length > 0 && (
                <button
                  onClick={deleteGroceryList}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete List
                </button>
              )}
            </div>
          </div>

          <div className="my-4 w-full flex flex-col gap-4">
            <input
              type="text"
              placeholder="Product"
              value={newProduct}
              onChange={(e) => {
                setNewProduct(e.target.value);
                handleProductSearch(e.target.value);
              }}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchResults.length > 0 && (
              <ul className="border border-gray-300 rounded-lg max-h-56 overflow-y-auto bg-white">
                {searchResults.map((prod) => (
                  <li
                    key={prod.ProductId}
                    onClick={() => {
                      setNewProduct(prod.ProductName);
                      setSelectedProductRow(prod);
                      setSearchResults([]);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {prod.ProductName}
                  </li>
                ))}
              </ul>
            )}
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="City (optional)"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Country"
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                min={1}
                placeholder="Quantity"
                value={newQuantity}
                onChange={(e) => setNewQuantity(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={addProduct}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all"
            >
              Add Product
            </button>
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </div>

          <div className="bg-white w-full rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Grocery List
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
                  {products.map((product) => (
                    <tr key={product.ProductId} className="border-b">
                      <td className="py-4">{product.ProductName}</td>
                      <td className="py-4">{product.Location}</td>
                      <td className="py-4">
                        {product.TotalEmissions.toFixed(2)}
                      </td>
                      <td className="py-4">
                        {product.FuelUsageGallons.toFixed(2)}
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
