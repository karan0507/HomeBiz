"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAPI, APIError } from "@/lib/services/api.client";
import { showError } from "@/lib/notifications";
import type { DietaryOption } from "@/types/database";

export default function AdminDietaryOptionsPage() {
  const [options, setOptions] = useState<DietaryOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI<DietaryOption[]>("/admin/dietary-options")
      .then(setOptions)
      .catch((err) => showError(err as APIError))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Dietary Options</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Order</th>
                  <th className="text-left p-2">Active</th>
                </tr>
              </thead>
              <tbody>
                {options.map((opt) => (
                  <tr key={opt.id} className="border-b">
                    <td className="p-2">{opt.name}</td>
                    <td className="p-2">{opt.display_order}</td>
                    <td className="p-2">{opt.is_active ? "Yes" : "No"}</td>
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
