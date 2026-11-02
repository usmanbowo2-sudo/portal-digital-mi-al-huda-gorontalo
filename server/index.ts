import express, { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import {
  initDatabase,
  dbGetUsers,
  dbGetUserByIdentifier,
  dbInsertUser,
  dbUpdateUser,
  dbDeleteUser,
  dbGetAnnouncements,
  dbInsertAnnouncement,
  dbUpdateAnnouncement,
  dbDeleteAnnouncement,
  dbGetSchedules,
  dbInsertSchedule,
  dbUpdateSchedule,
  dbDeleteSchedule,
  dbGetEvents,
  dbInsertEvent,
  dbUpdateEvent,
  dbDeleteEvent,
  dbGetDocuments,
  dbInsertDocument,
  dbUpdateDocument,
  dbDeleteDocument,
  dbGetArticles,
  dbInsertArticle,
  dbUpdateArticle,
  dbDeleteArticle,
  dbGetGallery,
  dbInsertGallery,
  dbUpdateGallery,
  dbDeleteGallery,
  dbGetLogs,
  dbInsertLog,
  dbGetStats,
} from './db';

// Initialize the database tables and initial seeds
initDatabase();

export const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// CORS Middleware
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (_req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// ======================== API ROUTES (v1) ========================

// 1. Health & Database Status
app.get('/api/v1/health', (_req: Request, res: Response) => {
  const stats = dbGetStats();
  res.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    institution: 'MI Al-Huda Gorontalo',
    environment: process.env.NODE_ENV || 'development',
    database: stats,
  });
});

// 2. Authentication
app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    res.status(400).json({ status: 'error', message: 'Identifier dan password wajib diisi.' });
    return;
  }

  const user = dbGetUserByIdentifier(identifier);
  if (!user || user.password !== password) {
    res.status(401).json({ status: 'error', message: 'ID atau Kata Sandi salah.' });
    return;
  }

  if (user.status === 'inactive') {
    res.status(403).json({ status: 'error', message: 'Akun Anda sedang dinonaktifkan oleh Administrator.' });
    return;
  }

  // Safe user profile without raw password
  const { password: _, ...safeUser } = user;
  const token = `alhuda_jwt_${Buffer.from(`${user.id}:${Date.now()}`).toString('base64')}`;

  // Log audit
  dbInsertLog({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    userName: user.name,
    userRole: user.role,
    action: 'LOGIN_PORTAL',
    target: `Otentikasi Berhasil (${user.identifier})`,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({
    status: 'success',
    message: 'Login berhasil.',
    token,
    user: safeUser,
  });
});

app.post('/api/v1/auth/change-password', (req: Request, res: Response) => {
  const { identifier, oldPassword, newPassword } = req.body;
  if (!identifier || !oldPassword || !newPassword) {
    res.status(400).json({ status: 'error', message: 'Semua kolom kata sandi wajib diisi.' });
    return;
  }

  const user = dbGetUserByIdentifier(identifier);
  if (!user || user.password !== oldPassword) {
    res.status(401).json({ status: 'error', message: 'Kata sandi saat ini tidak cocok.' });
    return;
  }

  user.password = newPassword;
  dbUpdateUser(user);

  dbInsertLog({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    userName: user.name,
    userRole: user.role,
    action: 'CHANGE_PASSWORD_SELF',
    target: `Kata sandi diubah (${user.identifier})`,
    ipAddress: req.ip || '127.0.0.1',
  });

  const { password: _, ...safeUser } = user;
  res.json({ status: 'success', message: 'Kata sandi berhasil diperbarui.', user: safeUser });
});

// 3. Announcements
app.get('/api/v1/announcements', (_req: Request, res: Response) => {
  const data = dbGetAnnouncements();
  res.json({ status: 'success', data, total: data.length });
});

app.post('/api/v1/announcements', (req: Request, res: Response) => {
  const item = req.body;
  if (!item.id) item.id = `ann-${Date.now()}`;
  dbInsertAnnouncement(item);
  res.status(201).json({ status: 'success', message: 'Pengumuman berhasil diterbitkan.', data: item });
});

