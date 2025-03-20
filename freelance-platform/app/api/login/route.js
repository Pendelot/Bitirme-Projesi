import pool from "../../../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        console.log("📌 API'ye gelen istek:", email, password);  // Debug için

        // Kullanıcıyı veritabanında kontrol et
        const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

        if (user.length === 0) {
            console.log("❌ Kullanıcı bulunamadı:", email);
            return new Response(JSON.stringify({ error: "Geçersiz e-posta veya şifre!" }), { status: 401 });
        }

        const userData = user[0];

        // Şifre kontrolü
        const isPasswordValid = await bcrypt.compare(password, userData.password_hash);
        if (!isPasswordValid) {
            console.log("❌ Hatalı şifre:", email);
            return new Response(JSON.stringify({ error: "Geçersiz e-posta veya şifre!" }), { status: 401 });
        }

        // JWT Token oluştur
        const token = jwt.sign(
            { userId: userData.id, email: userData.email, userType: userData.user_type }, 
            "GIZLI_JWT_ANAHTARI", 
            { expiresIn: "24h" }
        );

        console.log("✅ Giriş başarılı! Kullanıcı:", userData.email);

        return new Response(JSON.stringify({ 
            message: "Giriş başarılı!", 
            token, 
            userId: userData.id,  // Kullanıcı ID'sini ekledik
            userType: userData.user_type 
        }), { status: 200 });

    } catch (error) {
        console.error("❌ API Hatası:", error);
        return new Response(JSON.stringify({ error: "Sunucu hatası!" }), { status: 500 });
    }
}