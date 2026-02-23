"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAPI, APIError } from "@/lib/services/api.client";
import { showError } from "@/lib/notifications";
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
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions (Audit Log)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="text-muted-foreground">No transactions yet</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Order ID</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Provider</th>
                  <th className="text-left p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} className="border-b">
                    <td className="p-2 font-mono text-sm">{txn.order_id.substring(0, 8)}...</td>
                    <td className="p-2">${txn.amount.toFixed(2)} {txn.currency}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        txn.status === 'succeeded' ? 'bg-green-100 text-green-800' :
                        txn.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="p-2">{txn.provider}</td>
                    <td className="p-2">{new Date(txn.created_at!).toLocaleDateString()}</td>
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
