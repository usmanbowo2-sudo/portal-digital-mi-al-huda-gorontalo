import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import {
  INITIAL_USER_ACCOUNTS,
  INITIAL_ANNOUNCEMENTS,
  SCHEDULE_DATABASE,
  ACADEMIC_EVENTS,
  ADMIN_DOCUMENTS,
  NEWS_ARTICLES,
  GALLERY_ITEMS,
  INITIAL_AUDIT_LOGS,
} from '../src/data/mockData';
import {
  UserProfile,
  Announcement,
  ScheduleItem,
  AcademicEvent,
  AdminDocument,
  NewsArticle,
  GalleryItem,
  AuditLog,
} from '../src/types';

// Ensure data folder exists
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'alhuda.db');
export const db = new DatabaseSync(dbPath);

// Enable WAL mode for high performance concurrency
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA synchronous = NORMAL;');

export function initDatabase() {
  // 1. Table users
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      identifier TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      avatar_initials TEXT,
      grade TEXT,
      email TEXT,
      phone TEXT,
      subject_or_position TEXT,
      status TEXT DEFAULT 'active'
    );
  `);

  // 2. Table announcements
  db.exec(`
    CREATE TABLE IF NOT EXISTS announcements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      target_audience TEXT NOT NULL,
      is_pinned INTEGER DEFAULT 0,
      published_at TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_role TEXT NOT NULL,
      attachments_json TEXT,
      views_count INTEGER DEFAULT 0
    );
  `);

  // 3. Table schedules
  db.exec(`
    CREATE TABLE IF NOT EXISTS schedules (
      id TEXT PRIMARY KEY,
      grade TEXT NOT NULL,
      day TEXT NOT NULL,
      period INTEGER NOT NULL,
      time_slot TEXT NOT NULL,
      subject TEXT NOT NULL,
      teacher_name TEXT NOT NULL,
      room TEXT NOT NULL,
      is_religious INTEGER DEFAULT 0
    );
  `);

  // 4. Table academic_events
  db.exec(`
    CREATE TABLE IF NOT EXISTS academic_events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date_start TEXT NOT NULL,
      date_end TEXT,
      category TEXT NOT NULL,
      category_label TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT
    );
  `);

  // 5. Table documents
  db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      code TEXT NOT NULL,
      category TEXT NOT NULL,
      file_format TEXT NOT NULL,
      file_size TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      download_count INTEGER DEFAULT 0,
      description TEXT NOT NULL,
      original_file_name TEXT
    );
  `);

  // 6. Table articles
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      author_nip TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT DEFAULT 'published',
      published_at TEXT NOT NULL,
      read_time TEXT NOT NULL,
      thumbnail_theme TEXT NOT NULL
    );
  `);

  // 7. Table gallery
  db.exec(`
    CREATE TABLE IF NOT EXISTS gallery (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      description TEXT NOT NULL,
      color_gradient TEXT NOT NULL,
      icon_name TEXT NOT NULL,
      image_url TEXT
    );
  `);

  // 8. Table audit_logs
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      user_name TEXT NOT NULL,
      user_role TEXT NOT NULL,
      action TEXT NOT NULL,
      target TEXT NOT NULL,
      ip_address TEXT NOT NULL
    );
  `);

  // Auto-seed if empty
  seedDatabaseIfEmpty();
}

