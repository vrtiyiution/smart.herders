"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function EditProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        if (!id) return;
        const all = JSON.parse(localStorage.getItem("products") || "[]");
        const found = all.find(p => p.id === id);
        if (found) {
            setProduct(found);
        } else {
            alert("Пост олдсонгүй!");
            router.push("/herder/my-products");
        }
    }, [id, router]);

    const handleSubmit = () => {
        if (!product?.price || !product?.desc || !product?.image) {
            alert("Бүх талбарыг бөглөнө үү!");
            return;
        }

        const all = JSON.parse(localStorage.getItem("products") || "[]");
        const updated = all.map(p =>
            p.id === id
                ? { ...p, price: Number(product.price), desc: product.desc, image: product.image, status: "pending", rejectionReason: null }
                : p
        );

        localStorage.setItem("products", JSON.stringify(updated));
        alert("Амжилттай засварлаж дахин илгээлээ!");
        router.push("/herder/my-products");
    };

    if (!product) return <div className="text-center py-32 text-2xl">Ачаалж байна...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12">
            <div className="max-w-4xl mx-auto px-6">
                <Link href="/herder/my-products" className="flex items-center gap-3 text-cyan-400 hover:text-cyan-300 text-xl mb-8 inline-block">
                    <ArrowLeft className="w-6 h-6" /> Буцах
                </Link>

                <h1 className="text-5xl font-black text-center mb-10">Пост засварлах</h1>

                {product.rejectionReason && (
                    <div className="mb-10 p-8 bg-red-900/50 border-l-8 border-red-500 rounded-r-2xl shadow-2xl">
                        <p className="text-red-300 font-bold text-2xl flex items-start gap-4">
                            <AlertCircle className="w-10 h-10 flex-shrink-0" />
                            <span>Админы зөвлөмж: {product.rejectionReason}</span>
                        </p>
                    </div>
                )}

                <div className="bg-gray-800 rounded-3xl shadow-2xl p-10 space-y-10">
                    <div>
                        <label className="block text-2xl font-bold text-cyan-400 mb-4">Үнэ (₮)</label>
                        <input
                            type="number"
                            value={product.price || ""}
                            onChange={(e) => setProduct({ ...product, price: e.target.value })}
                            className="w-full px-8 py-6 rounded-2xl bg-gray-700 text-white text-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-2xl font-bold text-cyan-400 mb-4">Тайлбар</label>
                        <textarea
                            value={product.desc || ""}
                            onChange={(e) => setProduct({ ...product, desc: e.target.value })}
                            rows={8}
                            className="w-full px-8 py-6 rounded-2xl bg-gray-700 text-white text-xl resize-none focus:outline-none focus:ring-4 focus:ring-cyan-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-2xl font-bold text-cyan-400 mb-4">Зураг</label>
                        {product.image ? (
                            <img src={product.image} alt="Зураг" className="w-full max-h-96 object-cover rounded-2xl shadow-2xl" />
                        ) : (
                            <div className="bg-gray-700 border-4 border-dashed border-gray-600 rounded-2xl h-80 flex items-center justify-center text-gray-400 text-2xl">
                                Зураг байхгүй
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-4xl py-8 rounded-3xl shadow-3xl transform hover:scale-105 transition-all duration-300"
                    >
                        ДАХИН ИЛГЭЭХ
                    </button>
                </div>
            </div>
        </div>
    );
}