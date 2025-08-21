const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const https = require('https');
const fs = require('fs');
const selfsigned = require('selfsigned');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors()); // Разрешаем CORS для разработки
app.use(morgan('combined')); // Логирование запросов

// Статические файлы из папки dist (для продакшн сборки Vite)
app.use(express.static(path.join(__dirname, 'dist')));

// Маршрут для главной страницы (обслуживает index.html из dist)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Обработка 404 ошибок
app.use((req, res) => {
    res.status(404).json({
        error: 'Страница не найдена',
        path: req.path
    });
});

// Обработка ошибок сервера
app.use((err, req, res, next) => {
    console.error('Ошибка сервера:', err);
    res.status(500).json({
        error: 'Внутренняя ошибка сервера',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Что-то пошло не так'
    });
});

// Запуск сервера
async function startServer() {
    const certsDir = path.join(__dirname, 'certs');
    const keyPath = path.join(certsDir, 'key.pem');
    const certPath = path.join(certsDir, 'cert.pem');

    let privateKey, certificate;

    // Check if certs exist, if not, generate them
    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
        console.log('🔒 SSL сертификаты не найдены. Генерирую самоподписанные сертификаты...');
        if (!fs.existsSync(certsDir)) {
            fs.mkdirSync(certsDir);
        }
        const pems = selfsigned.generate([{ name: 'commonName', value: 'localhost' }], {
            keySize: 2048, // the size of the key in bits (default: 1024)
            days: 365, // how long till expiry (default: 365)
            algorithm: 'sha256', // sign algorithm (default: 'sha1')
            extensions: [{
                name: 'basicConstraints',
                cA: true
            }, {
                name: 'keyUsage',
                keyCertSign: true,
                digitalSignature: true,
                nonRepudiation: true,
                keyEncipherment: true,
                dataEncipherment: true
            }],
        });
        fs.writeFileSync(keyPath, pems.private);
        fs.writeFileSync(certPath, pems.cert);
        console.log('✅ Сертификаты успешно сгенерированы.');
        privateKey = pems.private;
        certificate = pems.cert;
    } else {
        console.log('🔒 SSL сертификаты найдены. Использую существующие.');
        privateKey = fs.readFileSync(keyPath);
        certificate = fs.readFileSync(certPath);
    }

    const options = {
        key: privateKey,
        cert: certificate
    };

    https.createServer(options, app).listen(PORT, () => {
        console.log(`🚀 Сервер запущен на https://localhost:${PORT}`);
        console.log(`📊 Health check: https://localhost:${PORT}/health`);
        console.log(`📁 Статические файлы обслуживаются из: ${__dirname}`);
        
        if (process.env.NODE_ENV === 'development') {
            console.log(`🔄 Режим разработки: используйте 'npm run dev' для автоматической перезагрузки`);
        }
    });
}

startServer(); // Call the async function to start the server

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Получен сигнал SIGTERM, завершение работы сервера...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Получен сигнал SIGINT, завершение работы сервера...');
    process.exit(0);
}); 