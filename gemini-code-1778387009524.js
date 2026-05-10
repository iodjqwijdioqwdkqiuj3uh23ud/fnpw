const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 10000;
const DATA_FILE = './wishes.json';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // 현재 폴더의 파일들을 읽을 수 있게 설정

// 데이터 파일 초기화
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');

// 메인 페이지
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 소원 목록 가져오기
app.get('/api/wishes', (req, res) => {
    const wishes = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    res.json(wishes);
});

// 소원 저장하기
app.post('/api/wishes', (req, res) => {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: '내용을 입력하세요.' });

    const wishes = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    wishes.unshift({ content, date: new Date().toLocaleString() });
    fs.writeFileSync(DATA_FILE, JSON.stringify(wishes, null, 2));
    
    res.json({ success: true });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
