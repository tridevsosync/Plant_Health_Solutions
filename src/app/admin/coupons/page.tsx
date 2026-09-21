"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export default function AdminCouponsPage() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6 text-sm text-muted-foreground">
      Redirecting to dashboard...
    </div>
  );
}
