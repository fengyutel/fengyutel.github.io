const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// 假设这是你的会员数据文件路径
const MEMBER_DATA_PATH = path.join(__dirname, 'members.json');

// 读取成员数据
function readMembers() {
    return new Promise((resolve, reject) => {
        fs.readFile(MEMBER_DATA_PATH, 'utf8', (err, data) => {
            if (err) return reject(err);
            resolve(JSON.parse(data));
        });
    });
}

// 验证登录
app.post('/validate', async (req, res) => {
    try {
        const members = await readMembers();
        const { username, password } = req.body;
        const member = members.find(m => m.username === username && m.password === password);
        if (member) {
            // 设置会话标识
            res.cookie('memberSession', username);
            res.json({ success: true });
        } else {
            res.json({ success: false, message: '没有查询到此账户，可能是密码错误，也可能已过期。' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('服务器错误');
    }
});

app.get('/member.html', (req, res) => {
    // 检查是否已登录
    if (!req.cookies.memberSession) {
        res.redirect('/login.html');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'member.html'));
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
