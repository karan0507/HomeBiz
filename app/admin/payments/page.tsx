"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableLoader } from "@/components/shared/table-loader";
import { fetchAPI, APIError } from "@/lib/services/api.client";
import { showError } from "@/lib/notifications";
import { Badge } from "@/components/ui/badge";
import type { PaymentTransaction } from "@/types/database";

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI<PaymentTransaction[]>("/admin/payment-transactions")
      .then(setTransactions)
      .catch((err) => showError(err as APIError))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Transactions (Audit Log)</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <TableLoader />
              ) : transactions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <p className="font-medium">No transactions yet</p>
                  <p className="text-sm mt-1">Payment transactions will appear here once orders are placed.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-muted-foreground">
                        <th className="text-left p-3 font-medium">Order ID</th>
                        <th className="text-left p-3 font-medium">Amount</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Provider</th>
                        <th className="text-left p-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((txn) => (
                        <tr key={txn.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="p-3 font-mono text-xs">{txn.order_id.substring(0, 8)}…</td>
                          <td className="p-3 font-medium">${txn.amount.toFixed(2)} <span className="text-muted-foreground text-xs">{txn.currency}</span></td>
                          <td className="p-3">
                            <Badge
                              className={
                                txn.status === "succeeded"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : txn.status === "pending" || txn.status === "processing"
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                              }
                            >
                              {txn.status}
                            </Badge>
                          </td>
                          <td className="p-3 capitalize">{txn.provider}</td>
                          <td className="p-3 text-muted-foreground">
                            {new Date(txn.created_at).toLocaleDateString("en-CA", {
                              dateStyle: "medium",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
