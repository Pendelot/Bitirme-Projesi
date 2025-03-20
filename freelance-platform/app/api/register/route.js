import pool from "../../../lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
    console.log("📌 API Çağrıldı! /api/register çalışıyor...");

    try {
        // JSON verisini al
        const body = await req.json();

        // Gelen verileri logla
        console.log("📌 Gelen Veriler:", body);

        // Değişkenleri ayrıştır
        const { firstName, lastName, email, password, userType } = body;

        // Eksik alan kontrolü
        if (!firstName || !lastName || !email || !password || !userType) {
            console.log("❌ Eksik bilgi hatası!");
            return new Response(
                JSON.stringify({ error: "Tüm alanları doldurun!" }),
                { status: 400 }
            );
        }

        // Email kontrolü
        console.log("📌 Kullanıcı mevcut mu kontrol ediliyor...");
        const [existingUser] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            console.log("❌ Kullanıcı zaten mevcut:", email);
            return new Response(
                JSON.stringify({ error: "Bu e-posta adresi zaten kullanılıyor!" }),
                { status: 400 }
            );
        }

        // Şifreyi güvenli hale getir
        console.log("🔄 Şifre şifreleniyor...");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("✅ Şifre başarıyla şifrelendi!");

        // Kullanıcıyı veritabanına ekle
        console.log("📝 Kullanıcı veritabanına ekleniyor...");
        const [result] = await pool.execute(
            "INSERT INTO users (first_name, last_name, email, password_hash, user_type) VALUES (?, ?, ?, ?, ?)",
            [firstName, lastName, email, hashedPassword, userType]
        );

        console.log("✅ Kullanıcı veritabanına başarıyla eklendi:", result);

        return new Response(
            JSON.stringify({ message: "Kayıt başarılı!" }),
            { status: 201 }
        );

    } catch (error) {
        console.error("❌ Kayıt hatası:", error);
        return new Response(
            JSON.stringify({ error: "Sunucu hatası!" }),
            { status: 500 }
        );
    }
}

// **GET isteğini engellemek için 405 (Method Not Allowed) döndür**
export async function GET() {
    return new Response(
        JSON.stringify({ error: "GET isteği desteklenmiyor." }),
        { status: 405 }
    );
}