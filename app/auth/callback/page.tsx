"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyToken = async () => {
      const token_hash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      if (!token_hash || !type) {
        router.replace("/login?error=invalid_link");
        return;
      }

      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any,
        });

        if (error) {
          router.replace("/login?error=verification_failed");
          return;
        }

        // Success - redirect to home
        router.replace("/?verified=true");
      } catch (err) {
        router.replace("/login?error=unexpected_error");
      }
    };

    verifyToken();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-lg font-medium">Verifying your email...</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please wait while we confirm your account.
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium">Loading...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
