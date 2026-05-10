const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 소원 저장 파일 설정
const DATA_FILE = './wishes.json';
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');

// ★ 이 부분이 중요해! index.html을 보여주도록 설정
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/wishes', (req, res) => {
    const wishes = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    res.json(wishes);
});

app.post('/api/wishes', (req, res) => {
    const { content } = req.body;
    if (!content) return res.status(400).send('내용을 입력해주세요.');
    const wishes = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    wishes.unshift({ content, date: new Date().toLocaleString() });
    fs.writeFileSync(DATA_FILE, JSON.stringify(wishes, null, 2));
    res.redirect('/');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
