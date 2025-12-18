// app/page.js
import Link from "next/link";
import { Trees, ShoppingBasket, ShieldCheck, ArrowRight, Sprout } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-secondary-foreground text-sm font-semibold mb-8 border border-secondary">
            <Sprout className="size-4 text-primary" />
            <span>Шинэ үеийн мал аж ахуйн систем</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 max-w-4xl mx-auto leading-[1.1]">
            <span className="text-primary">Малчин</span>, хэрэглэгчийг холбох <span className="relative whitespace-nowrap">ухаалаг<span className="absolute bottom-2 left-0 w-full h-3 bg-accent/20 -z-10 -rotate-1"></span></span> гүүр
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Малчин та бүтээгдэхүүнээ дундын зуучлалгүйгээр шууд хэрэглэгчдэд хүргэж, хэрэглэгч та гарал үүсэл нь баталгаатай, эрүүл хүнс хэрэглээрэй.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/auth/signup" className="px-8 py-4 bg-primary text-primary-foreground text-lg font-semibold rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-primary/25 hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2">
              Эхлүүлэх <ArrowRight className="size-5" />
            </Link>
            <Link href="#roles" className="px-8 py-4 bg-secondary text-secondary-foreground hover:bg-secondary/80 text-lg font-semibold rounded-2xl border border-transparent transition-all flex items-center gap-2">
              Дэлгэрэнгүй
            </Link>
          </div>
        </div>
      </section>

      {/* Roles Grid */}
      <section id="roles" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Таны үүрэг юу вэ?</h2>

          <div className="grid gap-8 md:grid-cols-3">
            <RoleCard
              title="Малчин"
              href="/auth/signup?role=herder"
              desc="Бараа оруулах, захиалга авах, орлогоо хянах нэгдсэн систем."
              icon={Trees}
              color="text-emerald-600"
              bg="bg-emerald-50 dark:bg-emerald-900/20"
            />
            <RoleCard
              title="Хэрэглэгч"
              href="/auth/signup?role=customer"
              desc="Баталгаатай хүнс хайх, сагслах, захиалах хялбар шийдэл."
              icon={ShoppingBasket}
              color="text-blue-600"
              bg="bg-blue-50 dark:bg-blue-900/20"
            />
            <RoleCard
              title="Админ"
              href="/auth/signup?role=admin"
              desc="Бараа бүтээгдэхүүн баталгаажуулах, системийг хянах."
              icon={ShieldCheck}
              color="text-orange-600"
              bg="bg-orange-50 dark:bg-orange-900/20"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function RoleCard({ title, href, desc, icon: Icon, color, bg }) {
  return (
    <Link href={href} className="group relative bg-card p-8 rounded-3xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
      <div className={`size - 14 rounded - 2xl ${bg} ${color} flex items - center justify - center mb - 6 group - hover: scale - 110 transition - transform duration - 300`}>
        <Icon className="size-7" />
      </div>
      <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>

      <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
        <ArrowRight className="size-5 text-primary" />
      </div>
    </Link>
  );
}