// app/(protected)/admin/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, Clock, User, RefreshCw, Trash2, RotateCcw } from "lucide-react";

export default function AdminDashboard() {
  const [tab, setTab] = useState("pending");
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [deleted, setDeleted] = useState([]);

  const loadAll = () => {
    const all = JSON.parse(localStorage.getItem("products") || "[]");
    const trash = JSON.parse(localStorage.getItem("deletedProducts") || "[]");

    setPending(all.filter((p) => p.status === "pending"));
    setApproved(all.filter((p) => p.status === "approved"));
    setRejected(all.filter((p) => p.status === "rejected"));
    setDeleted(trash);
  };

  useEffect(() => {
    loadAll();
    const interval = setInterval(loadAll, 3000);
    return () => clearInterval(interval);
  }, []);

  const setStatus = (id, newStatus, reason = null) => {
    const all = JSON.parse(localStorage.getItem("products") || "[]");
    const updated = all.map((p) =>
      p.id === id ? { ...p, status: newStatus, rejectionReason: reason || p.rejectionReason, rejectedAt: reason ? new Date().toISOString() : p.rejectedAt } : p
    );
    localStorage.setItem("products", JSON.stringify(updated));
    loadAll();
  };

  const approve = (id) => setStatus(id, "approved");

  const reject = (id) => {
    const reason = prompt("Цуцлах шалтгаан/зөвлөмж бичих (заавал):", "Зураг тодорхойгүй, үнэ бодит бус, тайлбар дутуу гэх мэт");
    if (!reason || reason.trim() === "") {
      alert("Шалтгаан заавал бичих ёстой!");
      return;
    }
    setStatus(id, "rejected", reason.trim());
    alert("Пост цуцлагдлаа. Малчин таны зөвлөмжийг харах болно.");
  };

  const revert = (id) => setStatus(id, "pending");

  const moveToTrash = (id) => {
    if (!confirm("Хогийн сав руу хаях уу? Малчинд 'Цуцлагдсан' гэж харагдана.")) return;
    const all = JSON.parse(localStorage.getItem("products") || "[]");
    const product = all.find((p) => p.id === id);
    const remaining = all.filter((p) => p.id !== id);
    const trash = JSON.parse(localStorage.getItem("deletedProducts") || "[]");
    trash.push({ ...product, deletedAt: new Date().toISOString() });
    localStorage.setItem("products", JSON.stringify(remaining));
    localStorage.setItem("deletedProducts", JSON.stringify(trash));
    loadAll();
  };

  const restoreFromTrash = (id) => {
    const trash = JSON.parse(localStorage.getItem("deletedProducts") || "[]");
    const product = trash.find((p) => p.id === id);
    const newTrash = trash.filter((p) => p.id !== id);
    const all = JSON.parse(localStorage.getItem("products") || "[]");
    all.push({ ...product, status: "pending", rejectionReason: null, rejectedAt: null });
    localStorage.setItem("products", JSON.stringify(all));
    localStorage.setItem("deletedProducts", JSON.stringify(newTrash));
    loadAll();
  };

  const permanentDelete = (id) => {
    if (!confirm("Бүрмөсөн устгах уу?")) return;
    const trash = JSON.parse(localStorage.getItem("deletedProducts") || "[]");
    const newTrash = trash.filter((p) => p.id !== id);
    localStorage.setItem("deletedProducts", JSON.stringify(newTrash));
    loadAll();
  };

  const renderProductCard = (p, isTrash = false) => (
    <div key={p.id} className="bg-card rounded-xl shadow-lg overflow-hidden border border-border hover:border-primary transition duration-200">
      <div className="h-48 bg-muted relative">
        {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-muted-foreground">Зураг байхгүй</div>}
        <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-2 border border-border/50"><User className="size-3" /> {p.herderName || "Малчин"}</div>
      </div>
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-bold text-card-foreground line-clamp-1">{p.productType}</h3>
        <p className="text-2xl font-bold text-primary">{Number(p.price).toLocaleString()}₮</p>
        <p className="text-muted-foreground text-sm line-clamp-2">{p.desc || "Тайлбар байхгүй"}</p>

        <div className="flex flex-col gap-2 pt-2">
          {!isTrash && p.status !== "approved" && <button onClick={() => approve(p.id)} className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2"><CheckCircle className="size-4" /> Зөвшөөрөх</button>}

          {!isTrash && p.status !== "rejected" && <button onClick={() => reject(p.id)} className="w-full bg-destructive/90 hover:bg-destructive text-destructive-foreground py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2"><XCircle className="size-4" /> Цуцлах</button>}

          {!isTrash && (p.status === "approved" || p.status === "rejected") && <button onClick={() => revert(p.id)} className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2"><RefreshCw className="size-4" /> Буцаах</button>}

          {!isTrash ? <button onClick={() => moveToTrash(p.id)} className="w-full bg-muted/50 hover:bg-muted text-muted-foreground py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2"><Trash2 className="size-4" /> Хогийн сав</button> : <div className="flex gap-2"><button onClick={() => restoreFromTrash(p.id)} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1"><RotateCcw className="size-3" /> Сэргээх</button><button onClick={() => permanentDelete(p.id)} className="flex-1 bg-red-800 hover:bg-red-700 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1"><Trash2 className="size-3" /> Устгах</button></div>}
        </div>

        <div className="text-center pt-2 border-t border-border mt-2">
          {!isTrash && p.status === "pending" && <span className="text-yellow-500 text-xs font-medium flex items-center gap-1 justify-center"><Clock className="size-3" /> Хүлээгдэж байна</span>}
          {!isTrash && p.status === "approved" && <span className="text-green-500 text-xs font-medium flex items-center gap-1 justify-center"><CheckCircle className="size-3" /> Зөвшөөрсөн</span>}
          {!isTrash && p.status === "rejected" && <span className="text-destructive text-xs font-medium flex items-center gap-1 justify-center"><XCircle className="size-3" /> Цуцлагдсан</span>}
          {isTrash && <span className="text-purple-500 text-xs font-medium flex items-center gap-1 justify-center"><Trash2 className="size-3" /> Хогийн саванд</span>}
        </div>
      </div>
    </div>
  );

  const renderTabContent = (list, emptyIcon, emptyTitle, emptyDesc, isTrash = false) => {
    if (list.length === 0) {
      return (
        <div className="text-center py-20 text-muted-foreground/40">
          <div className="size-20 mx-auto mb-6 flex items-center justify-center opacity-50">{emptyIcon}</div>
          <p className="text-xl font-bold text-muted-foreground">{emptyTitle}</p>
          <p className="text-sm mt-2">{emptyDesc}</p>
        </div>
      );
    }
    return <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{list.map((p) => renderProductCard(p, isTrash))}</div>;
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <h1 className="text-3xl font-bold">Админы самбар</h1>
          <Link href="/profile">
            <button className="flex items-center gap-2 px-6 py-3 bg-muted hover:bg-muted/80 rounded-2xl font-bold transition-all border border-border">
              <User className="size-5" />
              Миний профайл
            </button>
          </Link>
        </div>

        <div className="flex justify-center gap-2 mb-10 flex-wrap bg-muted/30 p-2 rounded-2xl w-fit mx-auto border border-border">
          {[
            { key: "pending", label: "Хүлээгдэж буй", count: pending.length, icon: Clock },
            { key: "approved", label: "Зөвшөөрсөн", count: approved.length, icon: CheckCircle },
            { key: "rejected", label: "Цуцлагдсан", count: rejected.length, icon: XCircle },
            { key: "trash", label: "Хогийн сав", count: deleted.length, icon: Trash2 },
          ].map(({ key, label, count, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${tab === key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <Icon className="size-4" /> {label}
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${tab === key ? "bg-primary-foreground/20" : "bg-muted-foreground/10"}`}>{count}</span>
            </button>
          ))}
        </div>

        {tab === "pending" && renderTabContent(pending, <Clock className="size-12" />, "Шинэ бараа алга", "Бүгдийг шалгасан")}
        {tab === "approved" && renderTabContent(approved, <CheckCircle className="size-12" />, "Бүгд зөвшөөрсөн", "Хэрэглэгчдэд харагдана")}
        {tab === "rejected" && renderTabContent(rejected, <XCircle className="size-12" />, "Цуцлагдсан бараа байхгүй", "Малчин зөвлөмж харна")}
        {tab === "trash" && renderTabContent(deleted, <Trash2 className="size-12" />, "Хогийн сав хоосон", "Сэргээх эсвэл устгах боломжтой", true)}
      </div>
    </div>
  );
}
