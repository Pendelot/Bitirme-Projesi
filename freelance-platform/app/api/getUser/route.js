import pool from "../../../lib/db";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return new Response(JSON.stringify({ error: "Kullanıcı ID'si eksik!" }), { status: 400 });
        }

        const [user] = await pool.query("SELECT first_name, last_name FROM users WHERE id = ?", [userId]);

        if (user.length === 0) {
            return new Response(JSON.stringify({ error: "Kullanıcı bulunamadı!" }), { status: 404 });
        }

        return new Response(JSON.stringify(user[0]), { status: 200 });

    } catch (error) {
        console.error("Kullanıcı verisi alınamadı:", error);
        return new Response(JSON.stringify({ error: "Sunucu hatası!" }), { status: 500 });
    }
}
