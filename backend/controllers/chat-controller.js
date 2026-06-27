const db = require('../config/db');
require('dotenv').config();

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';

// ============================================================
// HELPER: format 1 objek Date jadi string 'YYYY-MM-DD'
// Pakai komponen tanggal LOKAL (bukan toISOString) supaya
// tidak melenceng 1 hari karena pergeseran timezone UTC.
// ============================================================
const toDateOnlyStr = (d) => {
    const dt = new Date(d);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

// ============================================================
// HELPER: Ambil data tugas user dari MySQL lalu susun jadi
// teks context buat disuntikkan ke system prompt AI.
// Ini bagian "RAG-lite" nya: kita query dulu, baru kasih ke AI.
// ============================================================
const buildTaskContext = async (userId) => {
    const [tasks] = await db.query(
        `SELECT DISTINCT t.judul, t.mata_kuliah, t.due_date, t.status
         FROM tasks t
         LEFT JOIN task_members tm ON t.id_task = tm.task_id
         WHERE t.id_pembuat = ? OR tm.user_id = ?
         ORDER BY t.due_date ASC
         LIMIT 30`,
        [userId, userId]
    );

    if (tasks.length === 0) {
        return 'User ini belum punya tugas sama sekali di StudyHub.';
    }

    // Anchor "hari ini" pakai komponen tanggal lokal juga, biar konsisten
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const lines = tasks.map((t, i) => {
        const dueRaw = new Date(t.due_date);
        const due = new Date(dueRaw.getFullYear(), dueRaw.getMonth(), dueRaw.getDate());
        const selisihHari = Math.round((due.getTime() - today.getTime()) / 86400000);

        let infoDeadline;
        if (selisihHari < 0) infoDeadline = `LEWAT DEADLINE ${Math.abs(selisihHari)} hari`;
        else if (selisihHari === 0) infoDeadline = 'DEADLINE HARI INI';
        else infoDeadline = `H-${selisihHari}`;

        return `${i + 1}. "${t.judul}" | Mapel: ${t.mata_kuliah || '-'} | Status: ${t.status} | Deadline: ${toDateOnlyStr(due)} (${infoDeadline})`;
    });

    return lines.join('\n');
};

// ============================================================
// HELPER: Ambil N riwayat chat terakhir user, buat context
// percakapan multi-turn (AI ingat obrolan sebelumnya).
// ============================================================
const getRecentHistory = async (userId, limit = 10) => {
    const [rows] = await db.query(
        `SELECT role, message FROM chat_history
         WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
        [userId, limit]
    );
    return rows.reverse(); // balik urutan jadi kronologis (lama -> baru)
};

// ============================================================
// GET /api/chat/history — ambil riwayat chat user (buat hydrate UI)
// ============================================================
exports.getChatHistory = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const [rows] = await db.query(
            `SELECT id_chat, role, message, created_at FROM chat_history
             WHERE user_id = ? ORDER BY created_at ASC LIMIT 100`,
            [userId]
        );
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('❌ Error getChatHistory:', error);
        res.status(500).json({ success: false, message: 'Gagal memuat riwayat chat' });
    }
};

// ============================================================
// DELETE /api/chat/history — hapus semua riwayat chat user
// ============================================================
exports.clearChatHistory = async (req, res) => {
    try {
        const userId = req.user.id_user;
        await db.query('DELETE FROM chat_history WHERE user_id = ?', [userId]);
        res.status(200).json({ success: true, message: 'Riwayat chat berhasil dihapus' });
    } catch (error) {
        console.error('❌ Error clearChatHistory:', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus riwayat chat' });
    }
};

// ============================================================
// POST /api/chat — kirim pesan ke chatbot
//
// Pola: RAG-lite / function-context injection
//   1) Ambil data tugas user dari MySQL
//   2) Susun jadi context text
//   3) Suntikkan ke system prompt bareng riwayat chat sebelumnya
//   4) Kirim ke Anthropic API (fetch native, Node 18+)
//   5) Simpan pesan user + jawaban AI ke chat_history, lalu balikin
// ============================================================
exports.sendChatMessage = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const userName = req.user.nama_lengkap;
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ success: false, message: 'Pesan tidak boleh kosong' });
        }

        if (!process.env.ANTHROPIC_API_KEY) {
            console.error('❌ ANTHROPIC_API_KEY belum diset di .env');
            return res.status(500).json({ success: false, message: 'Chatbot belum dikonfigurasi di server (API key belum diset)' });
        }

        // 1 & 2. Ambil + susun context tugas user dari database
        const taskContext = await buildTaskContext(userId);

        // Ambil riwayat percakapan sebelumnya buat context multi-turn
        const history = await getRecentHistory(userId, 10);

        // 3. Susun system prompt — di sinilah context tugas "disuntikkan"
        const systemPrompt = `Kamu adalah "StudyBot", asisten AI di aplikasi StudyHub (sistem manajemen tugas mahasiswa).
Nama user yang sedang chat denganmu: ${userName}.
Tanggal hari ini: ${toDateOnlyStr(new Date())}.

Berikut data tugas milik ${userName} saat ini, urut dari deadline terdekat. Ini adalah SATU-SATUNYA sumber data tugas yang valid — jangan pernah mengarang atau menambahkan tugas di luar daftar ini:
${taskContext}

Instruksi:
- Kalau user nanya soal tugas (status, deadline, jumlah, dll), jawab berdasarkan data di atas SAJA.
- Kalau data di atas tidak cukup untuk menjawab, jawab jujur kalau datanya tidak ada — jangan menebak.
- Kamu juga boleh menjawab pertanyaan umum di luar topik tugas (materi kuliah, tips belajar, motivasi, dll) secara wajar.
- Jawab singkat, jelas, dan ramah. Pakai Bahasa Indonesia kecuali user mengetik dalam bahasa lain.
- Jangan menampilkan ulang seluruh daftar tugas kalau user tidak memintanya secara eksplisit — ringkas dan langsung ke poin.`;

        // Gabungkan riwayat chat + pesan baru jadi format messages Anthropic
        const messages = [
            ...history.map(h => ({ role: h.role, content: h.message })),
            { role: 'user', content: message }
        ];

        // 4. Kirim ke Anthropic API
        const aiResponse = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: MODEL,
                max_tokens: 1024,
                system: systemPrompt,
                messages
            })
        });

        const aiData = await aiResponse.json();

        if (!aiResponse.ok) {
            console.error('❌ Error dari Anthropic API:', aiData);
            return res.status(502).json({ success: false, message: 'StudyBot sedang gangguan, coba lagi sebentar ya' });
        }

        const replyText = aiData.content?.find(block => block.type === 'text')?.text
            || 'Maaf, aku belum bisa menjawab itu sekarang.';

        // 5. Simpan pesan user & jawaban AI ke chat_history (sekali query, 2 baris)
        await db.query(
            'INSERT INTO chat_history (user_id, role, message) VALUES (?, ?, ?), (?, ?, ?)',
            [userId, 'user', message, userId, 'assistant', replyText]
        );

        res.status(200).json({ success: true, reply: replyText });

    } catch (error) {
        console.error('❌ Error sendChatMessage:', error);
        res.status(500).json({ success: false, message: 'Gagal menghubungi chatbot' });
    }
};