function seedDatabaseIfEmpty() {
  const userCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
  if (userCount > 0) {
    return; // Already seeded
  }

  // Seed Users
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, role, identifier, password, avatar_initials, grade, email, phone, subject_or_position, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const u of INITIAL_USER_ACCOUNTS) {
    insertUser.run(
      u.id,
      u.name,
      u.role,
      u.identifier,
      u.password || '123456',
      u.avatarInitials,
      u.grade || '',
      u.email,
      u.phone || '',
      u.subjectOrPosition || '',
      u.status
    );
  }

  // Seed Announcements
  const insertAnn = db.prepare(`
    INSERT INTO announcements (id, title, slug, content, category, target_audience, is_pinned, published_at, author_name, author_role, attachments_json, views_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const a of INITIAL_ANNOUNCEMENTS) {
    insertAnn.run(
      a.id,
      a.title,
      a.slug,
      a.content,
      a.category,
      a.targetAudience,
      a.isPinned ? 1 : 0,
      a.publishedAt,
      a.authorName,
      a.authorRole,
      a.attachments ? JSON.stringify(a.attachments) : '[]',
      a.viewsCount
    );
  }

  // Seed Schedules
  const insertSched = db.prepare(`
    INSERT INTO schedules (id, grade, day, period, time_slot, subject, teacher_name, room, is_religious)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const s of SCHEDULE_DATABASE) {
    insertSched.run(
      s.id,
      s.grade,
      s.day,
      s.period,
      s.timeSlot,
      s.subject,
      s.teacherName,
      s.room,
      s.isReligious ? 1 : 0
    );
  }

  // Seed Academic Events
  const insertEvent = db.prepare(`
    INSERT INTO academic_events (id, title, date_start, date_end, category, category_label, description, location)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const e of ACADEMIC_EVENTS) {
    insertEvent.run(
      e.id,
      e.title,
      e.dateStart,
      e.dateEnd || null,
      e.category,
      e.categoryLabel,
      e.description,
      e.location || ''
    );
  }

  // Seed Documents
  const insertDoc = db.prepare(`
    INSERT INTO documents (id, title, code, category, file_format, file_size, updated_at, download_count, description, original_file_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const d of ADMIN_DOCUMENTS) {
    insertDoc.run(
      d.id,
      d.title,
      d.code,
      d.category,
      d.fileFormat,
      d.fileSize,
      d.updatedAt,
      d.downloadCount,
      d.description,
      d.originalFileName || ''
    );
  }

  // Seed Articles
  const insertArt = db.prepare(`
    INSERT INTO articles (id, title, slug, excerpt, content, author, author_nip, category, status, published_at, read_time, thumbnail_theme)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const art of NEWS_ARTICLES) {
    insertArt.run(
      art.id,
      art.title,
      art.slug,
      art.excerpt,
      art.content,
      art.author,
      art.authorNip,
      art.category,
      art.status,
      art.publishedAt,
      art.readTime,
      art.thumbnailTheme
    );
  }

  // Seed Gallery
  const insertGal = db.prepare(`
    INSERT INTO gallery (id, title, category, date, description, color_gradient, icon_name, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const g of GALLERY_ITEMS) {
    insertGal.run(
      g.id,
      g.title,
      g.category,
      g.date,
      g.description,
      g.colorGradient,
      g.iconName,
      g.imageUrl || null
    );
  }

  // Seed Audit Logs
  const insertLog = db.prepare(`
    INSERT INTO audit_logs (id, timestamp, user_name, user_role, action, target, ip_address)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const l of INITIAL_AUDIT_LOGS) {
    insertLog.run(
      l.id,
      l.timestamp,
      l.userName,
      l.userRole,
      l.action,
      l.target,
      l.ipAddress
    );
  }
}

// ======================== QUERY REPOSITORIES ========================

// Users
export function dbGetUsers(): UserProfile[] {
  const rows = db.prepare("SELECT * FROM users ORDER BY (role = 'admin') DESC, name ASC").all() as any[];
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    role: r.role,
    identifier: r.identifier,
    password: r.password,
    avatarInitials: r.avatar_initials,
    grade: r.grade,
    email: r.email,
    phone: r.phone,
    subjectOrPosition: r.subject_or_position,
    status: r.status,
  }));
}

export function dbGetUserByIdentifier(identifier: string): UserProfile | null {
  const r = db.prepare('SELECT * FROM users WHERE identifier = ?').get(identifier) as any;
  if (!r) return null;
  return {
    id: r.id,
    name: r.name,
    role: r.role,
    identifier: r.identifier,
    password: r.password,
    avatarInitials: r.avatar_initials,
    grade: r.grade,
    email: r.email,
    phone: r.phone,
    subjectOrPosition: r.subject_or_position,
    status: r.status,
  };
}

export function dbInsertUser(u: UserProfile) {
  return db.prepare(`
    INSERT INTO users (id, name, role, identifier, password, avatar_initials, grade, email, phone, subject_or_position, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    u.id,
    u.name,
    u.role,
    u.identifier,
    u.password || '123456',
    u.avatarInitials,
    u.grade || '',
    u.email,
    u.phone || '',
    u.subjectOrPosition || '',
    u.status
  );
}

export function dbUpdateUser(u: UserProfile) {
  return db.prepare(`
    UPDATE users SET
      name = ?,
      role = ?,
      identifier = ?,
      avatar_initials = ?,
      grade = ?,
      email = ?,
      phone = ?,
      subject_or_position = ?,
      status = ?,
      password = COALESCE(?, password)
    WHERE id = ?
  `).run(
    u.name,
    u.role,
    u.identifier,
    u.avatarInitials,
    u.grade || '',
    u.email,
    u.phone || '',
    u.subjectOrPosition || '',
    u.status,
    u.password || null,
    u.id
  );
}

export function dbDeleteUser(id: string) {
  return db.prepare('DELETE FROM users WHERE id = ?').run(id);
}

// Announcements
export function dbGetAnnouncements(): Announcement[] {
  const rows = db.prepare('SELECT * FROM announcements ORDER BY is_pinned DESC, published_at DESC').all() as any[];
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    content: r.content,
    category: r.category,
    targetAudience: r.target_audience,
    isPinned: Boolean(r.is_pinned),
    publishedAt: r.published_at,
    authorName: r.author_name,
    authorRole: r.author_role,
    attachments: r.attachments_json ? JSON.parse(r.attachments_json) : [],
    viewsCount: Number(r.views_count),
  }));
}

