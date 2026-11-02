/**
 * API Service for Portal MI Al-Huda Gorontalo
 * Communicates with the Production Backend REST API & Database
 * Provides graceful fallback to local persistence if offline
 */

import {
  UserProfile,
  Announcement,
  ScheduleItem,
  AcademicEvent,
  AdminDocument,
  NewsArticle,
  GalleryItem,
  AuditLog,
} from '../types';

const API_BASE = '/api/v1';

async function safeFetch<T>(url: string, options?: RequestInit): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return { success: false, error: errJson.message || `HTTP ${res.status}` };
    }
    const data = await res.json();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

export async function checkBackendStatus(): Promise<{ isOnline: boolean; database?: any }> {
  const result = await safeFetch<any>(`${API_BASE}/health`);
  if (result.success && result.data?.status === 'success') {
    return { isOnline: true, database: result.data.database };
  }
  return { isOnline: false };
}

// Announcements
export async function apiFetchAnnouncements(): Promise<Announcement[] | null> {
  const res = await safeFetch<{ data: Announcement[] }>(`${API_BASE}/announcements`);
  return res.success && res.data ? res.data.data : null;
}

export async function apiSaveAnnouncement(ann: Announcement, isEdit: boolean): Promise<boolean> {
  const url = isEdit ? `${API_BASE}/announcements/${ann.id}` : `${API_BASE}/announcements`;
  const method = isEdit ? 'PUT' : 'POST';
  const res = await safeFetch(url, { method, body: JSON.stringify(ann) });
  return res.success;
}

export async function apiDeleteAnnouncement(id: string): Promise<boolean> {
  const res = await safeFetch(`${API_BASE}/announcements/${id}`, { method: 'DELETE' });
  return res.success;
}

// Schedules
export async function apiFetchSchedules(): Promise<ScheduleItem[] | null> {
  const res = await safeFetch<{ data: ScheduleItem[] }>(`${API_BASE}/schedules`);
  return res.success && res.data ? res.data.data : null;
}

export async function apiSaveSchedule(item: ScheduleItem, isEdit: boolean): Promise<boolean> {
  const url = isEdit ? `${API_BASE}/schedules/${item.id}` : `${API_BASE}/schedules`;
  const method = isEdit ? 'PUT' : 'POST';
  const res = await safeFetch(url, { method, body: JSON.stringify(item) });
  return res.success;
}

export async function apiDeleteSchedule(id: string): Promise<boolean> {
  const res = await safeFetch(`${API_BASE}/schedules/${id}`, { method: 'DELETE' });
  return res.success;
}

// Academic Calendar
export async function apiFetchEvents(): Promise<AcademicEvent[] | null> {
  const res = await safeFetch<{ events: AcademicEvent[] }>(`${API_BASE}/academic-calendar`);
  return res.success && res.data ? res.data.events : null;
}

export async function apiSaveEvent(event: AcademicEvent, isEdit: boolean): Promise<boolean> {
  const url = isEdit ? `${API_BASE}/academic-calendar/${event.id}` : `${API_BASE}/academic-calendar`;
  const method = isEdit ? 'PUT' : 'POST';
  const res = await safeFetch(url, { method, body: JSON.stringify(event) });
  return res.success;
}

export async function apiDeleteEvent(id: string): Promise<boolean> {
  const res = await safeFetch(`${API_BASE}/academic-calendar/${id}`, { method: 'DELETE' });
  return res.success;
}

// Documents
export async function apiFetchDocuments(): Promise<AdminDocument[] | null> {
  const res = await safeFetch<{ documents: AdminDocument[] }>(`${API_BASE}/documents`);
  return res.success && res.data ? res.data.documents : null;
}

export async function apiSaveDocument(doc: AdminDocument, isEdit: boolean): Promise<boolean> {
  // Omit fileBlob binary when syncing JSON metadata to REST API
  const { fileBlob, ...serializableDoc } = doc;
  const url = isEdit ? `${API_BASE}/documents/${doc.id}` : `${API_BASE}/documents`;
  const method = isEdit ? 'PUT' : 'POST';
  const res = await safeFetch(url, { method, body: JSON.stringify(serializableDoc) });
  return res.success;
}

export async function apiDeleteDocument(id: string): Promise<boolean> {
  const res = await safeFetch(`${API_BASE}/documents/${id}`, { method: 'DELETE' });
  return res.success;
}

// News
export async function apiFetchArticles(): Promise<NewsArticle[] | null> {
  const res = await safeFetch<{ articles: NewsArticle[] }>(`${API_BASE}/news`);
  return res.success && res.data ? res.data.articles : null;
}

export async function apiSaveArticle(art: NewsArticle, isEdit: boolean): Promise<boolean> {
  const url = isEdit ? `${API_BASE}/news/${art.id}` : `${API_BASE}/news`;
  const method = isEdit ? 'PUT' : 'POST';
  const res = await safeFetch(url, { method, body: JSON.stringify(art) });
  return res.success;
}

export async function apiDeleteArticle(id: string): Promise<boolean> {
  const res = await safeFetch(`${API_BASE}/news/${id}`, { method: 'DELETE' });
  return res.success;
}

// Gallery
export async function apiFetchGallery(): Promise<GalleryItem[] | null> {
  const res = await safeFetch<{ items: GalleryItem[] }>(`${API_BASE}/gallery`);
  return res.success && res.data ? res.data.items : null;
}

export async function apiSaveGallery(item: GalleryItem, isEdit: boolean): Promise<boolean> {
  const url = isEdit ? `${API_BASE}/gallery/${item.id}` : `${API_BASE}/gallery`;
  const method = isEdit ? 'PUT' : 'POST';
  const res = await safeFetch(url, { method, body: JSON.stringify(item) });
  return res.success;
}

export async function apiDeleteGallery(id: string): Promise<boolean> {
  const res = await safeFetch(`${API_BASE}/gallery/${id}`, { method: 'DELETE' });
  return res.success;
}

// Users
export async function apiFetchUsers(): Promise<UserProfile[] | null> {
  const res = await safeFetch<{ users: UserProfile[] }>(`${API_BASE}/users`);
  return res.success && res.data ? res.data.users : null;
}

export async function apiSaveUser(user: UserProfile, isEdit: boolean): Promise<boolean> {
  const url = isEdit ? `${API_BASE}/users/${user.id}` : `${API_BASE}/users`;
  const method = isEdit ? 'PUT' : 'POST';
  const res = await safeFetch(url, { method, body: JSON.stringify(user) });
  return res.success;
}

export async function apiDeleteUser(id: string): Promise<boolean> {
  const res = await safeFetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
  return res.success;
}

// Audit Logs
export async function apiFetchAuditLogs(): Promise<AuditLog[] | null> {
  const res = await safeFetch<{ logs: AuditLog[] }>(`${API_BASE}/audit-logs`);
  return res.success && res.data ? res.data.logs : null;
}

export async function apiPushAuditLog(log: AuditLog): Promise<void> {
  await safeFetch(`${API_BASE}/audit-logs`, { method: 'POST', body: JSON.stringify(log) });
}

