"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Package,
    Clock,
    CheckCircle,
    XCircle,
    ArrowLeft,
    AlertCircle,
    Trash2,
    RotateCcw,
    Eye,
    EyeOff,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function MyProductsPage() {
    const { user } = useAuth();
    const [tab, setTab] = useState("active");
    const [activeProducts, setActiveProducts] = useState([]);
    const [trashProducts, setTrashProducts] = useState([]);

    useEffect(() => {
        const load = () => {
            if (!user) return;
            try {
                const all = JSON.parse(localStorage.getItem("products") || "[]");
                const trash = JSON.parse(localStorage.getItem("herderTrash") || "[]");

                // Filter by email if possible, or fallback to name for old/legacy data
                const isMyProduct = (p) => {
                    if (p.herderEmail && p.herderEmail === user.email) return true;
                    // Fallback for old data or if no email saved
                    return p.herderName === user.fullName || p.herderName === "Малчин Баяраа";
                };

                setActiveProducts(all.filter(isMyProduct));
                setTrashProducts(trash.filter(isMyProduct));
            } catch (e) {
                console.error(e);
            }
        };
        load();
        const interval = setInterval(load, 2000);
        return () => clearInterval(interval);
    }, [user]);

    const moveToTrash = (id) => {
        if (!confirm("Хогийн сав руу хаях уу?")) return;
        const all = JSON.parse(localStorage.getItem("products") || "[]");
        const trash = JSON.parse(localStorage.getItem("herderTrash") || "[]");
        const product = all.find(p => p.id === id);
        if (product) {
            const newAll = all.filter(p => p.id !== id);
            trash.push({ ...product, trashedAt: new Date().toISOString() });
            localStorage.setItem("products", JSON.stringify(newAll));
            localStorage.setItem("herderTrash", JSON.stringify(trash));
        }
    };

    const restore = (id) => {
        const trash = JSON.parse(localStorage.getItem("herderTrash") || "[]");
        const product = trash.find(p => p.id === id);
        if (!product) return;
        const newTrash = trash.filter(p => p.id !== id);
        const all = JSON.parse(localStorage.getItem("products") || "[]");
        all.push({ ...product, status: "pending", rejectionReason: null });
        localStorage.setItem("products", JSON.stringify(all));
        localStorage.setItem("herderTrash", JSON.stringify(newTrash));
    };

    const permanentDelete = (id) => {
        if (!confirm("Бүрмөсөн устгах уу?")) return;
        const trash = JSON.parse(localStorage.getItem("herderTrash") || "[]");
        const newTrash = trash.filter(p => p.id !== id);
        localStorage.setItem("herderTrash", JSON.stringify(newTrash));
    };

    const getStatusBadge = (status) => {
        if (status === "approved")
            return <div className="flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full font-bold text-xs shadow-sm"><CheckCircle className="size-3.5" />ЗӨВШӨӨРСӨН</div>;
        if (status === "rejected" || status === "trashed")
            return <div className="flex items-center gap-1.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-3 py-1 rounded-full font-bold text-xs shadow-sm"><XCircle className="size-3.5" />ЦУЦЛАГДСАН</div>;
        return <div className="flex items-center gap-1.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full font-bold text-xs shadow-sm"><Clock className="size-3.5" />ХҮЛЭЭГДЭЖ БАЙНА</div>;
    };

    const renderCard = (p, isTrash = false) => (
        <div key={p.id} className="group bg-card rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-border overflow-hidden flex flex-col">
            <div className="relative h-56 bg-muted overflow-hidden">
                {p.image ? (
                    <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                        <Package className="size-16 opacity-20" />
                    </div>
                )}
                <div className="absolute top-3 left-3">{getStatusBadge(p.status)}</div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <div className="mb-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        {p.animal}
                    </p>
                    <h3 className="text-xl font-bold text-card-foreground line-clamp-1">{p.productType}</h3>
                </div>

                <p className="text-3xl font-black text-primary mb-6">{Number(p.price).toLocaleString()}₮</p>

                {p.rejectionReason && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-900/50 flex items-start gap-3">
                        <AlertCircle className="size-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                            {p.rejectionReason}
                        </p>
                    </div>
                )}

                <div className="mt-auto pt-4 border-t border-border">
                    {isTrash ? (
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => restore(p.id)}
                                className="flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold py-2.5 rounded-xl transition-colors text-sm"
                            >
                                <RotateCcw className="size-4" />
                                Сэргээх
                            </button>
                            <button
                                onClick={() => permanentDelete(p.id)}
                                className="flex items-center justify-center gap-2 bg-destructive/10 hover:bg-destructive/20 text-destructive font-bold py-2.5 rounded-xl transition-colors text-sm"
                            >
                                <Trash2 className="size-4" />
                                Устгах
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => moveToTrash(p.id)}
                            className="w-full flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground font-semibold py-3 rounded-xl transition-all text-sm group-hover:bg-destructive/10 group-hover:text-destructive"
                        >
                            <Trash2 className="size-4" />
                            Хогийн сав руу
                        </button>
                    )}

                    <p className="text-center text-muted-foreground text-xs mt-4">
                        {isTrash ? "Хаягдсан: " : "Оруулсан: "} {new Date(isTrash ? p.trashedAt || p.createdAt : p.createdAt).toLocaleDateString("mn-MN")}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background py-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight text-center md:text-left">
                        Миний оруулсан бараа
                    </h1>
                    <Link href="/herder" className="flex items-center gap-2 text-muted-foreground hover:text-primary font-medium transition-colors px-4 py-2 rounded-lg hover:bg-muted/50">
                        <ArrowLeft className="size-5" /> Буцах
                    </Link>
                </div>

                <div className="flex justify-center md:justify-start gap-2 mb-10 bg-muted/30 p-1.5 rounded-2xl w-fit border border-border mx-auto md:mx-0">
                    <button
                        onClick={() => setTab("active")}
                        className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${tab === "active"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                    >
                        <Eye className="size-5" />
                        Идэвхтэй ({activeProducts.length})
                    </button>
                    <button
                        onClick={() => setTab("trash")}
                        className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${tab === "trash"
                            ? "bg-destructive text-destructive-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                    >
                        <EyeOff className="size-5" />
                        Хогийн сав ({trashProducts.length})
                    </button>
                </div>

                {tab === "active" && activeProducts.length === 0 && (
                    <div className="text-center py-20 bg-card/50 border-2 border-dashed border-border rounded-3xl">
                        <Package className="size-24 mx-auto text-muted-foreground/30 mb-6" />
                        <p className="text-2xl font-bold text-foreground">Бараа оруулаагүй байна</p>
                        <p className="text-muted-foreground mt-2">Та "Буцах" товчийг дараад шинэ бараа оруулаарай.</p>
                    </div>
                )}

                {tab === "trash" && trashProducts.length === 0 && (
                    <div className="text-center py-20 bg-card/50 border-2 border-dashed border-border rounded-3xl">
                        <Trash2 className="size-24 mx-auto text-muted-foreground/30 mb-6" />
                        <p className="text-2xl font-bold text-foreground">Хогийн сав хоосон</p>
                    </div>
                )}

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {(tab === "active" ? activeProducts : trashProducts).map(p => renderCard(p, tab === "trash"))}
                </div>
            </div>
        </div>
    );
}