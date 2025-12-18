"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import {
    Package,
    MapPin,
    Clock,
    CheckCircle2,
    ChevronRight,
    ArrowLeft,
    Truck,
    ShoppingBag,
    Trash2,
    RefreshCcw
} from "lucide-react";

export default function MyOrdersPage() {
    const { user } = useAuth();
    const [view, setView] = useState("active"); // "active" or "trash"
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = () => {
        const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const userOrders = savedOrders.filter(o => o.customerEmail === user?.email);
        setAllOrders(userOrders);
        setLoading(false);
    };

    useEffect(() => {
        if (user) {
            loadOrders();
            const interval = setInterval(loadOrders, 3000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const activeOrders = allOrders.filter(o => !o.isDeleted).reverse();
    const trashedOrders = allOrders.filter(o => o.isDeleted).reverse();
    const currentOrders = view === "active" ? activeOrders : trashedOrders;

    const moveToTrash = (orderId) => {
        const fullList = JSON.parse(localStorage.getItem("orders") || "[]");
        const updated = fullList.map(o => o.orderId === orderId ? { ...o, isDeleted: true } : o);
        localStorage.setItem("orders", JSON.stringify(updated));
        loadOrders();
    };

    const restoreOrder = (orderId) => {
        const fullList = JSON.parse(localStorage.getItem("orders") || "[]");
        const updated = fullList.map(o => o.orderId === orderId ? { ...o, isDeleted: false } : o);
        localStorage.setItem("orders", JSON.stringify(updated));
        loadOrders();
    };

    const permanentlyDeleteOrder = (orderId) => {
        if (!confirm("Та энэ захиалгыг бүрмөсөн устгахдаа итгэлтэй байна уу? Сэргээх боломжгүй.")) return;
        const fullList = JSON.parse(localStorage.getItem("orders") || "[]");
        const updated = fullList.filter(o => o.orderId !== orderId);
        localStorage.setItem("orders", JSON.stringify(updated));
        loadOrders();
    };


    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
            case "Shipped": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
            case "Delivered": return "text-green-500 bg-green-500/10 border-green-500/20";
            default: return "text-muted-foreground bg-muted border-border";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "Pending": return "Хүлээгдэж буй";
            case "Shipped": return "Хүргэлтэнд гарсан";
            case "Delivered": return "Хүрсэн";
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <Link href="/customer" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
                            <ArrowLeft className="size-6" />
                        </Link>
                        <h1 className="text-4xl font-black text-foreground tracking-tight">Захиалгын түүх</h1>
                    </div>

                    <div className="flex bg-muted p-1.5 rounded-2xl border border-border shrink-0">
                        <button
                            onClick={() => setView("active")}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${view === "active" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            <ShoppingBag className="size-4" />
                            Захиалгууд
                            {activeOrders.length > 0 && (
                                <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${view === "active" ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"}`}>
                                    {activeOrders.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setView("trash")}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${view === "trash" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            <Trash2 className="size-4" />
                            Хогийн сав
                            {trashedOrders.length > 0 && (
                                <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${view === "trash" ? "bg-destructive text-white" : "bg-muted-foreground/20 text-muted-foreground"}`}>
                                    {trashedOrders.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {currentOrders.length === 0 ? (
                    <div className="text-center py-24 bg-card border border-border border-dashed border-2 rounded-[3.5rem] opacity-60">
                        {view === "active" ? (
                            <>
                                <ShoppingBag className="size-20 mx-auto text-muted-foreground/20 mb-6" />
                                <h2 className="text-2xl font-bold text-muted-foreground mb-4">Танд одоогоор захиалга алга</h2>
                                <Link href="/customer" className="text-primary font-bold hover:underline">
                                    Бараанууд харах
                                </Link>
                            </>
                        ) : (
                            <>
                                <Trash2 className="size-20 mx-auto text-muted-foreground/20 mb-6" />
                                <h2 className="text-2xl font-bold text-muted-foreground mb-4">Хогийн сав хоосон байна</h2>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="space-y-8">
                        {currentOrders.map((order) => (
                            <div key={order.orderId} className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                {/* Order Header */}
                                <div className="p-6 sm:p-8 border-b border-border bg-muted/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Захиалгын дугаар</span>
                                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-black uppercase">Active</span>
                                        </div>
                                        <p className="text-xl font-black text-foreground font-mono">{order.orderId}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-left sm:text-right">
                                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Огноо</p>
                                            <p className="text-md font-bold text-foreground">{order.timestamp}</p>
                                        </div>

                                        {view === "active" ? (
                                            order.items.every(item => item.status === "Delivered") && (
                                                <button
                                                    onClick={() => moveToTrash(order.orderId)}
                                                    className="p-2.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm"
                                                    title="Хогийн сав руу хийх"
                                                >
                                                    <Trash2 className="size-5" />
                                                </button>
                                            )
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => restoreOrder(order.orderId)}
                                                    className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                                                    title="Сэргээх"
                                                >
                                                    <RefreshCcw className="size-5" />
                                                </button>
                                                <button
                                                    onClick={() => permanentlyDeleteOrder(order.orderId)}
                                                    className="p-2.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm"
                                                    title="Бүрмөсөн устгах"
                                                >
                                                    <Trash2 className="size-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="p-6 sm:p-8 space-y-8">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex flex-col md:flex-row gap-6">
                                            {/* Product Info */}
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="size-20 rounded-2xl overflow-hidden border border-border bg-muted flex-shrink-0">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.productType} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="size-8 text-muted-foreground/30" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-foreground leading-tight">{item.productType}</h3>
                                                    <p className="text-sm text-muted-foreground mb-2">{item.herderName}</p>
                                                    <p className="text-lg font-black text-primary">{item.price.toLocaleString()}₮</p>
                                                </div>
                                            </div>

                                            {/* Tracking / Status */}
                                            <div className="flex-1 bg-muted/20 rounded-2xl p-4 flex flex-col justify-center border border-border/50">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className={`px-3 py-1 rounded-full text-[10px] font-black border ${getStatusColor(item.status)}`}>
                                                        {getStatusText(item.status)}
                                                    </div>
                                                    {item.status === "Shipped" && (
                                                        <div className="flex items-center gap-1.5 text-blue-500 animate-pulse">
                                                            <Truck className="size-3.5" />
                                                            <span className="text-[10px] font-black uppercase">Замдаа яваа</span>
                                                        </div>
                                                    )}
                                                    {item.status === "Delivered" && (
                                                        <div className="flex items-center gap-1.5 text-green-500">
                                                            <CheckCircle2 className="size-3.5" />
                                                            <span className="text-[10px] font-black uppercase">Хүрсэн</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex items-start gap-2.5">
                                                        <MapPin className="size-4 text-primary mt-0.5" />
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider leading-none mb-1">Одоогийн байршил</p>
                                                            <p className="text-sm font-bold text-foreground">{item.tracking || "Мэдээлэл байхгүй"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2.5">
                                                        <Clock className="size-4 text-primary mt-0.5" />
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider leading-none mb-1">Сүүлд шинэчлэгдсэн</p>
                                                            <p className="text-sm font-bold text-foreground">{item.updatedAt || order.timestamp}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="p-6 sm:p-8 bg-muted/10 border-t border-border flex justify-between items-center">
                                    <p className="text-sm font-bold text-muted-foreground">Нийт {order.totalItems} бараа</p>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-foreground">{order.totalAmount.toLocaleString()}₮</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
