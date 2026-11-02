import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hasRoleAccess,
  canManageContent,
  validateNewUser,
  validateEditUser,
  filterAnnouncements,
  editUserAccount,
  deleteUserAccount,
  changeSelfPassword,
  generateKeyCode,
  validateKeyCode,
  generateOtpCode,
  validateOtpAndResetPassword,
} from './portalLogic';
import { UserProfile, Announcement } from '../types';

test('hasRoleAccess and canManageContent - Admin and Dewan Guru have full CRUD across content modules', () => {
  // Admin permissions
  assert.equal(hasRoleAccess('admin', 'view_realtime_analytics'), true);
  assert.equal(hasRoleAccess('admin', 'manage_users'), true);
  assert.equal(hasRoleAccess('admin', 'publish_announcement'), true);
  assert.equal(hasRoleAccess('admin', 'edit_announcement'), true);
  assert.equal(hasRoleAccess('admin', 'delete_announcement'), true);
  assert.equal(hasRoleAccess('admin', 'manage_schedules'), true);
  assert.equal(hasRoleAccess('admin', 'manage_documents'), true);
  assert.equal(hasRoleAccess('admin', 'manage_gallery'), true);
  assert.equal(canManageContent('admin'), true);

  // Dewan Guru permissions (Full CRUD across school modules, restricted on user management)
  assert.equal(hasRoleAccess('guru', 'publish_announcement'), true);
  assert.equal(hasRoleAccess('guru', 'edit_announcement'), true);
  assert.equal(hasRoleAccess('guru', 'delete_announcement'), true);
  assert.equal(hasRoleAccess('guru', 'publish_news'), true);
  assert.equal(hasRoleAccess('guru', 'edit_news'), true);
  assert.equal(hasRoleAccess('guru', 'delete_news'), true);
  assert.equal(hasRoleAccess('guru', 'manage_schedules'), true);
  assert.equal(hasRoleAccess('guru', 'manage_documents'), true);
  assert.equal(hasRoleAccess('guru', 'manage_gallery'), true);
  assert.equal(hasRoleAccess('guru', 'manage_users'), false);
  assert.equal(hasRoleAccess('guru', 'view_realtime_analytics'), false);
  assert.equal(canManageContent('guru'), true);

  // Siswa and Tamu (No management permissions)
  assert.equal(canManageContent('siswa'), false);
  assert.equal(canManageContent('tamu'), false);
  assert.equal(hasRoleAccess('tamu', 'view_public'), true);
  assert.equal(hasRoleAccess('tamu', 'publish_announcement'), false);
});

test('generateKeyCode & validateKeyCode - generates and verifies login security code with 60s rotation', () => {
  const code = generateKeyCode();
  assert.ok(code.startsWith('ALH-'));
  assert.equal(validateKeyCode(code, code), true);
  assert.equal(validateKeyCode(code.toLowerCase(), code), true);
  assert.equal(validateKeyCode('WRONG-CODE', code), false);
  assert.equal(validateKeyCode('', code), false);
});

test('generateOtpCode - generates 6 digit numeric code', () => {
  const otp = generateOtpCode();
  assert.equal(otp.length, 6);
  assert.match(otp, /^\d{6}$/);
});

test('validateNewUser & validateEditUser - validates staff inputs and uniqueness', () => {
  const existingUsers: UserProfile[] = [
    {
      id: 'usr-guru-01',
      name: 'Ustadz Farhan Gobel, S.Pd.',
      role: 'guru',
      identifier: '198904152014021003',
      avatarInitials: 'FG',
      email: 'farhan@mialhudagorontalo.sch.id',
      status: 'active',
    },
  ];

  // Invalid length
  const invalid = validateNewUser({
    name: 'Al',
    identifier: '12',
    role: 'guru',
  });
  assert.equal(invalid.isValid, false);

  // Valid new teacher
  const valid = validateNewUser({
    name: 'Ustadzah Sitti Fatimah, M.Pd.',
    identifier: '198701242011012015',
    role: 'guru',
    email: 'sitti@mialhudagorontalo.sch.id',
  });
  assert.equal(valid.isValid, true);

  // Duplicate identifier on edit
  const dupEdit = validateEditUser(existingUsers, {
    id: 'usr-guru-99',
    identifier: '198904152014021003',
  });
  assert.equal(dupEdit.isValid, false);
});

test('deleteUserAccount - deletes user but protects primary admin and active account', () => {
  const users: UserProfile[] = [
    { id: 'usr-admin-01', name: 'Admin Madrasah', role: 'admin', identifier: 'admin', avatarInitials: 'AM', email: 'admin@mi.id', status: 'active' },
    { id: 'usr-guru-01', name: 'Ustadz Farhan', role: 'guru', identifier: 'G01', avatarInitials: 'UF', email: 'guru@mi.id', status: 'active' },
  ];

  // Cannot delete admin
  const resAdmin = deleteUserAccount(users, 'usr-admin-01', 'usr-guru-01');
  assert.equal(resAdmin.success, false);

  // Can delete teacher
  const resGuru = deleteUserAccount(users, 'usr-guru-01', 'usr-admin-01');
  assert.equal(resGuru.success, true);
  assert.equal(resGuru.users.length, 1);
});

test('changeSelfPassword - validates old and new password matching', () => {
  const user: UserProfile = {
    id: 'usr-guru-01',
    name: 'Ustadz Farhan',
    role: 'guru',
    identifier: '198904152014021003',
    password: 'oldpass123',
    avatarInitials: 'FG',
    email: 'guru@mi.id',
    status: 'active',
  };

  const failOld = changeSelfPassword(user, 'wrongpass', 'newpass123', 'newpass123');
  assert.equal(failOld.success, false);

  const failConfirm = changeSelfPassword(user, 'oldpass123', 'newpass123', 'different');
  assert.equal(failConfirm.success, false);

  const success = changeSelfPassword(user, 'oldpass123', 'newpass123', 'newpass123');
  assert.equal(success.success, true);
  assert.equal(success.updatedUser?.password, 'newpass123');
});

test('generateRealDocument - generates valid downloadable PDF, Word, and Excel blobs', async () => {
  const { generateRealDocument } = await import('./documentGenerator');

  // PDF Generation
  const pdfDoc = generateRealDocument('doc-01', 'Formulir PPDB 2026', 'PDF');
  assert.ok(pdfDoc.filename.endsWith('.pdf'));
  assert.equal(pdfDoc.mimeType, 'application/pdf');
  assert.ok(pdfDoc.blob.size > 100);

  // Word Generation
  const wordDoc = generateRealDocument('doc-03', 'Surat Izin Santri', 'DOCX');
  assert.ok(wordDoc.filename.endsWith('.doc'));
  assert.equal(wordDoc.mimeType, 'application/msword');
  assert.ok(wordDoc.blob.size > 200);

  // Excel Generation
  const excelDoc = generateRealDocument('doc-06', 'Rekapitulasi Nilai Santri', 'XLSX');
  assert.ok(excelDoc.filename.endsWith('.csv'));
  assert.ok(excelDoc.blob.size > 150);
});
