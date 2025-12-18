// components/navbar.js
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Trees, ShoppingBasket, LayoutDashboard, LogOut, User } from "lucide-react"; // Assuming lucide-react is installed as per package.json

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const linkClass = (path) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent ${pathname === path
      ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
      : "text-muted-foreground hover:text-foreground hover:bg-muted"
    }`;

  return (
    <nav className="w-full">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            <Trees className="size-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            Smart Herder
          </span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {user.role === "herder" ? "Малчин" : user.role === "admin" ? "Админ" : "Хэрэглэгч"}
                </span>
              </div>

              <Link
                href="/profile"
                className={`${linkClass("/profile")} flex items-center p-1 pr-4`}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="size-8 rounded-full object-cover mr-2 border border-border/50"
                  />
                ) : (
                  <User className="size-4 mr-2" />
                )}
                {user.fullName || user.name || "Профайл"}
              </Link>

              <Link
                href={
                  user.role === "herder"
                    ? "/herder"
                    : user.role === "admin"
                      ? "/admin"
                      : "/customer"
                }
                className={linkClass(
                  user.role === "herder"
                    ? "/herder"
                    : user.role === "admin"
                      ? "/admin"
                      : "/customer"
                )}
              >
                <LayoutDashboard className="size-4 inline-block mr-2" />
                Самбар
              </Link>

              <button
                onClick={logout}
                className="p-2 rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Гарах"
              >
                <LogOut className="size-5" />
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-4">
                Нэвтрэх
              </Link>
              <Link href="/auth/signup" className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30">
                Бүртгүүлэх
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
