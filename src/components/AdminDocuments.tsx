import React, { useState, useRef } from 'react';
import { AdminDocument, UserRole } from '../types';
import { generateRealDocument, triggerFileDownload } from '../utils/documentGenerator';
import { canManageContent } from '../utils/portalLogic';
import {
  FileText,
  Download,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  FileCode,
  Upload,
  Plus,
  X,
  AlertCircle,
  FileUp,
  Calendar,
  Sparkles,
  Edit3,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

interface AdminDocumentsProps {
  documents: AdminDocument[];
  currentRole?: UserRole;
  onDownloadDoc: (docId: string, title: string) => void;
  onAddDocument?: (newDoc: AdminDocument) => void;
  onEditDocument?: (updatedDoc: AdminDocument) => void;
  onDeleteDocument?: (id: string) => void;
}

export const AdminDocuments: React.FC<AdminDocumentsProps> = ({
  documents,
  currentRole = 'admin',
  onDownloadDoc,
  onAddDocument,
  onEditDocument,
  onDeleteDocument,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Upload Modal States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Administrasi');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Edit Modal States
  const [editingDoc, setEditingDoc] = useState<AdminDocument | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('Administrasi');
  const [editCode, setEditCode] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Delete Modal States
  const [deletingDoc, setDeletingDoc] = useState<AdminDocument | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canManage = canManageContent(currentRole);

  const categories = ['Semua', 'PPDB', 'Kurikulum', 'Surat Keterangan', 'Juknis Kemenag', 'Administrasi'];

  const filteredDocs = documents.filter((doc) => {
    const catMatch = activeCategory === 'Semua' || doc.category === activeCategory;
    const query = searchQuery.trim().toLowerCase();
    const queryMatch =
      query === '' ||
      doc.title.toLowerCase().includes(query) ||
      doc.code.toLowerCase().includes(query) ||
      doc.description.toLowerCase().includes(query);

    return catMatch && queryMatch;
  });

  const getFormatBadge = (format: string) => {
    switch (format.toUpperCase()) {
      case 'PDF':
        return {
          icon: <FileText className="w-6 h-6 text-rose-600" />,
          badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
          label: 'PDF Document',
        };
      case 'DOCX':
      case 'DOC':
        return {
          icon: <FileText className="w-6 h-6 text-blue-600" />,
          badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
          label: 'Word Document',
        };
      case 'XLSX':
      case 'XLS':
      case 'CSV':
        return {
          icon: <FileSpreadsheet className="w-6 h-6 text-emerald-600" />,
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          label: 'Excel Spreadsheet',
        };
      default:
        return {
          icon: <FileCode className="w-6 h-6 text-slate-500" />,
          badgeClass: 'bg-slate-50 text-slate-700 border-slate-200',
          label: format,
        };
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const detectFileFormat = (fileName: string): 'PDF' | 'DOCX' | 'XLSX' => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'PDF';
    if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') return 'XLSX';
    return 'DOCX';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
    if (!ext || !validExtensions.includes(ext)) {
      setUploadError('Format berkas tidak didukung. Harap pilih berkas PDF, Word (.doc/.docx), atau Excel (.xls/.xlsx).');
      setSelectedFile(null);
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setUploadError('Ukuran berkas terlalu besar. Batas maksimal berkas adalah 25 MB.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    if (!uploadTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_\\-]/g, ' ');
      setUploadTitle(cleanName);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');

    if (!selectedFile) {
      setUploadError('Silakan pilih berkas PDF, Word, atau Excel terlebih dahulu dari perangkat Anda.');
      return;
    }

    if (!uploadTitle.trim()) {
      setUploadError('Judul dokumen wajib diisi.');
      return;
    }

    const detectedFormat = detectFileFormat(selectedFile.name);
    const newDocId = `doc-user-${Date.now()}`;
    const codeNumber = Math.floor(100 + Math.random() * 900);
    const newDoc: AdminDocument = {
      id: newDocId,
      title: uploadTitle.trim(),
      code: `DOC/MI-ALH/2026/${codeNumber}`,
      category: uploadCategory,
      fileFormat: detectedFormat,
      fileSize: formatFileSize(selectedFile.size),
      updatedAt: new Date().toISOString().split('T')[0],
      downloadCount: 0,
      description: uploadDescription.trim() || `Dokumen resmi ${uploadTitle.trim()} yang diunggah dari berkas lokal perangkat.`,
      fileBlob: selectedFile,
      fileBlobUrl: URL.createObjectURL(selectedFile),
      originalFileName: selectedFile.name,
    };

    if (onAddDocument) {
      onAddDocument(newDoc);
    }

    setIsUploadModalOpen(false);
    setSelectedFile(null);
    setUploadTitle('');
    setUploadDescription('');
    setUploadError('');
  };

  const handleDownload = (doc: AdminDocument) => {
    onDownloadDoc(doc.id, doc.title);

    if (doc.fileBlob && doc.originalFileName) {
      triggerFileDownload(doc.fileBlob, doc.originalFileName);
      return;
    }

    const generated = generateRealDocument(doc.id, doc.title, doc.fileFormat);
    triggerFileDownload(generated.blob, generated.filename);
  };

  const openEditModal = (doc: AdminDocument) => {
    setEditingDoc(doc);
    setEditTitle(doc.title);
    setEditCategory(doc.category);
    setEditCode(doc.code);
    setEditDescription(doc.description);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc || !editTitle.trim()) return;

    const updated: AdminDocument = {
      ...editingDoc,
      title: editTitle.trim(),
      category: editCategory,
      code: editCode.trim() || editingDoc.code,
      description: editDescription.trim(),
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (onEditDocument) {
      onEditDocument(updated);
    }
    setEditingDoc(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingDoc) return;
    if (onDeleteDocument) {
      onDeleteDocument(deletingDoc.id);
    }
    setDeletingDoc(null);
  };

  return (
    <div className="space-y-6">
      {/* Module Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Pusat Unduhan Dokumen Administrasi &amp; Formulir
              </h2>
              {canManage && (
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Hak Kelola CRUD ({currentRole === 'admin' ? 'Admin' : 'Dewan Guru'})
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Unduh langsung berkas formulir resmi PPDB, panduan kurikulum Kemenag, dan format surat izin
            </p>
          </div>

          <div className="flex items-center gap-2">
            {canManage && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Unggah Berkas Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* Categories Tab Bar & Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeCategory === cat
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kode atau nama dokumen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Documents Table List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider">
            Daftar Berkas Terverifikasi
          </span>
          <span className="text-slate-500">{filteredDocs.length} Dokumen Tersedia</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Nama Dokumen &amp; Format</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Nomor Berkas</th>
                <th className="py-3 px-4">Ukuran &amp; Diperbarui</th>
                <th className="py-3 px-4 text-center">Diunduh</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ada berkas dokumen yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => {
                  const badge = getFormatBadge(doc.fileFormat);
                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 shrink-0 mt-0.5">
                            {badge.icon}
                          </div>
                          <div className="space-y-0.5 max-w-md">
                            <span className="font-bold text-slate-900 block leading-tight text-sm">
                              {doc.title}
                            </span>
                            <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">
                              {doc.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md">
                          {doc.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600 font-medium">
                        {doc.code}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-500">
                        <div>{doc.fileSize}</div>
                        <div className="text-[10px] text-slate-400">{doc.updatedAt}</div>
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700">
                        {doc.downloadCount}x
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDownload(doc)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-semibold rounded-lg text-xs transition-all shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Unduh</span>
                          </button>

                          {canManage && (
                            <>
                              <button
                                onClick={() => openEditModal(doc)}
                                title="Edit Dokumen"
                                className="p-1.5 text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-700 rounded-lg transition-colors border border-blue-200"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeletingDoc(doc)}
                                title="Hapus Dokumen"
                                className="p-1.5 text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-700 rounded-lg transition-colors border border-rose-200"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-emerald-950 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Unggah Berkas Dokumen Resmi
                </h3>
                <p className="text-xs text-emerald-300">
                  Dukungan unggah berkas PDF, Word (.doc/.docx), dan Excel (.xls/.xlsx)
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              {uploadError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-emerald-600 bg-emerald-50/50'
                    : selectedFile
                    ? 'border-emerald-500 bg-emerald-50/20'
                    : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                      <FileUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{selectedFile.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {formatFileSize(selectedFile.size)} · Tipe: {detectFileFormat(selectedFile.name)}
                      </p>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold underline block">
                      Klik untuk ganti berkas lain
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Klik untuk memilih berkas dari perangkat Anda
                      </p>
                      <p className="text-[11px] text-slate-500">
                        atau seret dan lepas berkas ke area ini
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[10px] font-semibold text-slate-400">
                      <span>PDF</span> · <span>DOC / DOCX</span> · <span>XLS / XLSX</span> · <span>Maks. 25 MB</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Inputs */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Judul Dokumen <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Formulir Pendaftaran Santri Baru 2026/2027"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kategori Dokumen
                    </label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 bg-white"
                    >
                      <option value="Administrasi">Administrasi Umum</option>
                      <option value="Kurikulum">Kurikulum &amp; Silabus</option>
                      <option value="PPDB">PPDB &amp; Kesiswaan</option>
                      <option value="Surat Keterangan">Surat Keterangan &amp; Izin</option>
                      <option value="Juknis Kemenag">Juknis Kemenag</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Format Terdeteksi
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedFile ? detectFileFormat(selectedFile.name) : 'Otomatis dari berkas'}
                      className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-semibold cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Keterangan Dokumen
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Deskripsi singkat mengenai isi dokumen atau petunjuk pengisian..."
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 resize-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl text-xs transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Simpan &amp; Terbitkan Berkas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-blue-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display">Edit Informasi Dokumen</h3>
                <p className="text-xs text-blue-200">Perbarui metadata dan kode dokumen</p>
              </div>
              <button
                onClick={() => setEditingDoc(null)}
                className="p-1 text-blue-300 hover:text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Dokumen <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Dokumen
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800 bg-white"
                  >
                    <option value="Administrasi">Administrasi Umum</option>
                    <option value="Kurikulum">Kurikulum &amp; Silabus</option>
                    <option value="PPDB">PPDB &amp; Kesiswaan</option>
                    <option value="Surat Keterangan">Surat Keterangan &amp; Izin</option>
                    <option value="Juknis Kemenag">Juknis Kemenag</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor / Kode Berkas
                  </label>
                  <input
                    type="text"
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi / Keterangan
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-xs transition-all shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-rose-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
                <h3 className="text-base font-bold text-white font-display">Hapus Dokumen</h3>
              </div>
              <button
                onClick={() => setDeletingDoc(null)}
                className="p-1 text-rose-200 hover:text-white rounded-lg hover:bg-rose-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus berkas dokumen berikut dari pangkalan data madrasah?
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <h4 className="text-sm font-bold text-slate-900">{deletingDoc.title}</h4>
                <p className="text-xs text-slate-600 font-mono">Kode: {deletingDoc.code} · Format: {deletingDoc.fileFormat}</p>
                <p className="text-xs text-emerald-800 font-medium">Kategori: {deletingDoc.category}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingDoc(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  Ya, Hapus Dokumen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
