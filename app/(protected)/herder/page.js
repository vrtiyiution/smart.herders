"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import {
  Upload,
  X,
  Beef,
  Milk,
  Scissors,
  PawPrint,
  ArrowLeft,
  Check,
  Truck,
  User,
} from "lucide-react";

const animalTypes = [
  { value: "cow", label: "Үхэр" },
  { value: "sheep", label: "Хонь" },
  { value: "horse", label: "Адуу" },
  { value: "goat", label: "Ямаа" },
  { value: "camel", label: "Тэмээ" },
];

const animalTypesForDairy = [
  { value: "cow", label: "Үнээ" },
  { value: "sheep", label: "Хонь" },
  { value: "horse", label: "Гүү" },
  { value: "goat", label: "Ямаа" },
  { value: "camel", label: "Ингэ" },
];

const meatTypes = {
  cow: ["Үхрийн цул мах", "Ястай мах", "Яс", "Таван цул"],
  sheep: ["Хонины цул мах", "Ястай мах", "Яс", "Таван цул"],
  goat: ["Ямааны цул мах", "Ястай мах", "Яс", "Таван цул"],
  horse: ["Адууны цул мах", "Ястай мах", "Яс", "Таван цул"],
  camel: ["Тэмээний цул", "Ястай мах", "Яс", "Таван цул"],
};

const dairyTypes = {
  cow: ["Сүү", "Тараг", "Өрөм", "Ааруул", "Ээзгий", "Цөцгий", "Аарц", "Бяслаг"],
  sheep: ["Сүү", "Тараг", "Өрөм", "Ааруул", "Цагаан тос", "Аарц", "Бяслаг"],
  goat: ["Сүү", "Тараг", "Өрөм", "Ааруул", "Ээзгий", "Аарц", "Бяслаг"],
  horse: ["Айраг", "Саам"],
  camel: ["Хоормог", "Ааруул", "Сүү", "Аарц"],
};

const hideTypes = {
  cow: ["Үхрийн шир", "Хөөвөр"],
  sheep: ["Нэхий", "Ноос"],
  goat: ["Ямааны арьс", "Ноолуур"],
  horse: ["Адууны шир", "Дэл", "Сүүл"],
  camel: ["Тэмээний шир", "Ноос"],
};

const liveTypes = {
  cow: ["Тугал", "Бяруу", "Хязаалан", "Соёолон", "Бух", "Үнээ"],
  sheep: ["Хурга", "Төлөг", "Хонь", "Хуц"],
  goat: ["Ишиг", "Борлон", "Ямаа", "Ухна"],
  horse: ["Унага", "Даага", "Үрээ", "Гүү", "Азарга", "Морь"],
  camel: ["Ботго", "Тором", "Ат", "Ингэ", "Буур"],
};

const categories = [
  {
    id: "meat",
    title: "Мах, махан бүтээгдэхүүн",
    icon: Beef,
    color: "from-orange-500 to-red-600",
    shadow: "shadow-orange-200 dark:shadow-orange-900",
    data: meatTypes,
    label: "Махны төрөл",
  },
  {
    id: "dairy",
    title: "Сүү, сүүн бүтээгдэхүүн",
    icon: Milk,
    color: "from-blue-400 to-cyan-600",
    shadow: "shadow-blue-200 dark:shadow-blue-900",
    data: dairyTypes,
    label: "Бүтээгдэхүүний төрөл",
  },
  {
    id: "hides",
    title: "Арьс, шир, ноолуур",
    icon: Scissors,
    color: "from-amber-500 to-yellow-600",
    shadow: "shadow-amber-200 dark:shadow-amber-900",
    data: hideTypes,
    label: "Түүхий эдийн төрөл",
  },
  {
    id: "live",
    title: "Амьд мал",
    icon: PawPrint,
    color: "from-green-500 to-emerald-600",
    shadow: "shadow-green-200 dark:shadow-green-900",
    data: liveTypes,
    label: "Малын нас / хүйс",
  },
];

