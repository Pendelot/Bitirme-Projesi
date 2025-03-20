"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Kullanıcı giriş yaptıysa, doğrudan dashboard'a yönlendir
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const userType = localStorage.getItem("userType");
            if (userType === "freelancer") {
                router.push("/freelancer-dashboard");
            } else if (userType === "employer") {
                router.push("/employer-dashboard");
            } else {
                router.push("/dashboard");
            }
        }
    }, [router]);

    const handleLogin = async () => {
        setError("");

        if (!email || !password) {
            setError("Lütfen e-posta ve şifrenizi girin.");
            return;
        }
        if (!email.includes("@") || !email.includes(".")) {
            setError("Geçerli bir e-posta adresi girin.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Giriş başarısız!");
            }

            // JWT Token, Kullanıcı ID ve Kullanıcı Türünü Kaydet
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);  // Kullanıcı ID'sini ekledik
            localStorage.setItem("userType", data.userType);

            // Kullanıcı türüne göre yönlendirme
            if (data.userType === "freelancer") {
                router.push("/freelancer-dashboard");
            } else if (data.userType === "employer") {
                router.push("/employer-dashboard");
            } else {
                router.push("/dashboard");
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignUpRedirect = () => {
        router.push("/register");
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-900 to-gray-700">
            <div className="bg-white p-8 rounded-lg shadow-2xl text-center w-96 border border-gray-300">
                <h2 className="text-3xl font-extrabold mb-6 text-gray-900">Üye Girişi</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <div className="text-left mb-4">
                    <label className="block text-gray-700 font-semibold">E-Posta</label>
                    <input 
                        type="email" 
                        placeholder="E-Posta" 
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="text-left mb-4">
                    <label className="block text-gray-700 font-semibold">Şifre</label>
                    <input 
                        type="password" 
                        placeholder="Şifre" 
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button 
                    onClick={handleLogin} 
                    className={`w-full p-3 mt-4 rounded-lg text-white font-semibold ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-800 transition duration-300"}`} 
                    disabled={loading}>
                    {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                </button>
                <p className="text-sm text-gray-500 mt-4">Hesabınız yok mu?</p>
                <button 
                    onClick={handleSignUpRedirect} 
                    className="w-full bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-800 mt-2 font-semibold transition duration-300">
                    Kayıt Ol
                </button>
            </div>
        </div>
    );
}