export function dbInsertAnnouncement(a: Announcement) {
  return db.prepare(`
    INSERT INTO announcements (id, title, slug, content, category, target_audience, is_pinned, published_at, author_name, author_role, attachments_json, views_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    a.id,
    a.title,
    a.slug,
    a.content,
    a.category,
    a.targetAudience,
    a.isPinned ? 1 : 0,
    a.publishedAt,
    a.authorName,
    a.authorRole,
    a.attachments ? JSON.stringify(a.attachments) : '[]',
    a.viewsCount || 0
  );
}

export function dbUpdateAnnouncement(a: Announcement) {
  return db.prepare(`
    UPDATE announcements SET
      title = ?,
      slug = ?,
      content = ?,
      category = ?,
      target_audience = ?,
      is_pinned = ?,
      published_at = ?,
      author_name = ?,
      author_role = ?,
      attachments_json = ?,
      views_count = ?
    WHERE id = ?
  `).run(
    a.title,
    a.slug,
    a.content,
    a.category,
    a.targetAudience,
    a.isPinned ? 1 : 0,
    a.publishedAt,
    a.authorName,
    a.authorRole,
    a.attachments ? JSON.stringify(a.attachments) : '[]',
    a.viewsCount,
    a.id
  );
}

export function dbDeleteAnnouncement(id: string) {
  return db.prepare('DELETE FROM announcements WHERE id = ?').run(id);
}

// Schedules
export function dbGetSchedules(grade?: string): ScheduleItem[] {
  let query = 'SELECT * FROM schedules';
  const params: any[] = [];
  if (grade) {
    query += ' WHERE grade = ?';
    params.push(grade);
  }
  query += ' ORDER BY grade ASC, period ASC';
  const rows = db.prepare(query).all(...params) as any[];
  return rows.map((r) => ({
    id: r.id,
    grade: r.grade,
    day: r.day,
    period: Number(r.period),
    timeSlot: r.time_slot,
    subject: r.subject,
    teacherName: r.teacher_name,
    room: r.room,
    isReligious: Boolean(r.is_religious),
  }));
}

export function dbInsertSchedule(s: ScheduleItem) {
  return db.prepare(`
    INSERT INTO schedules (id, grade, day, period, time_slot, subject, teacher_name, room, is_religious)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    s.id,
    s.grade,
    s.day,
    s.period,
    s.timeSlot,
    s.subject,
    s.teacherName,
    s.room,
    s.isReligious ? 1 : 0
  );
}

