// app/cart/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Package, Trash2, User, Plus, Minus, X, CheckCircle, Banknote, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function CartPage() {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [orderConfirmed, setOrderConfirmed] = useState(false);

    // ==== localStorage ачааллах + ижил барааг нэгтгэх ====
    useEffect(() => {
        try {
            const saved = localStorage.getItem("cart");
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    const mergedMap = new Map();

                    parsed.forEach((item) => {
                        const key = `${item.productType}-${item.herderName}-${item.price}-${item.image || "noimg"}`;
                        if (mergedMap.has(key)) {
                            const existing = mergedMap.get(key);
                            existing.qty = (existing.qty || 1) + (item.qty || 1);
                        } else {
                            mergedMap.set(key, { ...item, qty: item.qty || 1 });
                        }
                    });

                    const mergedCart = Array.from(mergedMap.values());
                    setCart(mergedCart);
                    localStorage.setItem("cart", JSON.stringify(mergedCart));
                }
            }
        } catch (e) {
            console.error("Cart load error:", e);
        }
    }, []);

    const getId = (item) =>
        `${item.productType}-${item.herderName}-${item.price}-${item.image || "noimg"}`;

    const removeFromCart = (id) => {
        setCart((prev) => {
            const updated = prev.filter((i) => getId(i) !== id);
            localStorage.setItem("cart", JSON.stringify(updated));
            return updated;
        });
    };

    const updateQty = (id, delta) => {
        setCart((prev) => {
            const updated = prev
                .map((item) => {
                    if (getId(item) === id) {
                        const newQty = (item.qty || 1) + delta;
                        return newQty <= 0 ? null : { ...item, qty: newQty };
                    }
                    return item;
                })
                .filter(Boolean);
            localStorage.setItem("cart", JSON.stringify(updated));
            return updated;
        });
    };

    const totalItems = cart.reduce((sum, i) => sum + (i.qty || 1), 0);
    const totalAmount = cart.reduce((sum, i) => sum + Number(i.price || 0) * (i.qty || 1), 0);

    // Захиалга баталгаажуулах → модал нээх
    const handleConfirmOrder = () => {
        setShowPaymentModal(true);
    };

    // Төлбөр төлсөн гэдгийг баталгаажуулах (энэ жишээнд симуляци)
    const handlePaymentDone = () => {
        const orderId = `ORD-${Date.now().toString().slice(-6)}`;
        const timestamp = new Date().toLocaleString("mn-MN");

        // Save order details for success page
        const orderData = {
            orderId,
            totalAmount,
            totalItems,
            items: cart.map(i => ({
                ...i,
                total: i.price * i.qty,
                status: "Pending", // Initial status for each item
                tracking: "Малчин хүлээж авч байна" // Initial tracking info
            })),
            timestamp,
            customerEmail: user?.email || "guest@example.com",
            status: "Processing" // Global order status
        };

        // 1. Save last order for immediate success page
        localStorage.setItem("lastOrder", JSON.stringify(orderData));

        // 2. Append to persistent orders list
        const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        existingOrders.push(orderData);
        localStorage.setItem("orders", JSON.stringify(existingOrders));

        setOrderConfirmed(true);
        // Сагсыг хоослох
        setCart([]);
        localStorage.removeItem("cart");

        // 3 секундны дараа модалыг хаах ба шилжүүлэх
        setTimeout(() => {
            setShowPaymentModal(false);
            setOrderConfirmed(false);
            window.location.href = "/order-success";
        }, 3000);
    };

    if (cart.length === 0 && !showPaymentModal) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-6">
                <div className="text-center space-y-6 max-w-md w-full bg-card border border-border rounded-3xl p-10 shadow-xl">
                    <div className="size-24 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Package className="w-12 h-12 text-muted-foreground/50" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Сагс хоосон байна</h1>
                    <p className="text-muted-foreground">Та хараахан бараа сонгоогүй байна.</p>
                    <Link href="/customer" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-primary/20 w-full justify-center">
                        <ArrowLeft className="size-5" />
                        Бүтээгдэхүүн сонгох
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-40">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
                <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/customer" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
                            <ArrowLeft className="size-6 text-foreground" />
                        </Link>
                        <h1 className="text-3xl font-bold flex items-center gap-3 text-foreground">
                            <ShoppingCart className="w-8 h-8 text-primary" />
                            Миний сагс <span className="text-muted-foreground text-2xl font-medium">({totalItems})</span>
                        </h1>
                    </div>
                </div>
            </div>

            {/* Гол контент */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Барааны жагсаалт */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => {
                            const id = getId(item);
                            const qty = item.qty || 1;
                            const itemTotal = Number(item.price || 0) * qty;

                            return (
                                <div key={id} className="group bg-card border border-border rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm hover:shadow-md transition-all">
                                    <div className="w-full sm:w-28 h-28 shrink-0 rounded-xl overflow-hidden border border-border bg-muted">
                                        {item.image ? (
                                            <img src={item.image} alt={item.productType} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-10 h-10 text-muted-foreground/30" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 w-full">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                                    {item.animal || "Бараа"}
                                                </p>
                                                <h3 className="text-xl font-bold text-foreground mb-1">{item.productType}</h3>
                                                <p className="text-muted-foreground text-sm flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-lg w-fit">
                                                    <User className="w-3.5 h-3.5" /> {item.herderName || "Малчин"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <p className="text-lg text-primary font-bold">
                                                {Number(item.price || 0).toLocaleString()}₮
                                            </p>
                                            <div className="text-right sm:hidden">
                                                <span className="text-sm text-muted-foreground">Нийт:</span>
                                                <p className="font-bold text-foreground">{itemTotal.toLocaleString()}₮</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 sm:gap-6 border-t sm:border-t-0 border-border pt-4 sm:pt-0 mt-2 sm:mt-0">
                                        <div className="flex items-center bg-muted/50 rounded-xl overflow-hidden border border-border">
                                            <button onClick={() => updateQty(id, -1)} className="w-10 h-10 hover:bg-muted flex items-center justify-center transition-colors">
                                                <Minus className="w-4 h-4 text-foreground" />
                                            </button>
                                            <div className="px-3 font-bold text-lg text-foreground min-w-[2rem] text-center">{qty}</div>
                                            <button onClick={() => updateQty(id, +1)} className="w-10 h-10 hover:bg-muted flex items-center justify-center transition-colors">
                                                <Plus className="w-4 h-4 text-foreground" />
                                            </button>
                                        </div>

                                        <div className="hidden sm:block text-right">
                                            <p className="text-xl font-bold text-foreground">{itemTotal.toLocaleString()}₮</p>
                                        </div>

                                        <button onClick={() => removeFromCart(id)} className="text-destructive hover:text-destructive/80 text-sm font-semibold flex items-center gap-1.5 transition-colors bg-destructive/5 px-3 py-1.5 rounded-lg hover:bg-destructive/10">
                                            <Trash2 className="w-4 h-4" /> <span className="sm:hidden">Устгах</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Захиалгын хураангуй */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 bg-card border border-border rounded-3xl p-8 shadow-xl">
                            <h2 className="text-2xl font-bold mb-6 text-foreground">Захиалгын хураангуй</h2>
                            <div className="space-y-4 text-base">
                                <div className="flex justify-between items-center text-muted-foreground">
                                    <span>Нийт бараа:</span>
                                    <span className="font-semibold text-foreground">{totalItems} ширхэг</span>
                                </div>
                                <div className="border-t border-dashed border-border py-4 my-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-lg font-bold text-foreground">Нийт дүн:</span>
                                        <span className="text-3xl font-black text-primary">
                                            {totalAmount.toLocaleString()}₮
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button
                                    onClick={handleConfirmOrder}
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-5 rounded-2xl shadow-lg hover:shadow-primary/20 transform transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    <Banknote className="w-6 h-6" />
                                    Захиалга баталгаажуулах
                                </button>
                                <p className="text-center text-xs text-muted-foreground mt-4 px-4">
                                    Дараагийн алхамд банкны мэдээлэл гарч ирнэ
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ТӨЛБӨРИЙН МОДАЛ */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl border border-border p-8 relative overflow-hidden">
                        {/* Decorative background */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

                        {!orderConfirmed && (
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        )}

                        {!orderConfirmed ? (
                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold text-center text-foreground mb-8">
                                    Төлбөрийн мэдээлэл
                                </h2>

                                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center mb-8">
                                    <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide mb-1">Төлөх дүн</p>
                                    <p className="text-4xl font-black text-primary">
                                        {totalAmount.toLocaleString()} ₮
                                    </p>
                                </div>

                                <div className="space-y-4 text-base mb-8">
                                    <div className="flex justify-between items-center p-4 bg-muted/30 rounded-xl border border-border">
                                        <span className="text-muted-foreground">Банк</span>
                                        <span className="font-bold text-foreground">Хаан Банк</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-muted/30 rounded-xl border border-border">
                                        <span className="text-muted-foreground">Данс</span>
                                        <span className="font-mono font-bold text-foreground text-lg">5023 4567 8901</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-muted/30 rounded-xl border border-border">
                                        <span className="text-muted-foreground">Хүлээн авагч</span>
                                        <span className="font-bold text-foreground text-right">Малчны Холбоо ХХК</span>
                                    </div>

                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-muted-foreground mb-2">Гүйлгээний утга (Төлбөр хийхдээ бичнэ үү)</label>
                                        <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-xl text-center">
                                            <p className="text-2xl font-black text-secondary-foreground font-mono tracking-widest select-all">
                                                ZAKHIA{Date.now().toString().slice(-6)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePaymentDone}
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl py-5 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    <CheckCircle className="w-6 h-6" />
                                    Би төлбөр төлсөн
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-12 relative z-10">
                                <div className="size-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-3xl font-bold text-foreground mb-4">
                                    Амжилттай!
                                </h3>
                                <p className="text-lg text-muted-foreground mb-8">
                                    Таны захиалгыг хүлээн авлаа.
                                </p>
                                <div className="animate-pulse text-sm text-primary font-medium">
                                    Амжилтын хуудас руу шилжүүлж байна...
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}