export default function HerderDashboard() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [animal, setAnimal] = useState("cow");
  const [productType, setProductType] = useState("");
  const [image, setImage] = useState(null);
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  const { user } = useAuth(); // Get current user

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setAnimal("cow");
    const category = categories.find((c) => c.id === catId);
    if (category?.data?.cow?.length > 0) {
      setProductType(category.data.cow[0]);
    } else {
      setProductType("");
    }
  };

  const handleAnimalChange = (newAnimal) => {
    setAnimal(newAnimal);
    const category = categories.find((c) => c.id === selectedCategory);
    if (category?.data?.[newAnimal]?.length > 0) {
      setProductType(category.data[newAnimal][0]);
    } else {
      setProductType("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Poll for new orders count
  useEffect(() => {
    const checkNewOrders = () => {
      if (!user) return;
      const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");

      // Count unique orders that have at least one PENDING item for this herder
      // and ensure we don't count items that the herder has already moved to trash
      const relevantOrders = allOrders.filter(order => {
        return order.items.some(item =>
          item.status === "Pending" &&
          !item.herderDeleted &&
          (item.herderEmail === user.email || item.herderName === user.fullName)
        );
      });

      setPendingOrdersCount(relevantOrders.length);
    };

    checkNewOrders();
    const interval = setInterval(checkNewOrders, 3000);
    return () => clearInterval(interval);
  }, [user]);

  const handleSubmit = () => {
    if (!productType || !price || !desc || !image) {
      alert("Бүх талбарыг бөглөнө үү!");
      return;
    }

    // Find Mongolian label for animal
    const animalList = selectedCategory === "dairy" ? animalTypesForDairy : animalTypes;
    const animalObj = animalList.find(a => a.value === animal);
    const animalLabel = animalObj ? animalObj.label : animal;

    const newProduct = {
      id: Date.now().toString(),
      title: `${animalLabel} - ${productType}`,
      herderName: user?.fullName || user?.email || "Малчин",
      herderEmail: user?.email, // Save email for filtering
      animal: animalLabel, // Save "Үхэр" instead of "cow"
      productType,
      image,
      desc,
      price: Number(price),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("products") || "[]");
    existing.push(newProduct);
    localStorage.setItem("products", JSON.stringify(existing));

    setSuccessMessage("Админд амжилттай илгээгдлээ. Удахгүй нийтлэгдэнэ.");
    setTimeout(() => setSuccessMessage(""), 3000);

    setSelectedCategory(null);
    setAnimal("cow");
    setProductType("");
    setImage(null);
    setDesc("");
    setPrice("");
  };

  const currentCategory = categories.find((c) => c.id === selectedCategory);

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center p-6 pt-12 md:pt-20 transition-all duration-500">
        {successMessage && (
          <div className="fixed top-24 z-50 px-6 py-4 bg-green-600/90 text-white text-lg font-medium rounded-2xl shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 fade-in duration-300">
            {successMessage}
          </div>
        )}

        {/* HEADER SECTION */}
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between mb-16 gap-6 fade-in duration-700">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight text-center md:text-left">
            <span>Та юу зарах вэ?</span>
            <span className="block text-lg font-medium text-muted-foreground mt-2 tracking-normal">Төрлөө сонгоод мэдээллээ оруулна уу</span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-4">

            <Link href="/herder/orders">
              <button className="group relative flex items-center gap-3 bg-primary/10 hover:bg-primary/20 text-primary border-2 border-primary/20 hover:border-primary font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 active:scale-95 w-full md:w-auto">
                <span className="bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                  <Truck className="size-5" />
                </span>
                Захиалга хянах
                {pendingOrdersCount > 0 && (
                  <span className="absolute -top-3 -right-3 size-8 bg-red-600 text-white text-sm font-black rounded-full flex items-center justify-center border-4 border-background animate-bounce shadow-lg ring-4 ring-red-600/20">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>
            </Link>

            <Link href="/herder/my-products">
              <button className="group flex items-center gap-3 bg-secondary/10 hover:bg-secondary/20 text-secondary-foreground border-2 border-secondary/20 hover:border-secondary font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 active:scale-95 w-full md:w-auto">
                <span className="bg-secondary text-secondary-foreground p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                  <Upload className="size-5" />
                </span>
                Миний оруулсан бараа
              </button>
            </Link>
          </div>
        </div>

        {/* CATEGORY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full px-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`group relative overflow-hidden rounded-[2rem] p-6 h-80 flex flex-col items-center justify-between text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${cat.shadow}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Texture/Pattern overlay */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>

              <div className="relative z-10 w-full flex justify-end">
                <div className="bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <Check className="size-5 text-white" />
                </div>
              </div>

              <div className="relative z-10 flex flex-col items-center space-y-6 flex-1 justify-center">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-full group-hover:bg-white/20 transition-colors duration-300 shadow-inner">
                  <cat.icon className="size-16 drop-shadow-md group-hover:scale-110 transition-transform duration-500 ease-out" />
                </div>
                <span className="text-2xl font-bold text-center tracking-wide leading-tight px-4">
                  {cat.title}
                </span>
              </div>

              <div className="relative z-10 text-xs font-medium bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10 opacity-70 group-hover:opacity-100 transition-opacity">
                {cat.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        {successMessage && (
          <div className="mb-6 px-6 py-4 bg-green-600/90 text-white text-lg font-medium rounded-2xl shadow-lg text-center backdrop-blur-sm">
            {successMessage}
          </div>
        )}

        <button
          onClick={() => setSelectedCategory(null)}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="size-5" />
          <span>Буцах</span>
        </button>

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-foreground">
          {currentCategory?.title} оруулах
        </h2>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-xl font-bold mb-4 text-card-foreground">Малын төрөл сонгоно уу</h3>
          <div className="grid grid-cols-3 gap-4">
            {(selectedCategory === "dairy" ? animalTypesForDairy : animalTypes).map((a) => (
              <button
                key={a.value}
                onClick={() => handleAnimalChange(a.value)}
                className={`py-4 rounded-xl font-medium transition-all ${animal === a.value
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-xl font-bold mb-4 text-card-foreground">{currentCategory?.label}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(currentCategory?.data?.[animal] || []).map((type) => (
              <button
                key={type}
                onClick={() => setProductType(type)}
                className={`py-4 rounded-xl font-medium transition-all ${productType === type
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <input
            type="number"
            placeholder="Үнэ (₮)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-6 py-4 rounded-xl bg-card border border-input text-card-foreground shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />

          <textarea
            placeholder="Нэмэлт тайлбар (заавал биш)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            className="w-full px-6 py-4 rounded-xl bg-card border border-input text-card-foreground shadow-sm text-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          />

          <label className="block group">
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            <div className="border-4 border-dashed border-muted-foreground/20 rounded-2xl p-10 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all">
              {image ? (
                <img src={image} alt="Оруулсан зураг" className="mx-auto max-h-64 rounded-xl shadow-lg" />
              ) : (
                <div>
                  <Upload className="size-16 mx-auto text-muted-foreground mb-4 group-hover:scale-110 transition-transform" />
                  <p className="text-xl font-bold text-muted-foreground group-hover:text-foreground">Зураг оруулах</p>
                </div>
              )}
            </div>
          </label>

          <button
            onClick={handleSubmit}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-2xl py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 active:scale-[0.99]"
          >
            АДМИНД ИЛГЭЭХ
          </button>
        </div>
      </div>
    </div>
  );
}