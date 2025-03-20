"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers"; // Ethereum işlemleri için

// window.ethereum nesnesini TypeScript'e tanıt
declare global {
    interface Window {
        ethereum?: any;
    }
}

export default function FreelancerDashboard() {
    const router = useRouter();
    const [userName, setUserName] = useState<string>(""); // Kullanıcı adı ve soyadı
    const [walletConnected, setWalletConnected] = useState<boolean>(false);
    const [walletAddress, setWalletAddress] = useState<string>("");
    const [cryptoBalance, setCryptoBalance] = useState<string>("0.00 ETH");
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const userType = localStorage.getItem("userType");
        const storedWallet = localStorage.getItem("walletAddress");

        if (!token) {
            router.push("/login");
        } else if (userType !== "freelancer") {
            router.push("/");
        }

        // Kullanıcı bilgilerini getir
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/getUser?userId=${userId}`);
                const data = await response.json();

                if (response.ok) {
                    setUserName(`${data.first_name} ${data.last_name}`);
                } else {
                    console.error("Kullanıcı bilgisi alınamadı:", data.error);
                }
            } catch (error) {
                console.error("Sunucu hatası:", error);
            }
        };

        if (userId) {
            fetchUserData();
        }

        // Eğer daha önce bir cüzdan bağlanmışsa bilgileri yükle
        if (storedWallet) {
            setWalletConnected(true);
            setWalletAddress(storedWallet);
            fetchBalance(storedWallet);
        }
    }, [router]);

    // Ethereum bakiyesini çek
    const fetchBalance = async (address: string) => {
        if (!window.ethereum) {
            console.error("Ethereum sağlayıcısı bulunamadı.");
            return;
        }
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const balance = await provider.getBalance(address);
            setCryptoBalance(ethers.formatEther(balance) + " ETH");
        } catch (error) {
            console.error("Bakiye alınamadı:", error);
        }
    };

    // Cüzdan bağlama işlemi
    const connectWallet = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const account = await signer.getAddress();

                setWalletAddress(account);
                setWalletConnected(true);
                localStorage.setItem("walletAddress", account);

                console.log("✅ Cüzdan Bağlandı:", account);
                fetchBalance(account);
            } catch (error) {
                console.error("❌ Cüzdan bağlanırken hata:", error);
            }
        } else {
            alert("Lütfen MetaMask veya uyumlu bir cüzdan yükleyin.");
        }
    };

    // Oturumu kapatma işlemi
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userType");
        localStorage.removeItem("walletAddress");
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Üst Menü */}
            <nav className="bg-white shadow-md p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-600">Freelancer Paneli</h1>
                <div className="flex items-center space-x-4">
                    {/* Kullanıcı Adı */}
                    <span className="text-gray-700 font-semibold">
                        {userName ? userName : "Kullanıcı Yükleniyor..."}  
                    </span>

                    {/* Cüzdan Bilgisi */}
<span className="text-gray-500 truncate max-w-[200px] text-ellipsis overflow-hidden">
    {walletConnected ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)} - ${cryptoBalance}` : "Cüzdan Bağlı Değil"}
</span>

                    
                    {/* Hesap Menüsü */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="bg-gray-200 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-300 transition"
                        >
                            Hesabım
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
                                <button 
                                    onClick={() => router.push("/account-settings")}
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                    Hesap Ayarları
                                </button>
                                <button
    onClick={connectWallet}
    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left truncate max-w-[200px] text-ellipsis overflow-hidden"
>
    {walletConnected ? `Cüzdan: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Cüzdan Bağla"}
</button>

                                <button
                                    onClick={handleLogout}
                                    className="block px-4 py-2 text-red-500 hover:bg-gray-100 w-full text-left"
                                >
                                    Oturumu Kapat
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* İçerik */}
            <main className="flex flex-col items-center justify-center flex-grow p-6">
                <p className="text-lg text-gray-700 mb-6">
                    Burada iş ilanlarını görebilir ve başvurabilirsiniz.
                </p>
                <button
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-700 transition"
                    onClick={() => alert("İşlere Başvur butonu yakında aktif olacak!")}
                >
                    İşlere Başvur
                </button>
            </main>
        </div>
    );
}