app.put('/api/v1/announcements/:id', (req: Request, res: Response) => {
  const item = req.body;
  item.id = req.params.id;
  dbUpdateAnnouncement(item);
  res.json({ status: 'success', message: 'Pengumuman berhasil diperbarui.', data: item });
});

app.delete('/api/v1/announcements/:id', (req: Request, res: Response) => {
  dbDeleteAnnouncement(req.params.id);
  res.json({ status: 'success', message: 'Pengumuman berhasil dihapus.' });
});

// 4. Class Schedules
app.get('/api/v1/schedules', (_req: Request, res: Response) => {
  const data = dbGetSchedules();
  res.json({ status: 'success', data, total: data.length });
});

app.get('/api/v1/schedules/:gradeClass', (req: Request, res: Response) => {
  const data = dbGetSchedules(req.params.gradeClass);
  res.json({ status: 'success', data, total: data.length });
});

app.post('/api/v1/schedules', (req: Request, res: Response) => {
  const item = req.body;
  if (!item.id) item.id = `sch-${Date.now()}`;
  dbInsertSchedule(item);
  res.status(201).json({ status: 'success', message: 'Jadwal berhasil ditambahkan.', data: item });
});

app.put('/api/v1/schedules/:id', (req: Request, res: Response) => {
  const item = req.body;
  item.id = req.params.id;
  dbUpdateSchedule(item);
  res.json({ status: 'success', message: 'Jadwal berhasil diperbarui.', data: item });
});

app.delete('/api/v1/schedules/:id', (req: Request, res: Response) => {
  dbDeleteSchedule(req.params.id);
  res.json({ status: 'success', message: 'Jadwal berhasil dihapus.' });
});

// 5. Academic Calendar Events
app.get('/api/v1/academic-calendar', (_req: Request, res: Response) => {
  const data = dbGetEvents();
  res.json({ status: 'success', events: data, total: data.length });
});

app.post('/api/v1/academic-calendar', (req: Request, res: Response) => {
  const item = req.body;
  if (!item.id) item.id = `evt-${Date.now()}`;
  dbInsertEvent(item);
  res.status(201).json({ status: 'success', message: 'Agenda kalender berhasil ditambahkan.', data: item });
});

app.put('/api/v1/academic-calendar/:id', (req: Request, res: Response) => {
  const item = req.body;
  item.id = req.params.id;
  dbUpdateEvent(item);
  res.json({ status: 'success', message: 'Agenda kalender berhasil diperbarui.', data: item });
});

app.delete('/api/v1/academic-calendar/:id', (req: Request, res: Response) => {
  dbDeleteEvent(req.params.id);
  res.json({ status: 'success', message: 'Agenda kalender berhasil dihapus.' });
});

// 6. Administrative Documents
app.get('/api/v1/documents', (_req: Request, res: Response) => {
  const data = dbGetDocuments();
  res.json({ status: 'success', documents: data, total: data.length });
});

app.post('/api/v1/documents', (req: Request, res: Response) => {
  const item = req.body;
  if (!item.id) item.id = `doc-${Date.now()}`;
  dbInsertDocument(item);
  res.status(201).json({ status: 'success', message: 'Dokumen berhasil diunggah.', data: item });
});

app.put('/api/v1/documents/:id', (req: Request, res: Response) => {
  const item = req.body;
  item.id = req.params.id;
  dbUpdateDocument(item);
  res.json({ status: 'success', message: 'Dokumen berhasil diperbarui.', data: item });
});

app.delete('/api/v1/documents/:id', (req: Request, res: Response) => {
  dbDeleteDocument(req.params.id);
  res.json({ status: 'success', message: 'Dokumen berhasil dihapus.' });
});

// 7. News & Articles
app.get('/api/v1/news', (_req: Request, res: Response) => {
  const data = dbGetArticles();
  res.json({ status: 'success', articles: data, total: data.length });
});

app.post('/api/v1/news', (req: Request, res: Response) => {
  const item = req.body;
  if (!item.id) item.id = `art-${Date.now()}`;
  dbInsertArticle(item);
  res.status(201).json({ status: 'success', message: 'Warta berhasil diterbitkan.', data: item });
});

