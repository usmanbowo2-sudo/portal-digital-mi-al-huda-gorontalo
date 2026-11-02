import { UserRole, UserProfile, Announcement } from '../types';

/**
 * Checks role-based access for system permissions.
 * Admin and Guru have full CRUD across content modules (announcements, news, documents, schedules, calendar, gallery).
 */
export function hasRoleAccess(role: UserRole, permission: string): boolean {
  switch (permission) {
    case 'view_public':
    case 'view_schedule_calendar':
    case 'view_documents':
    case 'view_gallery':
      return true;

    case 'manage_content':
    case 'publish_announcement':
    case 'edit_announcement':
    case 'delete_announcement':
    case 'publish_news':
    case 'edit_news':
    case 'delete_news':
    case 'manage_schedules':
    case 'manage_calendar':
    case 'manage_documents':
    case 'manage_gallery':
      return role === 'admin' || role === 'guru';

    case 'manage_users':
    case 'view_realtime_analytics':
    case 'view_audit_logs':
      return role === 'admin';

    default:
      return false;
  }
}

/**
 * Convenience helper to determine if current role can perform CRUD on school modules
 */
export function canManageContent(role: UserRole): boolean {
  return role === 'admin' || role === 'guru';
}

export function filterAnnouncements(
  items: Announcement[],
  activeCategory: string,
  searchQuery: string,
  userAudience: string = 'Semua'
): Announcement[] {
  return items.filter((item) => {
    // Category match
    const categoryMatch = activeCategory === 'Semua' || item.category === activeCategory;

    // Audience match (if user role is targeted)
    const audienceMatch =
      userAudience === 'Semua' ||
      item.targetAudience === 'Semua' ||
      item.targetAudience === userAudience;

    // Search query match
    const query = searchQuery.trim().toLowerCase();
    const queryMatch =
      query === '' ||
      item.title.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);

    return categoryMatch && audienceMatch && queryMatch;
  });
}

/**
 * Key Code Security Generator
 * Generates a random alphanumeric 6-character code (e.g. "ALH-932", "ALH-7KX")
 */
