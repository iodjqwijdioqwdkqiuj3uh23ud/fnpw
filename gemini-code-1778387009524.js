const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 소원 데이터를 저장할 파일
const DATA_FILE = './wishes.json';
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');

// 메인 페이지 보여주기
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 모든 소원 가져오기 API
app.get('/api/wishes', (req, res) => {
    const wishes = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    res.json(wishes);
});

// 새 소원 저장하기 API
app.post('/api/wishes', (req, res) => {
    const { content } = req.body;
    if (!content) return res.status(400).send('내용이 없습니다.');

    const wishes = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    wishes.unshift({ content, date: new Date().toLocaleString() }); // 최신글이 위로
    fs.writeFileSync(DATA_FILE, JSON.stringify(wishes, null, 2));
    
    res.redirect('/'); // 다시 메인으로
});

app.listen(3000, () => console.log('소원 게시판 서버 가동 중: 3000포트'));