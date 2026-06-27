const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); 

exports.sendMessage = async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ 
                error: 'Chatbot belum dikonfigurasi di server (API key belum diset)' 
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

        const userMessage = req.body.message; 
        if (!userMessage) {
            return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
        }

        const result = await model.generateContent(userMessage);
        const responseText = result.response.text();

        res.json({ reply: responseText }); 

    } catch (error) {
        console.error("Error Gemini:", error);
        res.status(500).json({ error: 'Gagal memproses pesan ke AI' });
    }
};