const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/proxy', async (req, res) => {
    const { action, username, password } = req.query;
    const scriptUrl = `https://script.google.com/macros/s/AKfycbzJ9tTHPrYpX2LpT2soLupbrZH1pnkkrJ3j6UMMPD7YcSaLWShqvPrBosLzy2waP7Aa/exec?action=${action}&username=${username}&password=${password}`;

    try {
        const response = await fetch(scriptUrl);
        const data = await response.json();
        res.set('Access-Control-Allow-Origin', '*'); // Izinkan CORS
        res.json(data);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server proxy berjalan di http://localhost:${PORT}`);
});