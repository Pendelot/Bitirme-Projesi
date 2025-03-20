"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountSettings() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");

    const handleSave = async () => {
        setMessage("");
    
        try {
            const response = await fetch("/api/updateProfile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: localStorage.getItem("userId"), // Kullanıcının ID'sini al
                    firstName,
                    lastName,
                    email,
                    password,
                    bio,
                }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || "Güncelleme başarısız!");
            }
    
            setMessage("Bilgileriniz başarıyla güncellendi!");
    
            // Eğer şifre değiştirildiyse, kullanıcıyı çıkış yaptır ve giriş sayfasına yönlendir
            if (password) {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("userType");
                router.push("/login");
            }
    
        } catch (error: unknown) {
            if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage("Bilinmeyen bir hata oluştu!");
            }
        }
    };
    
    

    const handleBack = () => {
        router.push("/freelancer-dashboard");
    };

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === "application/pdf") {
            setCvFile(file);
            setMessage("CV başarıyla yüklendi!");
        } else {
            setMessage("Lütfen sadece PDF formatında bir CV yükleyin.");
        }
    };

    const handleDeleteAccount = () => {
        if (confirm("Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) {
            setMessage("Hesabınız başarıyla silindi.");
            setTimeout(() => router.push("/login"), 2000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-700 p-6">
            <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-4xl flex border border-gray-300">
                <div className="w-1/3 flex flex-col items-center border-r border-gray-300 pr-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Profil Fotoğrafı</h2>
                    <div className="w-32 h-32 border-2 border-gray-300 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                        {profileImage ? (
                            <img src={profileImage} alt="Profil" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-500">Yükleyin</span>
                        )}
                    </div>
                    <label className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition">
                        Fotoğraf Seç
                        <input type="file" accept="image/*" onChange={handleProfileImageChange} className="hidden" />
                    </label>
                    
                    <h2 className="text-xl font-bold text-gray-900 mt-6 text-center">CV Yükleme</h2>
                    <label className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition">
                        CV Seç
                        <input type="file" accept="application/pdf" onChange={handleCvUpload} className="hidden" />
                    </label>
                    {cvFile && <p className="text-green-500 text-sm mt-2 text-center">{cvFile.name}</p>}
                </div>
                
                <div className="w-2/3 pl-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Hesap Ayarları</h1>
                    {message && <p className="text-green-500 text-sm mb-4 text-center">{message}</p>}
                    <div className="space-y-4">
                        <input type="text" placeholder="Adınız" className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        <input type="text" placeholder="Soyadınız" className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        <input type="email" placeholder="E-Posta" className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Yeni Şifre (Opsiyonel)" className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <textarea placeholder="Hakkınızda kısa bir açıklama yazın..." className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
                    </div>
                    <button onClick={handleSave} className="w-full mt-6 p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 transition duration-300">Değişiklikleri Kaydet</button>
                    <button onClick={handleBack} className="w-full mt-4 p-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-800 transition duration-300">Geri Dön</button>
                    <button onClick={handleDeleteAccount} className="w-full mt-4 p-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-800 transition duration-300">Hesabımı Sil</button>
                </div>
            </div>
        </div>
    );
}
