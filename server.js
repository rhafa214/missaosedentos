import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;
const cwd = process.cwd();

// Serve all files in the current directory as static assets
app.use(express.static(cwd));

// SPA fallback for index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(cwd, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
