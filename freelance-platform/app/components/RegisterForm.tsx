"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userType, setUserType] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async () => {
        setError("");
        setSuccess("");
    
        if (!firstName || !lastName || !email || !password || !confirmPassword || !userType) {
            setError("Lütfen tüm alanları doldurun.");
            return;
        }
        if (!email.includes("@") || !email.includes(".")) {
            setError("Geçerli bir e-posta adresi girin.");
            return;
        }
        if (password.length < 6) {
            setError("Şifre en az 6 karakter olmalıdır.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Şifreler eşleşmiyor!");
            return;
        }
    
        setLoading(true);
    
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                    userType,
                }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || "Kayıt başarısız!");
            }
    
            setSuccess("Üyelik başarıyla oluşturuldu! Giriş sayfasına yönlendiriliyorsunuz...");
            setTimeout(() => router.back(), 2000);


        } catch (error) {
            setError((error as Error).message);  // ✅ Hata yönetimi düzeltildi
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-900 to-gray-700 w-full">
            <div className="bg-white p-8 rounded-lg shadow-2xl text-center w-full max-w-lg border border-gray-300">
                <h2 className="text-3xl font-extrabold mb-6 text-gray-900">Kayıt Ol</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                {success && <p className="text-green-500 mb-2">{success}</p>}
                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Adınız" 
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input 
                        type="text" 
                        placeholder="Soyadınız" 
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <input 
                        type="email" 
                        placeholder="E-Posta" 
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="Şifre (Min. 6 karakter)" 
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="Şifre (Tekrar)" 
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <div className="flex justify-between gap-4">
                        <button 
                            className={`w-1/2 p-3 rounded-lg font-semibold ${userType === 'freelancer' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`} 
                            onClick={() => setUserType('freelancer')}>
                            Freelance Çalışan
                        </button>
                        <button 
                            className={`w-1/2 p-3 rounded-lg font-semibold ${userType === 'employer' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`} 
                            onClick={() => setUserType('employer')}>
                            İşveren
                        </button>
                    </div>
                </div>
                <button 
                    onClick={handleRegister} 
                    className={`w-full p-3 mt-4 rounded-lg text-white font-semibold ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-800 transition duration-300"}`} 
                    disabled={loading}>
                    {loading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
                </button>
            </div>
        </div>
    );
}
