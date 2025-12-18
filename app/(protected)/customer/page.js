"use client";

import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Package, User, ExternalLink } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "Бүгд" },
  { id: "meat", label: "Мах, махан бүтээгдэхүүн" },
  { id: "dairy", label: "Сүү, цагаан идээ" },
  { id: "hides", label: "Арьс, шир, ноолуур" },
  { id: "live", label: "Амьд мал" },
  { id: "other", label: "Бусад" },
];

const SEED_PRODUCTS = [
  {
    id: "seed-1",
    title: "Үхрийн цул мах - 1-р зэрэглэл",
    productType: "Үхрийн цул мах",
    animal: "Үхэр",
    price: 18000,
    herderName: "Малчин Бат",
    image: "/beef-meat.png",
    category: "meat",
    status: "approved",
  },
  {
    id: "seed-2",
    title: "Шинэ өрөм (1кг)",
    productType: "Өрөм",
    animal: "Үнээ",
    price: 35000,
    herderName: "Малчин Туяа",
    image: "/orom.jpg",
    category: "dairy",
    status: "approved",
  },
  {
    id: "seed-3",
    title: "Хонины гуяны мах",
    productType: "Хонины мах",
    animal: "Хонь",
    price: 14500,
    herderName: "Малчин Дорж",
    image: "/khoniny-makh.jpg",
    category: "meat",
    status: "approved",
  },
  {
    id: "seed-4",
    title: "Ямааны ноолуур (Цагаан)",
    productType: "Ноолуур",
    animal: "Ямаа",
    price: 120000,
    herderName: "Малчин Болд",
    image: "/cashmere.jpg",
    category: "hides",
    status: "approved",
  },
  {
    id: "seed-5",
    title: "Ааруул (Чихэртэй)",
    productType: "Ааруул",
    animal: "Үнээ",
    price: 25000,
    herderName: "Малчин Цэцэг",
    image: "/aaruul.jpg",
    category: "dairy",
    status: "approved",
  },
  {
    id: "seed-6",
    title: "Айраг (Булган)",
    productType: "Айраг",
    animal: "Гүү",
    price: 8000,
    herderName: "Малчин Ганзориг",
    image: "/airag.jpg",
    category: "dairy",
    status: "approved",
  }
];

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  // Load products + cart
  const loadData = () => {
    const localProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const approvedLocal = localProducts.filter((p) => p.status === "approved");

    // Merge Seed + Local
    // Map local products to categories based on simple logic if missing
    const normalizedLocal = approvedLocal.map(p => ({
      ...p,
      category: p.category || detectCategory(p)
    }));

    // Combine: Seed products first, then local (or vice versa based on preference)
    const all = [...SEED_PRODUCTS, ...normalizedLocal];
    setProducts(all);

    // Apply filter
    filterProducts(all, activeCategory);

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const detectCategory = (product) => {
    // Simple heuristic for legacy/local data
    const type = (product.productType || "").toLowerCase();
    const title = (product.title || "").toLowerCase();

    if (type.includes("мах") || type.includes("гэдэс") || title.includes("мах")) return "meat";
    if (type.includes("сүү") || type.includes("тараг") || type.includes("ааруул") || type.includes("өрөм") || type.includes("бяслаг") || type.includes("айраг")) return "dairy";
    if (type.includes("ноос") || type.includes("ноолуур") || type.includes("арьс") || type.includes("шир")) return "hides";
    if (type.includes("амьд") || type.includes("мал")) return "live";
    return "other";
  }

  const filterProducts = (allProds, category) => {
    if (category === "all") {
      setFilteredProducts(allProds);
    } else {
      setFilteredProducts(allProds.filter(p => p.category === category));
    }
  };

  useEffect(() => {
    loadData();
    // Refresh every 3 seconds for real-time updates (admin approvals, herder deletions)
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Update filter when category changes
  useEffect(() => {
    filterProducts(products, activeCategory);
  }, [activeCategory, products]);


  // Helper to format name (if it's an email, show only part before @)
  const formatHerderName = (name) => {
    if (!name) return "Малчин";
    if (name.includes("@")) {
      return name.split("@")[0];
    }
    return name;
  };

  // Add to cart with Toast
  const addToCart = (product) => {
    const newCart = [...cart, { ...product, qty: 1 }];
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));

    // Show Toast
    setToast(`${product.productType || product.title} сагсанд нэмэгдлээ`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-background py-12 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-6 py-3 rounded-full shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-3">
          <div className="bg-green-500 rounded-full p-1">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="font-medium">{toast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Бүтээгдэхүүнүүд
          </h1>

          <div className="flex items-center gap-4">
            <Link
              href="/customer/orders"
              className="flex items-center gap-3 bg-secondary/10 hover:bg-secondary/20 text-secondary-foreground border border-secondary/20 px-6 py-4 rounded-2xl transition-all"
            >
              <Package className="size-5" />
              <span className="font-bold">Захиалгууд</span>
            </Link>

            <Link
              href="/cart"
              className="flex items-center gap-4 bg-primary text-primary-foreground px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all transform hover:-translate-y-1 active:scale-95"
            >
              <ShoppingCart className="size-6" />
              <span className="text-xl font-bold">Сагс: {cart.length}</span>
            </Link>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-3 no-scrollbar mask-gradient">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeCategory === cat.id
                ? "bg-foreground text-background shadow-lg scale-105"
                : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-32 bg-card border border-border dashed border-2 rounded-3xl animate-in fade-in duration-500">
            <Package className="size-24 mx-auto text-muted-foreground/30 mb-6" />
            <p className="text-2xl font-bold text-muted-foreground">
              Энэ төрөлд одоогоор бараа алга байна
            </p>
            <button
              onClick={() => setActiveCategory("all")}
              className="mt-4 text-primary font-bold hover:underline"
            >
              Бүх барааг харах
            </button>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in slide-in-from-bottom-4 duration-700">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => addToCart(p)}
                className="group bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-64 bg-muted overflow-hidden">
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors z-10" />
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.productType || p.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Package className="size-16 opacity-20" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 z-20 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm border border-border/50 max-w-[calc(100%-2rem)]">
                    <User className="size-3 shrink-0" />
                    <span className="truncate">{formatHerderName(p.herderName)}</span>
                  </div>

                  {/* Category badge */}
                  {p.category && (
                    <div className="absolute bottom-4 right-4 z-20 bg-primary/90 text-primary-foreground backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm border border-white/10">
                      {CATEGORIES.find(c => c.id === p.category)?.label || p.category}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-4">
                    <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider text-[10px]">
                      {p.animal}
                    </p>
                    <h3 className="text-xl font-bold text-card-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {p.productType || p.title}
                    </h3>
                  </div>

                  <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-4">
                    <p className="text-2xl font-bold text-primary">
                      {p.price.toLocaleString()}₮
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p);
                      }}
                      className="size-12 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                      title="Сагсанд нэмэх"
                    >
                      <ShoppingCart className="size-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scrollbar hide styles */}
      <style jsx global>{`
          .no-scrollbar::-webkit-scrollbar {
              display: none;
          }
          .no-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
          }
      `}</style>
    </div>
  );
}
