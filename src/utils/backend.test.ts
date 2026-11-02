import test from 'node:test';
import assert from 'node:assert';
import {
  initDatabase,
  dbGetUsers,
  dbGetUserByIdentifier,
  dbInsertUser,
  dbDeleteUser,
  dbGetAnnouncements,
  dbInsertAnnouncement,
  dbDeleteAnnouncement,
  dbGetSchedules,
  dbGetEvents,
  dbGetDocuments,
  dbGetArticles,
  dbGetGallery,
  dbGetLogs,
  dbGetStats,
} from '../../server/db';
import { UserProfile, Announcement } from '../types';

test('Production Database: Initializes tables, seeds data, and retrieves entities', () => {
  initDatabase();

  const users = dbGetUsers();
  assert.ok(users.length >= 7, 'Should have at least 7 seeded staff accounts');

  const admin = dbGetUserByIdentifier('admin');
  assert.ok(admin !== null, 'Admin root account should exist');
  assert.strictEqual(admin.role, 'admin');

  const announcements = dbGetAnnouncements();
  assert.ok(announcements.length >= 3, 'Should have seeded announcements');

  const schedules = dbGetSchedules();
  assert.ok(schedules.length >= 10, 'Should have seeded class schedules');

  const events = dbGetEvents();
  assert.ok(events.length >= 4, 'Should have seeded calendar events');

  const documents = dbGetDocuments();
  assert.ok(documents.length >= 5, 'Should have seeded official documents');

  const articles = dbGetArticles();
  assert.ok(articles.length >= 3, 'Should have seeded news articles');

  const gallery = dbGetGallery();
  assert.ok(gallery.length >= 3, 'Should have seeded gallery items');

  const logs = dbGetLogs();
  assert.ok(logs.length >= 5, 'Should have seeded audit logs');
});

test('Production Database: Performs Announcement CRUD and User Operations', () => {
  initDatabase();

  const testAnnId = `test-ann-${Date.now()}`;
  const testAnn: Announcement = {
    id: testAnnId,
    title: 'Pengumuman Uji Coba Produksi Database',
    slug: 'pengumuman-uji-coba-produksi-database',
    content: 'Pengujian integrasi SQLite dan REST API untuk MI Al-Huda.',
    category: 'Akademik',
    targetAudience: 'Semua',
    isPinned: false,
    publishedAt: '2026-11-03',
    authorName: 'Administrator MI Al-Huda',
    authorRole: 'Admin Madrasah',
    viewsCount: 0,
  };

  dbInsertAnnouncement(testAnn);
  const found = dbGetAnnouncements().find((a) => a.id === testAnnId);
  assert.ok(found !== undefined, 'Inserted announcement should exist in DB');
  assert.strictEqual(found.title, 'Pengumuman Uji Coba Produksi Database');

  dbDeleteAnnouncement(testAnnId);
  const afterDelete = dbGetAnnouncements().find((a) => a.id === testAnnId);
  assert.strictEqual(afterDelete, undefined, 'Announcement should be deleted');
});

test('Production Database: User insertion and deletion', () => {
  initDatabase();

  const testUserId = `test-usr-${Date.now()}`;
  const testUser: UserProfile = {
    id: testUserId,
    name: 'Ustadz Tester Sistem, S.Kom.',
    role: 'guru',
    identifier: '199501012026031001',
    password: 'password123',
    avatarInitials: 'UT',
    email: 'tester@mialhudagorontalo.sch.id',
    status: 'active',
  };

  dbInsertUser(testUser);
  const foundUser = dbGetUserByIdentifier('199501012026031001');
  assert.ok(foundUser !== null, 'User should be found by identifier');
  assert.strictEqual(foundUser.name, 'Ustadz Tester Sistem, S.Kom.');

  dbDeleteUser(testUserId);
  const deletedUser = dbGetUserByIdentifier('199501012026031001');
  assert.strictEqual(deletedUser, null, 'User should be removed from database');
});

test('Production Database: Stats and Engine Health report', () => {
  initDatabase();
  const stats = dbGetStats();

  assert.strictEqual(stats.engine, 'SQLite 3 (node:sqlite DatabaseSync)');
  assert.strictEqual(stats.status, 'online');
  assert.ok(stats.counts.users >= 7);
  assert.ok(stats.counts.announcements >= 3);
});

