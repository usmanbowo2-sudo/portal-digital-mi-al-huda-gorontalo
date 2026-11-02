export type UserRole = 'admin' | 'guru' | 'siswa' | 'tamu';

export const LOGO_AL_HUDA = '/assets/aistudio/image_24f0559e.png';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  identifier: string; // NIP for teacher, 'admin' or 'ADM001' for admin
  password?: string; // Stored user password
  avatarInitials: string;
  grade?: string; // e.g. "Wali Kelas 5A"
  email: string;
  phone?: string;
  subjectOrPosition?: string; // e.g. "Guru Al-Qur'an Hadits & Fikih", "Administrator Madrasah"
  status: 'active' | 'inactive';
}

export interface AnnouncementAttachment {
  name: string;
  size: string;
  type: string;
  url: string;
}

export interface Announcement {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: 'Akademik' | 'Kesiswaan' | 'Penting' | 'Keagamaan' | 'Administrasi';
  targetAudience: 'Semua' | 'Siswa' | 'Guru';
  isPinned: boolean;
  publishedAt: string;
  authorName: string;
  authorRole: string;
  attachments?: AnnouncementAttachment[];
  viewsCount: number;
}

export interface ScheduleItem {
  id: string;
  grade: string; // "1A", "1B", "5A", etc.
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  period: number;
  timeSlot: string; // e.g. "07:30 - 08:45"
  subject: string;
  teacherName: string;
  room: string;
  isReligious: boolean;
}

export interface AcademicEvent {
  id: string;
  title: string;
  dateStart: string;
  dateEnd?: string;
  category: 'ujian' | 'libur' | 'kegiatan' | 'akademik';
  categoryLabel: string;
  description: string;
  location?: string;
}

export interface AdminDocument {
  id: string;
  title: string;
  code: string;
  category: 'PPDB' | 'Kurikulum' | 'Surat Keterangan' | 'Juknis Kemenag' | 'Administrasi' | string;
  fileFormat: 'PDF' | 'DOCX' | 'XLSX';
  fileSize: string;
  updatedAt: string;
  downloadCount: number;
  description: string;
  fileBlob?: Blob;
  fileBlobUrl?: string;
  originalFileName?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorNip: string;
  category: 'Prestasi' | 'Kegiatan Madrasah' | 'Kultum & Opini' | 'Informasi Kemenag';
  status: 'published' | 'draft';
  publishedAt: string;
  readTime: string;
  thumbnailTheme: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Tahfidz' | 'Pramuka' | 'Classmeeting' | 'Peringatan Hari Besar' | 'Akademik';
  date: string;
  description: string;
  colorGradient: string;
  iconName: string;
  imageUrl?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: string;
  target: string;
  ipAddress: string;
}