export function dbUpdateSchedule(s: ScheduleItem) {
  return db.prepare(`
    UPDATE schedules SET
      grade = ?,
      day = ?,
      period = ?,
      time_slot = ?,
      subject = ?,
      teacher_name = ?,
      room = ?,
      is_religious = ?
    WHERE id = ?
  `).run(
    s.grade,
    s.day,
    s.period,
    s.timeSlot,
    s.subject,
    s.teacherName,
    s.room,
    s.isReligious ? 1 : 0,
    s.id
  );
}

export function dbDeleteSchedule(id: string) {
  return db.prepare('DELETE FROM schedules WHERE id = ?').run(id);
}

// Academic Calendar Events
export function dbGetEvents(): AcademicEvent[] {
  const rows = db.prepare('SELECT * FROM academic_events ORDER BY date_start ASC').all() as any[];
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    dateStart: r.date_start,
    dateEnd: r.date_end || undefined,
    category: r.category,
    categoryLabel: r.category_label,
    description: r.description,
    location: r.location || undefined,
  }));
}

export function dbInsertEvent(e: AcademicEvent) {
  return db.prepare(`
    INSERT INTO academic_events (id, title, date_start, date_end, category, category_label, description, location)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    e.id,
    e.title,
    e.dateStart,
    e.dateEnd || null,
    e.category,
    e.categoryLabel,
    e.description,
    e.location || ''
  );
}

export function dbUpdateEvent(e: AcademicEvent) {
  return db.prepare(`
    UPDATE academic_events SET
      title = ?,
      date_start = ?,
      date_end = ?,
      category = ?,
      category_label = ?,
      description = ?,
      location = ?
    WHERE id = ?
  `).run(
    e.title,
    e.dateStart,
    e.dateEnd || null,
    e.category,
    e.categoryLabel,
    e.description,
    e.location || '',
    e.id
  );
}

export function dbDeleteEvent(id: string) {
  return db.prepare('DELETE FROM academic_events WHERE id = ?').run(id);
}

// Administrative Documents
export function dbGetDocuments(): AdminDocument[] {
  const rows = db.prepare('SELECT * FROM documents ORDER BY updated_at DESC').all() as any[];
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    code: r.code,
    category: r.category,
    fileFormat: r.file_format,
    fileSize: r.file_size,
    updatedAt: r.updated_at,
    downloadCount: Number(r.download_count),
    description: r.description,
    originalFileName: r.original_file_name || undefined,
  }));
}

export function dbInsertDocument(d: AdminDocument) {
  return db.prepare(`
    INSERT INTO documents (id, title, code, category, file_format, file_size, updated_at, download_count, description, original_file_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    d.id,
    d.title,
    d.code,
    d.category,
    d.fileFormat,
    d.fileSize,
    d.updatedAt,
    d.downloadCount || 0,
    d.description,
    d.originalFileName || ''
  );
}

export function dbUpdateDocument(d: AdminDocument) {
  return db.prepare(`
    UPDATE documents SET
      title = ?,
      code = ?,
      category = ?,
      file_format = ?,
      file_size = ?,
      updated_at = ?,
      download_count = ?,
      description = ?,
      original_file_name = ?
    WHERE id = ?
  `).run(
    d.title,
    d.code,
    d.category,
    d.fileFormat,
    d.fileSize,
    d.updatedAt,
    d.downloadCount,
    d.description,
    d.originalFileName || '',
    d.id
  );
}

export function dbDeleteDocument(id: string) {
  return db.prepare('DELETE FROM documents WHERE id = ?').run(id);
}

// News Articles
export function dbGetArticles(): NewsArticle[] {
  const rows = db.prepare('SELECT * FROM articles ORDER BY published_at DESC').all() as any[];
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt,
    content: r.content,
    author: r.author,
    authorNip: r.author_nip,
    category: r.category,
    status: r.status,
    publishedAt: r.published_at,
    readTime: r.read_time,
    thumbnailTheme: r.thumbnail_theme,
  }));
}

