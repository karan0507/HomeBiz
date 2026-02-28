"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAPI, APIError } from "@/lib/services/api.client";
import { showError, showSuccess } from "@/lib/notifications";
import type { CuisineType } from "@/types/database";

export default function AdminCuisineTypesPage() {
  const [cuisineTypes, setCuisineTypes] = useState<CuisineType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCuisineTypes();
  }, []);

  const loadCuisineTypes = async () => {
    try {
      setLoading(true);
      const data = await fetchAPI<CuisineType[]>("/admin/cuisine-types");
      setCuisineTypes(data);
    } catch (err) {
      showError(err as APIError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Cuisine Types</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Slug</th>
                  <th className="text-left p-2">Icon</th>
                  <th className="text-left p-2">Order</th>
                  <th className="text-left p-2">Active</th>
                </tr>
              </thead>
              <tbody>
                {cuisineTypes.map((ct) => (
                  <tr key={ct.id} className="border-b">
                    <td className="p-2">{ct.name}</td>
                    <td className="p-2">{ct.slug}</td>
                    <td className="p-2">{ct.icon}</td>
                    <td className="p-2">{ct.display_order}</td>
                    <td className="p-2">{ct.is_active ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
