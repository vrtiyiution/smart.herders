// app/(protected)/layout.js   ← ЯГ ИЙМ БОЛГО!
"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({ children }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
      return;
    }

    // Одоо ямар хуудас дээр байгааг шалгаж, role таарч байгаа эсэхийг шалгана
    const segment = pathname.split("/")[1]; // /herder → "herder"

    const allowedRoles = {
      herder: "herder",
      admin: "admin",
      customer: "customer",
    };

    if (allowedRoles[segment] && user.role !== allowedRoles[segment]) {
      // Буруу role-той хүн хувийн хуудас руу орсон бол зөв газар нь явуулна
      const correctPath =
        user.role === "herder"
          ? "/herder"
          : user.role === "admin"
            ? "/admin"
            : "/customer";
      router.replace(correctPath);
    }
  }, [user, pathname, router]);

  // Шилжүүлж байх үед loading
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl animate-pulse text-muted-foreground">Шилжүүлж байна...</p>
      </div>
    );
  }

  return <>{children}</>;
}