export function generateKeyCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = 'ALH-';
  for (let i = 0; i < 3; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Validates Key Code (case-insensitive and ignores dashes/spaces)
 */
export function validateKeyCode(inputCode: string, expectedCode: string): boolean {
  if (!inputCode || !expectedCode) return false;
  const cleanInput = inputCode.replace(/[\s-]/g, '').toUpperCase();
  const cleanExpected = expectedCode.replace(/[\s-]/g, '').toUpperCase();
  return cleanInput === cleanExpected;
}

/**
 * Generates 6-digit numeric OTP code for email simulation
 */
export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Validates User creation for Madrasah staff (Guru / Admin)
 */
export function validateNewUser(data: {
  name: string;
  identifier: string;
  role: 'admin' | 'guru';
  email?: string;
}): { isValid: boolean; error?: string } {
  if (!data.name || data.name.trim().length < 3) {
    return { isValid: false, error: 'Nama lengkap minimal 3 karakter.' };
  }
  if (!data.identifier || data.identifier.trim().length < 4) {
    return { isValid: false, error: 'Nomor identitas (NIP / NUPTK / ID) wajib diisi minimal 4 karakter.' };
  }
  if (data.email && !data.email.includes('@')) {
    return { isValid: false, error: 'Format email tidak valid.' };
  }
  return { isValid: true };
}

export function validateEditUser(
  existingUsers: UserProfile[],
  data: Partial<UserProfile> & { id: string }
): { isValid: boolean; error?: string } {
  if (data.name !== undefined && data.name.trim().length < 3) {
    return { isValid: false, error: 'Nama lengkap minimal 3 karakter.' };
  }
  if (data.identifier !== undefined && data.identifier.trim().length < 4) {
    return { isValid: false, error: 'Nomor identitas (NIP / NUPTK / ID) minimal 4 karakter.' };
  }
  if (data.email && !data.email.includes('@')) {
    return { isValid: false, error: 'Format email tidak valid.' };
  }
  if (data.password !== undefined && data.password.trim().length > 0 && data.password.trim().length < 6) {
    return { isValid: false, error: 'Kata sandi baru minimal 6 karakter.' };
  }
  // Check identifier uniqueness if identifier changed
  if (data.identifier) {
    const cleanId = data.identifier.trim().toLowerCase();
    const duplicate = existingUsers.find(
      (u) => u.id !== data.id && u.identifier.trim().toLowerCase() === cleanId
    );
    if (duplicate) {
      return { isValid: false, error: `Nomor identitas "${data.identifier}" sudah digunakan oleh akun lain (${duplicate.name}).` };
    }
  }
  return { isValid: true };
}

export function editUserAccount(
  users: UserProfile[],
  updated: Partial<UserProfile> & { id: string }
): { success: boolean; users: UserProfile[]; updatedUser?: UserProfile; error?: string } {
  const index = users.findIndex((u) => u.id === updated.id);
  if (index === -1) {
    return { success: false, users, error: 'Akun tidak ditemukan di sistem.' };
  }

  const validation = validateEditUser(users, updated);
  if (!validation.isValid) {
    return { success: false, users, error: validation.error };
  }

  const existing = users[index];
  const merged: UserProfile = {
    ...existing,
    ...updated,
    name: updated.name !== undefined ? updated.name.trim() : existing.name,
    identifier: updated.identifier !== undefined ? updated.identifier.trim() : existing.identifier,
    email: updated.email !== undefined ? updated.email.trim() : existing.email,
    password: updated.password !== undefined && updated.password.trim() !== '' ? updated.password.trim() : existing.password,
  };

  const newUsers = [...users];
  newUsers[index] = merged;
  return { success: true, users: newUsers, updatedUser: merged };
}

export function deleteUserAccount(
  users: UserProfile[],
  targetUserId: string,
  currentUserId?: string
): { success: boolean; users: UserProfile[]; deletedUser?: UserProfile; error?: string } {
  const target = users.find((u) => u.id === targetUserId);
  if (!target) {
    return { success: false, users, error: 'Akun tidak ditemukan.' };
  }

  // Prevent deleting primary admin
  if (target.id === 'usr-admin-01' || target.identifier.toLowerCase() === 'admin') {
    return {
      success: false,
      users,
      error: 'Akun Admin Utama tidak dapat dihapus untuk keamanan sistem.',
    };
  }

  // Prevent user deleting their own active logged-in account
  if (currentUserId && target.id === currentUserId) {
    return {
      success: false,
      users,
      error: 'Anda tidak dapat menghapus akun yang sedang aktif digunakan saat ini.',
    };
  }

  const updatedUsers = users.filter((u) => u.id !== targetUserId);
  return { success: true, users: updatedUsers, deletedUser: target };
}

export function changeSelfPassword(
  user: UserProfile,
  oldPass: string,
  newPass: string,
  confirmPass: string
): { success: boolean; updatedUser?: UserProfile; error?: string } {
  const currentSavedPassword = user.password || '123456';
  if (oldPass !== currentSavedPassword) {
    return { success: false, error: 'Kata sandi lama yang Anda masukkan tidak cocok.' };
  }
  if (!newPass || newPass.trim().length < 6) {
    return { success: false, error: 'Kata sandi baru minimal 6 karakter.' };
  }
  if (newPass !== confirmPass) {
    return { success: false, error: 'Konfirmasi kata sandi baru tidak sama.' };
  }

  const updatedUser: UserProfile = {
    ...user,
    password: newPass.trim(),
  };

  return { success: true, updatedUser };
}

/**
 * Resets password using Email OTP verification
 */
export function validateOtpAndResetPassword(
  users: UserProfile[],
  identifierOrEmail: string,
  inputOtp: string,
  actualOtp: string,
  expiresAt: number,
  newPass: string,
  confirmPass: string
): { success: boolean; users: UserProfile[]; resetUser?: UserProfile; error?: string } {
  const cleanKey = identifierOrEmail.trim().toLowerCase();
  if (!cleanKey) {
    return { success: false, users, error: 'NIP, ID, atau Email staf wajib diisi.' };
  }

  const foundIndex = users.findIndex(
    (u) =>
      u.identifier.toLowerCase() === cleanKey ||
      u.email.toLowerCase() === cleanKey
  );

  if (foundIndex === -1) {
    return {
      success: false,
      users,
      error: 'Akun pengajar atau staf dengan NIP atau Email tersebut tidak terdaftar.',
    };
  }

  // Check OTP expiration
  if (Date.now() > expiresAt) {
    return {
      success: false,
      users,
      error: 'Kode OTP telah kadaluarsa. Silakan minta kode OTP baru.',
    };
  }

  // Check OTP match
  if (inputOtp.trim() !== actualOtp.trim()) {
    return {
      success: false,
      users,
      error: 'Kode OTP yang Anda masukkan salah. Periksa kembali email Anda.',
    };
  }

  if (!newPass || newPass.trim().length < 6) {
    return { success: false, error: 'Kata sandi baru minimal 6 karakter.', users };
  }
  if (newPass !== confirmPass) {
    return { success: false, error: 'Konfirmasi kata sandi baru tidak cocok.', users };
  }

  const target = users[foundIndex];
  const updatedUser: UserProfile = {
    ...target,
    password: newPass.trim(),
  };

  const newUsers = [...users];
  newUsers[foundIndex] = updatedUser;

  return { success: true, users: newUsers, resetUser: updatedUser };
}
