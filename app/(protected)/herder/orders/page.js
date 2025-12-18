"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import {
    Package,
    MapPin,
    Truck,
    CheckCircle2,
    ArrowLeft,
    User,
    Phone,
    Save,
    Clock,
    Trash2,
    RefreshCcw
} from "lucide-react";

export default function HerderOrdersPage() {
    const { user } = useAuth();
    const [view, setView] = useState("active"); // "active" or "trash"
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [clickedOrders, setClickedOrders] = useState([]);

    const loadOrders = () => {
        const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const herderEmail = user?.email;

        // Filter orders that contain products from this herder
        const herderOrders = savedOrders.map(order => {
            const myItems = order.items.filter(item => {
                const isMine = item.herderEmail === herderEmail || item.herderName === user?.fullName;
                const matchesView = view === "trash" ? item.herderDeleted : !item.herderDeleted;
                return isMine && matchesView && !item.herderPermanentlyDeleted;
            });

            if (myItems.length > 0) {
                return { ...order, myItems };
            }
            return null;
        }).filter(Boolean);

        setOrders(herderOrders.reverse());
        setLoading(false);

        // Load "clicked" state for visual highlights
        if (herderEmail) {
            const clickedKey = `clickedOrders_${herderEmail}`;
            setClickedOrders(JSON.parse(localStorage.getItem(clickedKey) || "[]"));
        }
    };

    useEffect(() => {
        if (user) {
            loadOrders();
            const interval = setInterval(loadOrders, 3000);
            return () => clearInterval(interval);
        }
    }, [user, view]); // Reload when view changes or periodically

    const updateItemStatus = (orderId, itemIdx, newStatus, newTracking) => {
        setUpdatingId(`${orderId}-${itemIdx}`);
        const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");

        const orderIdx = allOrders.findIndex(o => o.orderId === orderId);
        if (orderIdx > -1) {
            const item = allOrders[orderIdx].items[itemIdx];
            if (item) {
                item.status = newStatus;
                item.tracking = newTracking;
                item.updatedAt = new Date().toLocaleString("mn-MN");
            }
            localStorage.setItem("orders", JSON.stringify(allOrders));
            loadOrders();
        }
        setTimeout(() => setUpdatingId(null), 500);
    };

    const toggleItemTrash = (orderId, itemIdx, herderDeleted) => {
        const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const orderIdx = allOrders.findIndex(o => o.orderId === orderId);

        if (orderIdx > -1) {
            const item = allOrders[orderIdx].items[itemIdx];
            if (item) {
                item.herderDeleted = herderDeleted;
                item.updatedAt = new Date().toLocaleString("mn-MN");
            }
            localStorage.setItem("orders", JSON.stringify(allOrders));
            loadOrders();
        }
    };

    const permanentlyDeleteItem = (orderId, itemIdx) => {
        if (!confirm("Та энэ бичлэгийг бүрмөсөн устгахдаа итгэлтэй байна уу?")) return;

        const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const orderIdx = allOrders.findIndex(o => o.orderId === orderId);

        if (orderIdx > -1) {
            // Instead of true deletion which would mess up indices, 
            // we could mark it with a special flag or just filter it out further.
            // For this app, let's just use a 'herderPermanentlyDeleted' flag
            const item = allOrders[orderIdx].items[itemIdx];
            if (item) {
                item.herderPermanentlyDeleted = true;
            }
            localStorage.setItem("orders", JSON.stringify(allOrders));
            loadOrders();
        }
    };

    const markAsClicked = (orderId) => {
        if (clickedOrders.includes(orderId)) return;
        const newClicked = [...clickedOrders, orderId];
        setClickedOrders(newClicked);
        if (user?.email) {
            localStorage.setItem(`clickedOrders_${user.email}`, JSON.stringify(newClicked));
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
            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div className="flex items-center gap-4">
                        <Link href="/herder" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
                            <ArrowLeft className="size-6" />
                        </Link>
                        <h1 className="text-4xl font-black text-foreground tracking-tight">Захиалга хянах</h1>
                    </div>

                    <div className="flex bg-muted p-1.5 rounded-2xl border border-border shrink-0">
                        <button
                            onClick={() => setView("active")}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${view === "active" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            <Package className="size-4" />
                            Идэвхтэй
                        </button>
                        <button
                            onClick={() => setView("trash")}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${view === "trash" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            <Trash2 className="size-4" />
                            Хогийн сав
                        </button>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-24 bg-card border border-border dashed border-2 rounded-[3.5rem] opacity-60">
                        {view === "active" ? (
                            <>
                                <Package className="size-20 mx-auto text-muted-foreground/20 mb-6" />
                                <h2 className="text-2xl font-bold text-muted-foreground mb-4">Одоогоор танд захиалга ирээгүй байна</h2>
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
                        {orders.map((order) => {
                            const isNew = !clickedOrders.includes(order.orderId);

                            return (
                                <div
                                    key={order.orderId}
                                    onClick={() => markAsClicked(order.orderId)}
                                    className={`bg-card border-2 rounded-[2.5rem] overflow-hidden shadow-sm transition-all duration-500 cursor-pointer ${isNew
                                        ? "border-primary shadow-[0_0_40px_-15px_rgba(var(--primary),0.3)] scale-[1.01]"
                                        : "border-border"
                                        }`}
                                >
                                    <div className="p-6 sm:p-8 border-b border-border bg-muted/20 flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex gap-10">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Захиалга #</p>
                                                <p className="text-lg font-black font-mono text-primary">{order.orderId}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Огноо</p>
                                                <p className="text-lg font-bold text-foreground">{order.timestamp}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Хэрэглэгч</p>
                                                <p className="font-bold text-foreground">{order.customerEmail}</p>
                                            </div>
                                            <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                                <User className="size-5" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 sm:p-8 space-y-8">
                                        {order.myItems.map((item) => {
                                            const actualIdx = order.items.findIndex(i => i === item);

                                            return (
                                                <div key={actualIdx} className="flex flex-col lg:flex-row gap-8 items-start lg:items-center border-b border-border/50 last:border-0 pb-8 last:pb-0">
                                                    {/* Item Info */}
                                                    <div className="flex items-center gap-4 w-full lg:w-1/3">
                                                        <div className="size-20 rounded-2xl overflow-hidden border border-border bg-muted shrink-0">
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
                                                            <p className="text-sm text-muted-foreground mb-1">{item.animal}</p>
                                                            <p className="text-lg font-black text-primary">{item.price.toLocaleString()}₮ × {item.qty}</p>
                                                        </div>
                                                    </div>

                                                    {/* Management */}
                                                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {view === "active" ? (
                                                            <>
                                                                {/* Status Management */}
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black uppercase text-muted-foreground px-2">Төлөв өөрчлөх</label>
                                                                    <div className="grid grid-cols-3 gap-2 bg-muted/50 p-1.5 rounded-2xl border border-border">
                                                                        {[
                                                                            { id: "Pending", label: "Хүлээх", icon: Clock, color: "bg-amber-500", shadow: "shadow-amber-500/25" },
                                                                            { id: "Shipped", label: "Илгээв", icon: Truck, color: "bg-blue-600", shadow: "shadow-blue-600/25" },
                                                                            { id: "Delivered", label: "Хүрэв", icon: CheckCircle2, color: "bg-emerald-600", shadow: "shadow-emerald-600/25" }
                                                                        ].map((s) => {
                                                                            const Icon = s.icon;
                                                                            const isActive = item.status === s.id;
                                                                            return (
                                                                                <button
                                                                                    key={s.id}
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        updateItemStatus(order.orderId, actualIdx, s.id, item.tracking);
                                                                                    }}
                                                                                    className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl transition-all duration-300 ${isActive
                                                                                        ? `${s.color} text-white shadow-lg ${s.shadow} scale-[1.05] z-10`
                                                                                        : "text-muted-foreground hover:bg-background hover:text-foreground"
                                                                                        }`}
                                                                                >
                                                                                    <Icon className={`size-4 sm:size-5 ${isActive ? "scale-110" : "opacity-60"}`} />
                                                                                    <span className="text-[9px] sm:text-[10px] font-black tracking-tight leading-none text-center px-1 uppercase">{s.label}</span>
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>

                                                                {/* Tracking Input */}
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black uppercase text-muted-foreground px-2">Одоогийн байршил</label>
                                                                    <div className="relative group">
                                                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-primary group-focus-within:scale-110 transition-transform" />
                                                                        <input
                                                                            type="text"
                                                                            defaultValue={item.tracking}
                                                                            onBlur={(e) => updateItemStatus(order.orderId, actualIdx, item.status, e.target.value)}
                                                                            placeholder="Жишээ: Улаанбаатар хотод..."
                                                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all font-bold text-sm"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            /* Trash Info */
                                                            <div className="col-span-1 md:col-span-2 flex items-center bg-muted/30 rounded-2xl px-6 py-4 border border-border border-dashed">
                                                                <div className="flex items-center gap-3">
                                                                    <Trash2 className="size-5 text-muted-foreground/40" />
                                                                    <div>
                                                                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Мэдэгдэл</p>
                                                                        <p className="text-sm font-bold text-muted-foreground italic">Энэ бараа хогийн саванд байна</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Actions & Info */}
                                                        <div className="flex items-center gap-4 bg-primary/5 rounded-2xl px-4 py-3 border border-primary/10">
                                                            {updatingId === `${order.orderId}-${actualIdx}` ? (
                                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent shrink-0"></div>
                                                            ) : (
                                                                <Clock className="size-4 text-primary shrink-0" />
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-[10px] font-black uppercase text-muted-foreground leading-none mb-1 truncate">Шинэчлэгдсэн</p>
                                                                <p className="text-[11px] font-bold text-foreground truncate">{item.updatedAt || "Шинэ захиалга"}</p>
                                                            </div>

                                                            {view === "active" ? (
                                                                item.status === "Delivered" && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            toggleItemTrash(order.orderId, actualIdx, true);
                                                                        }}
                                                                        className="p-2.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm shrink-0"
                                                                        title="Устгах"
                                                                    >
                                                                        <Trash2 className="size-4" />
                                                                    </button>
                                                                )
                                                            ) : (
                                                                <div className="flex gap-2 shrink-0">
                                                                    <button
                                                                        onClick={() => toggleItemTrash(order.orderId, actualIdx, false)}
                                                                        className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                                                                        title="Сэргээх"
                                                                    >
                                                                        <RefreshCcw className="size-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => permanentlyDeleteItem(order.orderId, actualIdx)}
                                                                        className="p-2.5 rounded-xl bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                                        title="Бүрмөсөн устгах"
                                                                    >
                                                                        <Trash2 className="size-4" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
