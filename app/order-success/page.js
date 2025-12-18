// app/order-success/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Package, ArrowLeft, Home, ShoppingBag, Receipt } from "lucide-react";

export default function OrderSuccessPage() {
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem("lastOrder");
        if (saved) {
            setOrderDetails(JSON.parse(saved));
        }
    }, []);

    // Хэрвээ захиалга байхгүй бол буцаагаад нүүр рүү илгээнэ
    if (!orderDetails) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="text-center max-w-md w-full bg-card border border-border rounded-3xl p-10 shadow-xl">
                    <div className="size-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-4">Захиалга олдсонгүй</h1>
                    <p className="text-muted-foreground mb-8">Та одоогоор захиалга хийгээгүй байна.</p>
                    <Link
                        href="/customer"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 px-8 py-3 rounded-xl text-lg font-bold text-primary-foreground transition-colors w-full justify-center"
                    >
                        <Home className="w-5 h-5" />
                        Нүүр хуудас руу буцах
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-12 px-6">
            <div className="max-w-3xl mx-auto">

                {/* Амжилтын толгой */}
                <div className="text-center mb-12 animate-in slide-in-from-bottom-4 fade-in duration-700">
                    <div className="size-28 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-900/5">
                        <CheckCircle className="w-14 h-14 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight">
                        Амжилттай захиаллаа!
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                        Таны захиалга хүлээн авлаа. Удалгүй админ тантай утсаар холбогдоно.
                    </p>
                </div>

                {/* Захиалгын дэлгэрэнгүй карт */}
                <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl overflow-hidden relative animate-in slide-in-from-bottom-8 fade-in duration-700 delay-100">
                    {/* Decorative bg */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                    {/* Захиалгын дугаар + Огноо */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-border/50 relative z-10">
                        <div>
                            <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Захиалгын дугаар</p>
                            <p className="text-2xl font-black text-primary tracking-wide font-mono">
                                {orderDetails.orderId}
                            </p>
                        </div>
                        <div className="text-left sm:text-right">
                            <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Огноо</p>
                            <p className="text-lg font-semibold text-foreground">{orderDetails.timestamp}</p>
                        </div>
                    </div>

                    {/* Барааны жагсаалт */}
                    <div className="space-y-4 mb-8 max-h-96 overflow-y-auto pr-2 relative z-10">
                        {orderDetails.items.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-4 py-3 border-b border-border/30 last:border-0"
                            >
                                {/* Зураг */}
                                <div className="size-16 shrink-0 rounded-xl overflow-hidden border border-border bg-muted">
                                    {item.image ? (
                                        <img src={item.image} alt={item.productType} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package className="w-8 h-8 text-muted-foreground/30" />
                                        </div>
                                    )}
                                </div>

                                {/* Мэдээлэл */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-foreground">{item.productType}</h3>
                                    <p className="text-sm text-muted-foreground">{item.herderName}</p>
                                </div>

                                {/* Үнэ */}
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground mb-0.5">
                                        {item.price.toLocaleString()}₮ × {item.qty}
                                    </p>
                                    <p className="text-lg font-bold text-foreground">
                                        {item.total.toLocaleString()}₮
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Нийт дүн */}
                    <div className="bg-muted/30 -mx-8 -mb-8 p-8 border-t border-border relative z-10">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-lg font-bold text-muted-foreground mb-1">Нийт бараа</p>
                                <p className="text-2xl font-bold text-foreground">{orderDetails.totalItems} ширхэг</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-muted-foreground mb-1">Нийт дүн</p>
                                <p className="text-4xl font-black text-primary">
                                    {orderDetails.totalAmount.toLocaleString()}₮
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Товчнууд */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200">
                    <Link
                        href="/customer"
                        className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 px-8 py-4 rounded-2xl text-lg font-bold text-primary-foreground transition-all shadow-lg hover:shadow-primary/20 hover:-translate-y-1"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Дахин худалдан авалт хийх
                    </Link>

                    <Link
                        href="/customer/orders"
                        className="inline-flex items-center justify-center gap-2 bg-card hover:bg-muted border border-border px-8 py-4 rounded-2xl text-lg font-bold text-foreground transition-colors"
                    >
                        <Package className="w-5 h-5" />
                        Миний захиалгууд
                    </Link>
                </div>
            </div>
        </div>
    );
}