export function dbInsertArticle(a: NewsArticle) {
  return db.prepare(`
    INSERT INTO articles (id, title, slug, excerpt, content, author, author_nip, category, status, published_at, read_time, thumbnail_theme)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    a.id,
    a.title,
    a.slug,
    a.excerpt,
    a.content,
    a.author,
    a.authorNip,
    a.category,
    a.status,
    a.publishedAt,
    a.readTime,
    a.thumbnailTheme
  );
}

export function dbUpdateArticle(a: NewsArticle) {
  return db.prepare(`
    UPDATE articles SET
      title = ?,
      slug = ?,
      excerpt = ?,
      content = ?,
      author = ?,
      author_nip = ?,
      category = ?,
      status = ?,
      published_at = ?,
      read_time = ?,
      thumbnail_theme = ?
    WHERE id = ?
  `).run(
    a.title,
    a.slug,
    a.excerpt,
    a.content,
    a.author,
    a.authorNip,
    a.category,
    a.status,
    a.publishedAt,
    a.readTime,
    a.thumbnailTheme,
    a.id
  );
}

export function dbDeleteArticle(id: string) {
  return db.prepare('DELETE FROM articles WHERE id = ?').run(id);
}

// Gallery Items
export function dbGetGallery(): GalleryItem[] {
  const rows = db.prepare('SELECT * FROM gallery ORDER BY date DESC').all() as any[];
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    category: r.category,
    date: r.date,
    description: r.description,
    colorGradient: r.color_gradient,
    iconName: r.icon_name,
    imageUrl: r.image_url || undefined,
  }));
}

export function dbInsertGallery(g: GalleryItem) {
  return db.prepare(`
    INSERT INTO gallery (id, title, category, date, description, color_gradient, icon_name, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    g.id,
    g.title,
    g.category,
    g.date,
    g.description,
    g.colorGradient,
    g.iconName,
    g.imageUrl || null
  );
}

export function dbUpdateGallery(g: GalleryItem) {
  return db.prepare(`
    UPDATE gallery SET
      title = ?,
      category = ?,
      date = ?,
      description = ?,
      color_gradient = ?,
      icon_name = ?,
      image_url = ?
    WHERE id = ?
  `).run(
    g.title,
    g.category,
    g.date,
    g.description,
    g.colorGradient,
    g.iconName,
    g.imageUrl || null,
    g.id
  );
}

export function dbDeleteGallery(id: string) {
  return db.prepare('DELETE FROM gallery WHERE id = ?').run(id);
}

// Audit Logs
export function dbGetLogs(): AuditLog[] {
  const rows = db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100').all() as any[];
  return rows.map((r) => ({
    id: r.id,
    timestamp: r.timestamp,
    userName: r.user_name,
    userRole: r.user_role,
    action: r.action,
    target: r.target,
    ipAddress: r.ip_address,
  }));
}

export function dbInsertLog(l: AuditLog) {
  return db.prepare(`
    INSERT INTO audit_logs (id, timestamp, user_name, user_role, action, target, ip_address)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    l.id,
    l.timestamp,
    l.userName,
    l.userRole,
    l.action,
    l.target,
    l.ipAddress
  );
}

// Database stats
export function dbGetStats() {
  const userCount = (db.prepare('SELECT COUNT(*) as c FROM users').get() as any).c;
  const annCount = (db.prepare('SELECT COUNT(*) as c FROM announcements').get() as any).c;
  const schedCount = (db.prepare('SELECT COUNT(*) as c FROM schedules').get() as any).c;
  const docCount = (db.prepare('SELECT COUNT(*) as c FROM documents').get() as any).c;
  const artCount = (db.prepare('SELECT COUNT(*) as c FROM articles').get() as any).c;
  const galCount = (db.prepare('SELECT COUNT(*) as c FROM gallery').get() as any).c;
  const logCount = (db.prepare('SELECT COUNT(*) as c FROM audit_logs').get() as any).c;
  const totalDownloads = (db.prepare('SELECT COALESCE(SUM(download_count), 0) as s FROM documents').get() as any).s;

  return {
    engine: 'SQLite 3 (node:sqlite DatabaseSync)',
    status: 'online',
    counts: {
      users: userCount,
      announcements: annCount,
      schedules: schedCount,
      documents: docCount,
      articles: artCount,
      gallery: galCount,
      auditLogs: logCount,
      totalDownloads,
    },
  };
}
