// app/auth/signup/page.js
"use client";

import { Suspense, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Phone, MapPin, Loader, Check, AlertCircle, ArrowLeft } from "lucide-react";

// Signup компонент (useSearchParams агуулсан)
function SignupContent() {
  const { signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultRole = searchParams.get("role") || "customer";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    role: defaultRole
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Нууц үг таарахгүй байна");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Нууц үг хамгийн багадаа 6 тэмдэгттэй байх ёстой");
      setLoading(false);
      return;
    }

    try {
      const result = await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        role: formData.role,
        address: formData.address
      });

      setLoading(false);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/login');
        }, 5000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div className="max-w-xl w-full bg-card border border-border shadow-xl rounded-2xl p-8 relative">
          <div className="text-center mb-8">
            <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="size-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              ✅ Амжилттай бүртгэгдлээ!
            </h2>
            <p className="text-muted-foreground mb-6">
              Таны и-мэйл хаяг руу баталгаажуулах имэйл илгээсэн.
            </p>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 mb-6 text-left">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-2">
                📧 И-мэйл шалгах алхмууд:
              </p>
              <ol className="text-sm text-blue-600/80 dark:text-blue-400/80 space-y-1 pl-4 list-decimal">
                <li>И-мэйл хайрцгаа нээнэ үү</li>
                <li>"Confirm your email" гэсэн захиа хайна уу</li>
                <li>"Spam" folder-д ч шалгана уу!</li>
                <li>Линк дээр дарж баталгаажуулна уу</li>
              </ol>
            </div>
            <Link
              href="/auth/login"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Нэвтрэх хуудас руу очих
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 flex justify-center">
      <div className="max-w-2xl w-full bg-card border border-border/50 rounded-2xl shadow-xl shadow-primary/5 p-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 size-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="mb-8 text-center relative z-10">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="size-4 mr-1" /> Нүүр хуудас
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Бүртгүүлэх</h1>
          <p className="text-muted-foreground">Smart Herder платформд тавтай морил</p>
        </div>

        <div className="mb-8 relative z-10">
          <label className="block text-sm font-medium text-foreground mb-3">
            Та хэн бэ?
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "customer", label: "Хэрэглэгч", desc: "Бараа авах" },
              { value: "herder", label: "Малчин", desc: "Бараа зарах" },
              { value: "admin", label: "Админ", desc: "Удирдах" }
            ].map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => setFormData({ ...formData, role: role.value })}
                className={`p-4 rounded-xl border transition-all text-center ${formData.role === role.value
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "border-border hover:border-primary/50 bg-background text-foreground"
                  }`}
              >
                <p className={`font-bold ${formData.role === role.value ? "text-primary-foreground" : "text-foreground"}`}>
                  {role.label}
                </p>
                <p className={`text-xs mt-1 ${formData.role === role.value ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{role.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl mb-6 flex items-start gap-3">
            <AlertCircle className="size-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Алдаа гарлаа</p>
              <p className="text-sm mt-1 opacity-90">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Нэр *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition duration-200"
                placeholder="Таны нэр"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              И-мэйл хаяг *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition duration-200"
                placeholder="example@email.com"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Нууц үг *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition duration-200"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Нууц үг давтах *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition duration-200"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Утас (optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition duration-200"
                  placeholder="99112233"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Хаяг (optional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition duration-200"
                  placeholder="Улаанбаатар"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader className="size-5 animate-spin" />
                Бүртгэж байна...
              </>
            ) : (
              'Бүртгүүлэх'
            )}
          </button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <p className="text-muted-foreground">
            Бүртгэлтэй юу?{' '}
            <Link href="/auth/login" className="text-primary font-semibold hover:underline">
              Нэвтрэх
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Үндсэн экспорт (Suspense-ээр хүрээлэгдсэн)
export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <Loader className="size-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Хуудас ачааллаж байна...</p>
        </div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}