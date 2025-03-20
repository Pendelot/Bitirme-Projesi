import pool from "../../../lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const body = await req.json();
        const { userId, firstName, lastName, email, password, bio } = body;

        // Kullanıcıyı veritabanında kontrol et
        const [existingUser] = await pool.query("SELECT * FROM users WHERE id = ?", [userId]);

        if (existingUser.length === 0) {
            return new Response(JSON.stringify({ error: "Kullanıcı bulunamadı!" }), { status: 404 });
        }

        // Şifre değiştiyse yeni şifreyi şifrele
        let hashedPassword = existingUser[0].password_hash;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Kullanıcı bilgilerini güncelle (Hakkınızda kısmı dahil)
        await pool.execute(
            "UPDATE users SET first_name = ?, last_name = ?, email = ?, password_hash = ?, bio = ? WHERE id = ?",
            [firstName, lastName, email, hashedPassword, bio, userId]
        );

        return new Response(JSON.stringify({ message: "Bilgiler başarıyla güncellendi!" }), { status: 200 });

    } catch (error) {
        console.error("❌ Kullanıcı güncelleme hatası:", error);
        return new Response(JSON.stringify({ error: "Sunucu hatası!" }), { status: 500 });
    }
}
