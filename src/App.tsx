/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  Announcement,
  NewsArticle,
  AuditLog,
  AdminDocument,
  ScheduleItem,
  AcademicEvent,
  GalleryItem,
} from './types';
import {
  USER_PROFILES,
  INITIAL_USER_ACCOUNTS,
  INITIAL_ANNOUNCEMENTS,
  SCHEDULE_DATABASE,
  ACADEMIC_EVENTS,
  ADMIN_DOCUMENTS,
  NEWS_ARTICLES,
  GALLERY_ITEMS,
  INITIAL_AUDIT_LOGS,
} from './data/mockData';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { DigitalBoard } from './components/DigitalBoard';
import { ScheduleModule } from './components/ScheduleModule';
import { AcademicCalendar } from './components/AcademicCalendar';
import { AdminDocuments } from './components/AdminDocuments';
import { NewsManager } from './components/NewsManager';
import { SchoolGallery } from './components/SchoolGallery';
import { RealtimeDashboard } from './components/RealtimeDashboard';
import { UserManagementModule } from './components/UserManagementModule';
import { LoginModal } from './components/LoginModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { Footer } from './components/Footer';
import { editUserAccount, deleteUserAccount } from './utils/portalLogic';
import {
  CheckCircle2,
  ShieldAlert,
  X,
  ShieldCheck,
  LogOut,
  Sparkles,
  UserCheck,
} from 'lucide-react';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('pengumuman');
  const [currentRole, setCurrentRole] = useState<UserRole>(() =>
    loadFromStorage<UserRole>('alhuda_role', 'tamu')
  );
  const [currentUser, setCurrentUser] = useState<UserProfile>(() =>
    loadFromStorage<UserProfile>('alhuda_user', USER_PROFILES.tamu)
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState<boolean>(false);

  // Application Data States (Managed with CRUD for Admin & Dewan Guru with localStorage sync)
  const [userAccounts, setUserAccounts] = useState<UserProfile[]>(() =>
    loadFromStorage<UserProfile[]>('alhuda_users', INITIAL_USER_ACCOUNTS)
  );
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    loadFromStorage<Announcement[]>('alhuda_announcements', INITIAL_ANNOUNCEMENTS)
  );
  const [documents, setDocuments] = useState<AdminDocument[]>(() =>
    loadFromStorage<AdminDocument[]>('alhuda_documents', ADMIN_DOCUMENTS)
  );
  const [articles, setArticles] = useState<NewsArticle[]>(() =>
    loadFromStorage<NewsArticle[]>('alhuda_articles', NEWS_ARTICLES)
  );
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() =>
    loadFromStorage<ScheduleItem[]>('alhuda_schedules', SCHEDULE_DATABASE)
  );
  const [academicEvents, setAcademicEvents] = useState<AcademicEvent[]>(() =>
    loadFromStorage<AcademicEvent[]>('alhuda_events', ACADEMIC_EVENTS)
  );
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() =>
    loadFromStorage<GalleryItem[]>('alhuda_gallery', GALLERY_ITEMS)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    loadFromStorage<AuditLog[]>('alhuda_logs', INITIAL_AUDIT_LOGS)
  );

  // Sync state to localStorage on changes
  useEffect(() => {
    localStorage.setItem('alhuda_role', JSON.stringify(currentRole));
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('alhuda_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('alhuda_users', JSON.stringify(userAccounts));
  }, [userAccounts]);

  useEffect(() => {
    localStorage.setItem('alhuda_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    // Avoid serializing large raw Blobs to JSON string in localStorage
    const serializableDocs = documents.map(({ fileBlob, ...rest }) => rest);
    localStorage.setItem('alhuda_documents', JSON.stringify(serializableDocs));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('alhuda_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('alhuda_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('alhuda_events', JSON.stringify(academicEvents));
  }, [academicEvents]);

  useEffect(() => {
    localStorage.setItem('alhuda_gallery', JSON.stringify(galleryItems));
  }, [galleryItems]);

  useEffect(() => {
    localStorage.setItem('alhuda_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type?: 'success' | 'info' } | null>(null);
  const [authEffect, setAuthEffect] = useState<{
    type: 'login' | 'logout';
    name: string;
    roleTitle: string;
    identifier?: string;
  } | null>(null);

  const showToast = (title: string, desc: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addAuditLog = (action: string, target: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName: currentUser.name,
      userRole: currentRole,
      action,
      target,
      ipAddress: '180.244.132.89',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Login handler
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    addAuditLog('LOGIN_PORTAL', `Otentikasi Berhasil (${user.identifier})`);

    // Trigger visually rich Login Transition Effect
    setAuthEffect({
      type: 'login',
      name: user.name,
      roleTitle: user.role === 'admin' ? 'Administrator Madrasah' : 'Dewan Guru MI Al-Huda',
      identifier: user.identifier,
    });
    setTimeout(() => {
      setAuthEffect(null);
    }, 2400);

    showToast(
      'Login Berhasil',
      `Selamat datang, ${user.name} (${user.role === 'admin' ? 'Administrator' : 'Dewan Guru'})`
    );
  };

  // Logout handler
  const handleLogout = () => {
    const prevName = currentUser.name;
    addAuditLog('LOGOUT_PORTAL', `Sesi Diakhiri oleh ${prevName}`);

    // Trigger visually rich Logout Transition Effect
    setAuthEffect({
      type: 'logout',
      name: prevName,
      roleTitle: 'Pengunjung Publik / Tamu',
    });
    setTimeout(() => {
      setAuthEffect(null);
    }, 2200);

    setCurrentUser(USER_PROFILES.tamu);
    setCurrentRole('tamu');

    if (activeTab === 'dashboard') {
      setActiveTab('pengumuman');
    }

    showToast('Berhasil Keluar', 'Anda sekarang berada dalam mode Pengunjung Publik (Tamu).');
  };

  // --- CRUD: User Management (Admin Only) ---
  const handleAddUserAccount = (newUser: UserProfile) => {
    setUserAccounts((prev) => [newUser, ...prev]);
    addAuditLog(
      newUser.role === 'guru' ? 'CREATE_TEACHER_ACCOUNT' : 'CREATE_ADMIN_ACCOUNT',
      `${newUser.name} (${newUser.identifier})`
    );
    showToast('Akun Berhasil Didaftarkan', `Akun Staf "${newUser.name}" kini aktif di sistem madrasah.`);
  };

  const handleEditUserAccount = (updatedData: Partial<UserProfile> & { id: string }) => {
    const result = editUserAccount(userAccounts, updatedData);
    if (!result.success) {
      showToast('Gagal Memperbarui Akun', result.error || 'Terjadi kesalahan validasi.', 'info');
      return;
    }

    setUserAccounts(result.users);
    if (currentUser.id === updatedData.id && result.updatedUser) {
      setCurrentUser(result.updatedUser);
    }

    addAuditLog('EDIT_USER_ACCOUNT', `${result.updatedUser?.name} (${result.updatedUser?.identifier})`);
    showToast('Data Akun Diperbarui', `Perubahan data "${result.updatedUser?.name}" telah disimpan.`);
  };

  const handleDeleteUserAccount = (userId: string) => {
    const result = deleteUserAccount(userAccounts, userId, currentUser.id);
    if (!result.success) {
      showToast('Gagal Menghapus Akun', result.error || 'Terjadi kesalahan.', 'info');
      return;
    }

    setUserAccounts(result.users);
    addAuditLog('DELETE_USER_ACCOUNT', `${result.deletedUser?.name} (${result.deletedUser?.identifier})`);
    showToast('Akun Dihapus', `Akun "${result.deletedUser?.name}" berhasil dihapus.`);
  };

  const handleSelfPasswordChanged = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    setUserAccounts((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    addAuditLog('CHANGE_PASSWORD_SELF', `Kata sandi mandiri diubah (${updatedUser.identifier})`);
    showToast('Kata Sandi Diperbarui', 'Kata sandi akun Anda telah berhasil diperbarui.');
  };

  const handleToggleUserStatus = (userId: string) => {
    setUserAccounts((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'active' ? 'inactive' : 'active';
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
    showToast('Status Akun Diperbarui', 'Status aktif akun staf telah diperbarui.');
  };

  // --- CRUD: Announcements (Admin & Guru) ---
  const handleAddAnnouncement = (newAnn: Announcement) => {
    setAnnouncements((prev) => [newAnn, ...prev]);
    addAuditLog('CREATE_ANNOUNCEMENT', newAnn.title);
    showToast('Pengumuman Diterbitkan', `"${newAnn.title}" telah dipublikasikan.`);
  };

  const handleEditAnnouncement = (updatedAnn: Announcement) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === updatedAnn.id ? updatedAnn : a)));
    addAuditLog('UPDATE_ANNOUNCEMENT', updatedAnn.title);
    showToast('Pengumuman Diperbarui', `Perubahan "${updatedAnn.title}" berhasil disimpan.`);
  };

  const handleDeleteAnnouncement = (id: string) => {
    const target = announcements.find((a) => a.id === id);
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    addAuditLog('DELETE_ANNOUNCEMENT', target?.title || id);
    showToast('Pengumuman Dihapus', 'Pengumuman telah dihapus dari papan informasi.');
  };

  // --- CRUD: Articles / News (Admin & Guru) ---
  const handleAddArticle = (newArt: NewsArticle) => {
    setArticles((prev) => [newArt, ...prev]);
    addAuditLog('CREATE_NEWS_ARTICLE', newArt.title);
    showToast('Warta Diterbitkan', `Artikel "${newArt.title}" berhasil dipublikasikan.`);
  };

  const handleEditArticle = (updatedArt: NewsArticle) => {
    setArticles((prev) => prev.map((a) => (a.id === updatedArt.id ? updatedArt : a)));
    addAuditLog('UPDATE_NEWS_ARTICLE', updatedArt.title);
    showToast('Warta Diperbarui', `Perubahan "${updatedArt.title}" berhasil disimpan.`);
  };

  const handleDeleteArticle = (id: string) => {
    const target = articles.find((a) => a.id === id);
    setArticles((prev) => prev.filter((a) => a.id !== id));
    addAuditLog('DELETE_NEWS_ARTICLE', target?.title || id);
    showToast('Warta Dihapus', 'Artikel warta telah dihapus dari publikasi.');
  };

  // --- CRUD: Documents (Admin & Guru) ---
  const handleAddDocument = (newDoc: AdminDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
    addAuditLog('UPLOAD_DOCUMENT', `${newDoc.title} (${newDoc.fileFormat})`);
    showToast('Dokumen Diunggah', `Berkas "${newDoc.title}" (${newDoc.fileFormat}) siap diunduh.`);
  };

  const handleEditDocument = (updatedDoc: AdminDocument) => {
    setDocuments((prev) => prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)));
    addAuditLog('UPDATE_DOCUMENT', `${updatedDoc.title} (${updatedDoc.code})`);
    showToast('Dokumen Diperbarui', `Informasi berkas "${updatedDoc.title}" berhasil disimpan.`);
  };

  const handleDeleteDocument = (id: string) => {
    const target = documents.find((d) => d.id === id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    addAuditLog('DELETE_DOCUMENT', target?.title || id);
    showToast('Dokumen Dihapus', 'Berkas dokumen telah dihapus dari pangkalan data.');
  };

  const handleDownloadDoc = (docId: string, title: string) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === docId ? { ...doc, downloadCount: doc.downloadCount + 1 } : doc))
    );
    addAuditLog('DOWNLOAD_DOCUMENT', title);
    showToast('Mengunduh Berkas Resmi', `File "${title}" berhasil disiapkan untuk diunduh.`);
  };

  // --- CRUD: Schedules (Admin & Guru) ---
  const handleAddSchedule = (newItem: ScheduleItem) => {
    setSchedules((prev) => [...prev, newItem]);
    addAuditLog('CREATE_SCHEDULE', `${newItem.subject} - Kelas ${newItem.grade} (${newItem.day})`);
    showToast('Jadwal Ditambahkan', `Sesi ${newItem.subject} Kelas ${newItem.grade} berhasil disimpan.`);
  };

  const handleEditSchedule = (updatedItem: ScheduleItem) => {
    setSchedules((prev) => prev.map((s) => (s.id === updatedItem.id ? updatedItem : s)));
    addAuditLog('UPDATE_SCHEDULE', `${updatedItem.subject} - Kelas ${updatedItem.grade}`);
    showToast('Jadwal Diperbarui', `Perubahan jadwal ${updatedItem.subject} telah disimpan.`);
  };

  const handleDeleteSchedule = (id: string) => {
    const target = schedules.find((s) => s.id === id);
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    addAuditLog('DELETE_SCHEDULE', target ? `${target.subject} Kelas ${target.grade}` : id);
    showToast('Jadwal Dihapus', 'Sesi pembelajaran telah dihapus dari jadwal KBM.');
  };

  // --- CRUD: Academic Calendar Events (Admin & Guru) ---
  const handleAddAcademicEvent = (newEvent: AcademicEvent) => {
    setAcademicEvents((prev) => [newEvent, ...prev]);
    addAuditLog('CREATE_CALENDAR_EVENT', `${newEvent.title} (${newEvent.dateStart})`);
    showToast('Agenda Ditambahkan', `Kegiatan "${newEvent.title}" telah ditambahkan ke kalender.`);
  };

  const handleEditAcademicEvent = (updatedEvent: AcademicEvent) => {
    setAcademicEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
    addAuditLog('UPDATE_CALENDAR_EVENT', updatedEvent.title);
    showToast('Agenda Diperbarui', `Perubahan agenda "${updatedEvent.title}" berhasil disimpan.`);
  };

  const handleDeleteAcademicEvent = (id: string) => {
    const target = academicEvents.find((e) => e.id === id);
    setAcademicEvents((prev) => prev.filter((e) => e.id !== id));
    addAuditLog('DELETE_CALENDAR_EVENT', target?.title || id);
    showToast('Agenda Dihapus', 'Agenda kegiatan telah dihapus dari kalender akademik.');
  };

  // --- CRUD: School Gallery (Admin & Guru) ---
  const handleAddGalleryItem = (newItem: GalleryItem) => {
    setGalleryItems((prev) => [newItem, ...prev]);
    addAuditLog('CREATE_GALLERY_ITEM', newItem.title);
    showToast('Dokumentasi Ditambahkan', `Album "${newItem.title}" berhasil ditambahkan ke galeri.`);
  };

  const handleEditGalleryItem = (updatedItem: GalleryItem) => {
    setGalleryItems((prev) => prev.map((g) => (g.id === updatedItem.id ? updatedItem : g)));
    addAuditLog('UPDATE_GALLERY_ITEM', updatedItem.title);
    showToast('Dokumentasi Diperbarui', `Perubahan album "${updatedItem.title}" berhasil disimpan.`);
  };

  const handleDeleteGalleryItem = (id: string) => {
    const target = galleryItems.find((g) => g.id === id);
    setGalleryItems((prev) => prev.filter((g) => g.id !== id));
    addAuditLog('DELETE_GALLERY_ITEM', target?.title || id);
    showToast('Dokumentasi Dihapus', 'Dokumentasi kegiatan telah dihapus dari galeri.');
  };

  const handleDownloadNotice = (filename: string) => {
    showToast('Menyiapkan Dokumen', `Mengunduh berkas ${filename}`);
  };

  const totalDownloads = documents.reduce((acc, curr) => acc + curr.downloadCount, 0);
  const urgentAnnouncementsCount = announcements.filter((a) => a.isPinned || a.category === 'Penting').length;
  const latestUrgentAnnouncement = announcements.find((a) => a.isPinned || a.category === 'Penting');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 bg-islamic-pattern">
      {/* Login Modal (Strictly Admin and Guru with automatic and spinning 2-sec delay Key Code) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        availableUsers={userAccounts}
        onUserAccountsUpdated={setUserAccounts}
      />

      {/* Self-Service Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        currentUser={currentUser}
        onPasswordChanged={handleSelfPasswordChanged}
      />

      {/* Primary Header with Integrated Profile and Logout */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        userProfile={currentUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenChangePasswordModal={() => setIsChangePasswordModalOpen(true)}
      />

      {/* Hero Banner */}
      {activeTab === 'pengumuman' && (
        <HeroBanner
          onNavigateTab={setActiveTab}
          urgentCount={urgentAnnouncementsCount}
          latestUrgentTitle={latestUrgentAnnouncement?.title}
        />
      )}

      {/* Main Viewport Container with Page Transition Animation */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div key={activeTab} className="animate-page-enter space-y-8">
          {/* Tab 1: Papan Pengumuman Digital with Full CRUD */}
          {activeTab === 'pengumuman' && (
            <div className="space-y-8">
              <DigitalBoard
                announcements={announcements}
                currentRole={currentRole}
                currentUser={currentUser}
                onAddAnnouncement={handleAddAnnouncement}
                onEditAnnouncement={handleEditAnnouncement}
                onDeleteAnnouncement={handleDeleteAnnouncement}
                onDownloadAttachment={handleDownloadNotice}
              />

              {/* Gallery Preview with Full CRUD */}
              <div className="pt-4">
                <SchoolGallery
                  items={galleryItems.slice(0, 3)}
                  currentRole={currentRole}
                  onAddGalleryItem={handleAddGalleryItem}
                  onEditGalleryItem={handleEditGalleryItem}
                  onDeleteGalleryItem={handleDeleteGalleryItem}
                />
              </div>
            </div>
          )}

          {/* Tab 2: Jadwal Pelajaran & Kalender Akademik with Full CRUD */}
          {activeTab === 'jadwal' && (
            <div className="space-y-8">
              <ScheduleModule
                schedules={schedules}
                currentRole={currentRole}
                onAddSchedule={handleAddSchedule}
                onEditSchedule={handleEditSchedule}
                onDeleteSchedule={handleDeleteSchedule}
                onDownloadNotice={handleDownloadNotice}
              />

              <AcademicCalendar
                events={academicEvents}
                currentRole={currentRole}
                onAddEvent={handleAddAcademicEvent}
                onEditEvent={handleEditAcademicEvent}
                onDeleteEvent={handleDeleteAcademicEvent}
              />
            </div>
          )}

          {/* Tab 3: Dokumen Administrasi & Unduhan with Full CRUD */}
          {activeTab === 'dokumen' && (
            <div className="space-y-8">
              <AdminDocuments
                documents={documents}
                currentRole={currentRole}
                onDownloadDoc={handleDownloadDoc}
                onAddDocument={handleAddDocument}
                onEditDocument={handleEditDocument}
                onDeleteDocument={handleDeleteDocument}
              />
            </div>
          )}

          {/* Tab 4: Warta Madrasah & Galeri Kegiatan with Full CRUD */}
          {activeTab === 'warta' && (
            <div className="space-y-8">
              <NewsManager
                articles={articles}
                currentRole={currentRole}
                currentUser={currentUser}
                onAddArticle={handleAddArticle}
                onEditArticle={handleEditArticle}
                onDeleteArticle={handleDeleteArticle}
              />

              <SchoolGallery
                items={galleryItems}
                currentRole={currentRole}
                onAddGalleryItem={handleAddGalleryItem}
                onEditGalleryItem={handleEditGalleryItem}
                onDeleteGalleryItem={handleDeleteGalleryItem}
              />
            </div>
          )}

          {/* Tab 5: Dashboard Real-Time & Manajemen Akun Staf (Admin Only) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {currentRole === 'admin' ? (
                <>
                  <RealtimeDashboard
                    auditLogs={auditLogs}
                    totalDownloads={totalDownloads}
                    users={userAccounts}
                  />

                  <UserManagementModule
                    users={userAccounts}
                    currentUserId={currentUser.id}
                    onAddUser={handleAddUserAccount}
                    onEditUser={handleEditUserAccount}
                    onDeleteUser={handleDeleteUserAccount}
                    onToggleUserStatus={handleToggleUserStatus}
                  />
                </>
              ) : (
                <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center space-y-4 shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h3 className="text-base font-bold text-slate-900 font-display">
                      Akses Dibatasi (Khusus Administrator)
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Halaman Dashboard Pemantauan dan Manajemen Akun hanya dapat diakses oleh akun <strong>Admin</strong> MI Al-Huda Gorontalo.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
                  >
                    Masuk sebagai Admin
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Visual Auth Transition Splash Effect (Login & Logout) */}
      {authEffect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs pointer-events-none transition-all duration-300">
          <div
            className={`w-full max-w-md p-6 rounded-3xl shadow-2xl border text-center relative overflow-hidden animate-auth-pop ${
              authEffect.type === 'login'
                ? 'bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 border-emerald-400/80 shadow-emerald-900/50'
                : 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-amber-400/80 shadow-slate-900/50'
            }`}
          >
            {/* Shimmer sweep effect inside modal card */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-light-sweep absolute top-0 -left-1/3 transform -skew-x-25" />
            </div>

            <div className="relative z-10 flex flex-col items-center space-y-3">
              {authEffect.type === 'login' ? (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg animate-auth-glow">
                    <ShieldCheck className="w-9 h-9" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/25 border border-emerald-400/50 rounded-full text-emerald-300 text-[11px] font-bold tracking-wide uppercase">
                      <Sparkles className="w-3.5 h-3.5" /> Otentikasi Berhasil
                    </span>
                    <h3 className="text-xl font-extrabold text-white font-display mt-2">
                      Selamat Datang Kembali!
                    </h3>
                    <p className="text-sm font-semibold text-emerald-200 mt-0.5">
                      {authEffect.name}
                    </p>
                    <p className="text-xs text-emerald-300/80 font-mono mt-1">
                      {authEffect.roleTitle} {authEffect.identifier ? `• ${authEffect.identifier}` : ''}
                    </p>
                  </div>
                  <div className="pt-2 text-[11px] text-emerald-100/70 border-t border-emerald-800/80 w-full">
                    Sistem siap • Hak akses manajemen konten aktif
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-lg animate-auth-glow">
                    <LogOut className="w-9 h-9" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/25 border border-amber-400/50 rounded-full text-amber-300 text-[11px] font-bold tracking-wide uppercase">
                      Sesi Telah Diakhiri
                    </span>
                    <h3 className="text-xl font-extrabold text-white font-display mt-2">
                      Sampai Jumpa, {authEffect.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto leading-relaxed">
                      Anda kini berada dalam <strong>Mode Tamu Publik</strong>. Seluruh jadwal, pengumuman, dan berkas tetap terbuka bebas tanpa login.
                    </p>
                  </div>
                  <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800 w-full">
                    Aman • Kredensial telah ditutup dari memori browser
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Interactive Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold text-white">{toastMessage.title}</h5>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toastMessage.desc}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Authentic Footer */}
      <Footer onNavigateTab={setActiveTab} />
    </div>
  );
}