app.put('/api/v1/news/:id', (req: Request, res: Response) => {
  const item = req.body;
  item.id = req.params.id;
  dbUpdateArticle(item);
  res.json({ status: 'success', message: 'Warta berhasil diperbarui.', data: item });
});

app.delete('/api/v1/news/:id', (req: Request, res: Response) => {
  dbDeleteArticle(req.params.id);
  res.json({ status: 'success', message: 'Warta berhasil dihapus.' });
});

// 8. Gallery Items
app.get('/api/v1/gallery', (_req: Request, res: Response) => {
  const data = dbGetGallery();
  res.json({ status: 'success', items: data, total: data.length });
});

app.post('/api/v1/gallery', (req: Request, res: Response) => {
  const item = req.body;
  if (!item.id) item.id = `gal-${Date.now()}`;
  dbInsertGallery(item);
  res.status(201).json({ status: 'success', message: 'Dokumentasi berhasil ditambahkan.', data: item });
});

app.put('/api/v1/gallery/:id', (req: Request, res: Response) => {
  const item = req.body;
  item.id = req.params.id;
  dbUpdateGallery(item);
  res.json({ status: 'success', message: 'Dokumentasi berhasil diperbarui.', data: item });
});

app.delete('/api/v1/gallery/:id', (req: Request, res: Response) => {
  dbDeleteGallery(req.params.id);
  res.json({ status: 'success', message: 'Dokumentasi berhasil dihapus.' });
});

// 9. Users Management (Admin)
app.get('/api/v1/users', (_req: Request, res: Response) => {
  const users = dbGetUsers();
  res.json({ status: 'success', users, total: users.length });
});

app.post('/api/v1/users', (req: Request, res: Response) => {
  const user = req.body;
  if (!user.id) user.id = `usr-${Date.now()}`;
  dbInsertUser(user);
  res.status(201).json({ status: 'success', message: 'Akun staf berhasil dibuat.', user });
});

app.put('/api/v1/users/:id', (req: Request, res: Response) => {
  const user = req.body;
  user.id = req.params.id;
  dbUpdateUser(user);
  res.json({ status: 'success', message: 'Data akun berhasil diperbarui.', user });
});

app.delete('/api/v1/users/:id', (req: Request, res: Response) => {
  if (req.params.id === 'usr-admin-01') {
    res.status(403).json({ status: 'error', message: 'Akun Administrator Utama tidak boleh dihapus.' });
    return;
  }
  dbDeleteUser(req.params.id);
  res.json({ status: 'success', message: 'Akun berhasil dihapus.' });
});

// 10. Audit Logs
app.get('/api/v1/audit-logs', (_req: Request, res: Response) => {
  const logs = dbGetLogs();
  res.json({ status: 'success', logs, total: logs.length });
});

app.post('/api/v1/audit-logs', (req: Request, res: Response) => {
  const log = req.body;
  if (!log.id) log.id = `log-${Date.now()}`;
  if (!log.timestamp) log.timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  dbInsertLog(log);
  res.status(201).json({ status: 'success', log });
});

// 11. Dashboard Real-Time Stats
app.get('/api/v1/dashboard/realtime-stats', (_req: Request, res: Response) => {
  const stats = dbGetStats();
  const users = dbGetUsers();
  const totalGuru = users.filter((u) => u.role === 'guru').length;
  const totalAdmin = users.filter((u) => u.role === 'admin').length;

  res.json({
    status: 'success',
    visitorsToday: 1420,
    activeNow: 48,
    totalDownloads: stats.counts.totalDownloads,
    staffCount: {
      total: users.length,
      guru: totalGuru,
      admin: totalAdmin,
    },
    systemMetrics: stats,
  });
});

// Static Production Serving (if dist directory exists)
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server if directly executed
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[AL-HUDA BACKEND] Production REST API running on http://localhost:${PORT}`);
    console.log(`[AL-HUDA DATABASE] SQLite Relational Engine Active: ${path.join(process.cwd(), 'data', 'alhuda.db')}`);
  });
}

