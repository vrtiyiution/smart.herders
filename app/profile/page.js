"use client";

import { useAuth } from "../context/AuthContext";
import { User, Mail, Phone, MapPin, Shield, Camera, ArrowLeft, Save, X, Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const { user, logout, updateProfile } = useAuth();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        avatar: ""
    });

    useEffect(() => {
        if (!user) {
            router.push("/auth/login");
        } else {
            setFormData({
                fullName: user.fullName || user.name || "",
                phone: user.phone || "",
                address: user.address || "",
                avatar: user.avatar || ""
            });
        }
    }, [user, router]);

    if (!user) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 400;
                    const MAX_HEIGHT = 400;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG with 0.7 quality
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);

                    setFormData(prev => ({
                        ...prev,
                        avatar: compressedDataUrl
                    }));
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateProfile(formData);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setLoading(false);
        }
    };

    const backPath = user.role === "herder" ? "/herder" : user.role === "admin" ? "/admin" : "/customer";

    return (
        <div className="min-h-[calc(100vh-64px)] bg-muted/30 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link
                    href={backPath}
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group"
                >
                    <ArrowLeft className="size-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Буцах
                </Link>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: Avatar & Basic Info */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-card border border-border shadow-xl rounded-3xl p-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-primary/10" />

                            <div className="relative pt-4">
                                <div className="size-32 rounded-3xl bg-primary/20 mx-auto flex items-center justify-center text-primary relative group overflow-hidden">
                                    {formData.avatar ? (
                                        <img
                                            src={formData.avatar}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="size-16" />
                                    )}
                                    <button
                                        onClick={() => document.getElementById('avatar-upload').click()}
                                        className="absolute bottom-0 right-0 size-8 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    >
                                        <Camera className="size-4" />
                                    </button>
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </div>

                                {isEditing ? (
                                    <div className="mt-6">
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-center font-bold text-lg"
                                            placeholder="Нэр"
                                        />
                                    </div>
                                ) : (
                                    <h1 className="text-2xl font-bold text-foreground mt-6">{user.fullName || user.name}</h1>
                                )}
                                <p className="text-muted-foreground bg-muted px-3 py-1 rounded-full text-xs font-medium inline-block mt-2">
                                    {user.role === "herder" ? "Малчин" : user.role === "admin" ? "Админ" : "Хэрэглэгч"}
                                </p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-border space-y-3">
                                <button
                                    onClick={logout}
                                    className="w-full py-3 px-4 rounded-xl bg-destructive/10 text-destructive font-semibold hover:bg-destructive hover:text-white transition-all text-sm"
                                >
                                    Гарах
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Detailed Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-card border border-border shadow-xl rounded-3xl p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    <Shield className="size-5 text-primary" />
                                    Хувийн мэдээлэл
                                </h2>
                                {isEditing && (
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <X className="size-5" />
                                    </button>
                                )}
                            </div>

                            <div className="grid sm:grid-cols-2 gap-8">
                                {/* Email (Read Only) */}
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">И-мэйл хаяг</span>
                                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border/50 opacity-70">
                                        <Mail className="size-5 text-primary" />
                                        <span className="font-medium text-foreground">{user.email}</span>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Утасны дугаар</span>
                                    {isEditing ? (
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-primary" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 bg-background border border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
                                                placeholder="Утас"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border/50">
                                            <Phone className="size-5 text-primary" />
                                            <span className="font-medium text-foreground">{user.phone || "Бүртгэлгүй"}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Address */}
                                <div className="space-y-1 sm:col-span-2">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Байршил / Хаяг</span>
                                    {isEditing ? (
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-primary" />
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 bg-background border border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
                                                placeholder="Байршил"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border/50">
                                            <MapPin className="size-5 text-primary" />
                                            <span className="font-medium text-foreground">{user.address || "Тодорхойгүй"}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-10 flex justify-end">
                                {isEditing ? (
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] flex items-center gap-2"
                                    >
                                        {loading ? (
                                            <Loader className="size-5 animate-spin" />
                                        ) : (
                                            <Save className="size-5" />
                                        )}
                                        Хадгалах
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
                                    >
                                        Мэдээлэл засах
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Account Activity (Placeholder) */}
                        <div className="bg-card border border-border/50 rounded-3xl p-8 opacity-60 grayscale cursor-not-allowed">
                            <h2 className="text-lg font-bold text-foreground mb-4">Сүүлийн үйлдлүүд</h2>
                            <div className="text-sm text-muted-foreground italic">
                                Удахгүй нэмэгдэнэ...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

