// app/auth/login/page.js
"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirectPath =
        user.role === "herder"
          ? "/herder"
          : user.role === "admin"
            ? "/admin"
            : "/customer";

      // Small timeout to ensure hydration/state is ready
      const timer = setTimeout(() => {
        router.push(redirectPath);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [user, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (login(email, password)) {
      // Success - useEffect handles redirect
    } else {
      alert("И-мэйл эсвэл нууц үг буруу байна!");
    }
  };

  if (user) {
    const redirectPath =
      user.role === "herder"
        ? "/herder"
        : user.role === "admin"
          ? "/admin"
          : "/customer";

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 text-center">
        <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-xl font-medium mb-4">Шилжүүлж байна...</p>
        <p className="text-muted-foreground mb-6">Түр хүлээнэ үү.</p>

        <Link
          href={redirectPath}
          className="text-primary hover:underline underline-offset-4 font-medium"
        >
          Шилжихгүй бол энд дарна уу
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-card border border-border/50 shadow-xl shadow-primary/5 rounded-2xl p-8 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft className="w-4 h-4 mr-1" /> Нүүр хуудас
            </Link>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Нэвтрэх</h1>
            <p className="text-muted-foreground mt-2">Тавтай морилно уу</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                name="email"
                type="email"
                required
                placeholder="И-мэйл хаяг"
                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition duration-200"
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                placeholder="Нууц үг"
                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition duration-200"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98]"
            >
              Нэвтрэх
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Бүртгэлгүй юу? </span>
            <Link href="/auth/signup" className="font-semibold text-primary hover:underline">
              Бүртгүүлэх
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
