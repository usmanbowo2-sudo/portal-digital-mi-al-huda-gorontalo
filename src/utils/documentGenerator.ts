/**
 * Utility for generating real, valid, and openable documents for MI Al-Huda Gorontalo:
 * 1. Valid PDF files (standard PDF 1.4 syntax readable by Adobe Reader, Chrome, iOS/Android)
 * 2. Valid Word files (.doc format with Word XML markup readable by MS Word, LibreOffice, Google Docs)
 * 3. Valid Excel spreadsheets (UTF-8 BOM CSV / XML Spreadsheet readable by MS Excel, Calc, Sheets)
 */

export interface GeneratedDocument {
  blob: Blob;
  filename: string;
  mimeType: string;
}

/**
 * Creates a valid PDF binary string conforming to PDF 1.4 specification
 */
function buildValidPdf(title: string, lines: string[]): Blob {
  // Format text stream for PDF
  const textCommands: string[] = [
    'BT',
    '/F1 16 Tf',
    '50 740 Td',
    `(${escapePdfText('MADRASAH IBTIDAIYAH AL-HUDA GORONTALO')}) Tj`,
    '0 -20 Td',
    '/F1 11 Tf',
    `(${escapePdfText('Jl. Al-Huda No. 12, Kota Gorontalo | Bumi Serambi Madinah')}) Tj`,
    '0 -15 Td',
    `(${escapePdfText('----------------------------------------------------------------------------------')}) Tj`,
    '0 -25 Td',
    '/F1 14 Tf',
    `(${escapePdfText(title)}) Tj`,
    '0 -20 Td',
    '/F1 10 Tf',
  ];

  for (const line of lines) {
    textCommands.push(`(${escapePdfText(line)}) Tj`);
    textCommands.push('0 -14 Td');
  }

  textCommands.push('0 -30 Td');
  textCommands.push('/F1 10 Tf');
  textCommands.push(`(${escapePdfText('Mengetahui,')}) Tj`);
  textCommands.push('0 -14 Td');
  textCommands.push(`(${escapePdfText('Kepala Madrasah / Administrator MI Al-Huda Gorontalo')}) Tj`);
  textCommands.push('0 -40 Td');
  textCommands.push(`(${escapePdfText('( Dr. H. Rusli Monoarfa, M.Pd.I / Tim Kurikulum )')}) Tj`);
  textCommands.push('ET');

  const streamContent = textCommands.join('\n');
  const streamLength = streamContent.length;

  let pdfContent = `%PDF-1.4\n`;
  const offsets: number[] = [];

  // Object 1: Catalog
  offsets.push(pdfContent.length);
  pdfContent += `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;

  // Object 2: Pages
  offsets.push(pdfContent.length);
  pdfContent += `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`;

  // Object 3: Page
  offsets.push(pdfContent.length);
  pdfContent += `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`;

  // Object 4: Font
  offsets.push(pdfContent.length);
  pdfContent += `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`;

  // Object 5: Contents
  offsets.push(pdfContent.length);
  pdfContent += `5 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj\n`;

  // XRef
  const startXref = pdfContent.length;
  pdfContent += `xref\n0 6\n`;
  pdfContent += `0000000000 65535 f \n`;
  for (const offset of offsets) {
    pdfContent += `${offset.toString().padStart(10, '0')} 00000 n \n`;
  }

  // Trailer
  pdfContent += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;

  return new Blob([pdfContent], { type: 'application/pdf' });
}

function escapePdfText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[^\x20-\x7E]/g, ' '); // Clean non-ASCII for basic standard Helvetica
}

/**
 * Creates a valid Microsoft Word compatible document (.doc / .docx)
 */
function buildValidWordDoc(title: string, bodyHtml: string): Blob {
  const content = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: A4;
      margin: 2.5cm 2.5cm 2.5cm 2.5cm;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #000;
    }
    .header-table {
      width: 100%;
      border-bottom: 3px double #000;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .kop-text {
      text-align: center;
    }
    .kop-title {
      font-size: 14pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0;
    }
    .kop-sub {
      font-size: 11pt;
      margin: 2px 0;
    }
    .doc-title {
      text-align: center;
      font-size: 13pt;
      font-weight: bold;
      text-decoration: underline;
      margin: 20px 0 10px 0;
    }
    .doc-code {
      text-align: center;
      font-size: 10pt;
      margin-bottom: 20px;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      margin-bottom: 20px;
    }
    table.data-table th, table.data-table td {
      border: 1px solid #333;
      padding: 6px 10px;
      font-size: 11pt;
    }
    table.data-table th {
      background-color: #f2f2f2;
      text-align: left;
    }
    .ttd-container {
      margin-top: 40px;
      width: 100%;
    }
    .ttd-box {
      float: right;
      width: 250px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header-table">
    <div class="kop-text">
      <div class="kop-title">KEMENTERIAN AGAMA REPUBLIK INDONESIA</div>
      <div class="kop-title">KANTOR KEMENTERIAN AGAMA KOTA GORONTALO</div>
      <div class="kop-title">MADRASAH IBTIDAIYAH AL-HUDA GORONTALO</div>
      <div class="kop-sub">Alamat: Jl. Al-Huda No. 12, Kel. Heledulaa, Kota Gorontalo | Email: info@mialhudagorontalo.sch.id</div>
    </div>
  </div>

  <div class="doc-title">${title}</div>
  ${bodyHtml}

  <div class="ttd-container">
    <div class="ttd-box">
      <div>Gorontalo, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
      <div>Kepala Madrasah / Bagian Administrasi,</div>
      <div style="height: 60px;"></div>
      <div style="font-weight: bold; text-decoration: underline;">Dr. H. Rusli Monoarfa, M.Pd.I</div>
      <div>NIP. 197508122002121004</div>
    </div>
  </div>
</body>
</html>`;

  return new Blob(['\ufeff', content], {
    type: 'application/msword;charset=utf-8',
  });
}

/**
 * Creates a valid Excel Spreadsheet (.xlsx compatible CSV with UTF-8 BOM)
 */
function buildValidExcelDoc(sheetName: string, headers: string[], rows: (string | number)[][]): Blob {
  const escapeCell = (val: string | number) => {
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines: string[] = [];
  lines.push(`REKAPITULASI RESMI - ${sheetName}`);
  lines.push(`MADRASAH IBTIDAIYAH AL-HUDA GORONTALO`);
  lines.push(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`);
  lines.push(''); // Empty line
  lines.push(headers.map(escapeCell).join(','));

  for (const row of rows) {
    lines.push(row.map(escapeCell).join(','));
  }

  // Prepend UTF-8 BOM (\uFEFF) so Excel opens UTF-8 characters properly
  const csvContent = '\uFEFF' + lines.join('\r\n');
  return new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
}

/**
 * Generates an authentic, openable file based on doc ID / format
 */
export function generateRealDocument(docId: string, docTitle: string, fileFormat: string): GeneratedDocument {
  const normalizedFormat = fileFormat.toUpperCase();

  // 1. PPDB Form (PDF)
  if (docId === 'doc-01' || docTitle.toLowerCase().includes('ppdb')) {
    const lines = [
      'FORMULIR PENERIMAAN PESERTA DIDIK BARU (PPDB) T.A 2026/2027',
      'No. Registrasi: PPDB-2026-ALH-001',
      '',
      'A. BIODATA CALON SISWA/SANTRI:',
      '1. Nama Lengkap        : __________________________________________________',
      '2. NISN / NIK          : __________________________________________________',
      '3. Tempat, Tgl Lahir   : __________________________________________________',
      '4. Jenis Kelamin       : [ ] Laki-laki    [ ] Perempuan',
      '5. Alamat Tinggal      : __________________________________________________',
      '6. Asal Sekolah (TK/RA): __________________________________________________',
      '',
      'B. DATA ORANG TUA / WALI:',
      '1. Nama Ayah Kandung   : __________________________________________________',
      '2. Pekerjaan Ayah      : __________________________________________________',
      '3. Nama Ibu Kandung    : __________________________________________________',
      '4. Pekerjaan Ibu       : __________________________________________________',
      '5. No. WhatsApp / HP   : __________________________________________________',
      '',
      'C. PILIHAN PROGRAM UNGGULAN:',
      '[ ] Program Tahfidz Al-Quran (Target 3 Juz)',
      '[ ] Program Sains & Robotika Cilik',
      '[ ] Program English & Arabic Daily Club',
      '',
      'D. PERSYARATAN BERKAS YANG DILAMPIRKAN:',
      '1. Fotokopi Akta Kelahiran (2 lembar)',
      '2. Fotokopi Kartu Keluarga (2 lembar)',
      '3. Pasfoto 3x4 berwarna (3 lembar)',
      '4. Surat Pernyataan Tanggung Jawab Mutlak (SPTJM)',
    ];

    return {
      blob: buildValidPdf('FORMULIR PENDAFTARAN PPDB MI AL-HUDA', lines),
      filename: 'Formulir_Pendaftaran_PPDB_MI_Al-Huda_2026.pdf',
      mimeType: 'application/pdf',
    };
  }

  // 2. Kalender Pendidikan (PDF)
  if (docId === 'doc-02' || docTitle.toLowerCase().includes('kalender')) {
    const lines = [
      'KALENDER PENDIDIKAN MADRASAH PROVINSI GORONTALO T.A 2025/2026',
      'Pedoman Waktu Efektif Belajar & Penilaian Madrasah Ibtidaiyah',
      '',
      'SEMESTER GENAP (JANUARI - JUNI 2026):',
      '1. 05 Januari 2026 : Awal Kegiatan Belajar Mengajar (KBM) Semester Genap',
      '2. 16 - 21 Maret 2026 : Pelaksanaan Ujian Penilaian Tengah Semester (PTS)',
      '3. 26 Maret 2026 : Peringatan Nuzulul Quran & Pesantren Kilat Ramadhan',
      '4. 01 - 12 April 2026 : Libur Hari Raya Idul Fitri 1447 H & Cuti Bersama',
      '5. 18 - 23 Mei 2026 : Pelaksanaan Asesmen Madrasah (AM) Utama Kelas 6',
      '6. 08 - 13 Juni 2026 : Asesmen Akhir Tahun (AAT) Kelas 1 - 5',
      '7. 20 Juni 2026 : Pembagian Buku Laporan Hasil Belajar (Rapor)',
      '8. 22 Juni - 11 Juli 2026 : Libur Akhir Semester Genap T.A 2025/2026',
      '',
      'Catatan:',
      'Setiap hari Jumat dilaksanakan Gerakan Sholat Berjamaah & Khitobah Santri.',
      'Jadwal dapat disesuaikan mengikuti Surat Edaran Kanwil Kemenag Gorontalo.',
    ];

    return {
      blob: buildValidPdf('KALENDER PENDIDIKAN MI AL-HUDA GORONTALO', lines),
      filename: 'Kalender_Pendidikan_Madrasah_Gorontalo_2025_2026.pdf',
      mimeType: 'application/pdf',
    };
  }

  // 3. Surat Permohonan Izin / Sakit Santri (Word DOCX)
  if (docId === 'doc-03' || normalizedFormat === 'DOCX' || docTitle.toLowerCase().includes('izin')) {
    const bodyHtml = `
      <div class="doc-code">Nomor: 042/MI-ALH/ADM/III/2026</div>
      <p>Kepada Yth.<br>
      Bapak/Ibu Wali Kelas & Guru Pengajar<br>
      MI Al-Huda Gorontalo<br>
      di Tempat</p>

      <p><em>Assalamu'alaikum Warahmatullahi Wabarakatuh,</em></p>

      <p>Dengan hormat, yang bertanda tangan di bawah ini:</p>
      <table class="data-table">
        <tr><td style="width: 30%;">Nama Orang Tua/Wali</td><td>: ................................................................</td></tr>
        <tr><td>Alamat</td><td>: ................................................................</td></tr>
        <tr><td>No. Telepon / WA</td><td>: ................................................................</td></tr>
      </table>

      <p>Selaku orang tua / wali santri dari:</p>
      <table class="data-table">
        <tr><td style="width: 30%;">Nama Lengkap Santri</td><td>: ................................................................</td></tr>
        <tr><td>NISN / NIS</td><td>: ................................................................</td></tr>
        <tr><td>Kelas</td><td>: ................................................................</td></tr>
      </table>

      <p>Memberitahukan bahwa ananda tersebut di atas tidak dapat mengikuti Kegiatan Belajar Mengajar (KBM) pada:</p>
      <table class="data-table">
        <tr><td style="width: 30%;">Hari, Tanggal</td><td>: ................................................................</td></tr>
        <tr><td>Alasan Tidak Masuk</td><td>: [ ] Sakit (Surat Dokter Terlampir)<br>[ ] Keperluan Keluarga Mendesak</td></tr>
      </table>

      <p>Demikian surat permohonan izin ini kami sampaikan dengan sebenarnya. Atas perhatian dan izin dari Bapak/Ibu Guru, kami haturkan terima kasih.</p>

      <p><em>Wassalamu'alaikum Warahmatullahi Wabarakatuh.</em></p>
    `;

    return {
      blob: buildValidWordDoc('SURAT PERMOHONAN IZIN SANTRI', bodyHtml),
      filename: 'Format_Surat_Izin_Sakit_Santri_MI_AlHuda.doc',
      mimeType: 'application/msword',
    };
  }

  // 4. Rekap Nilai / Excel File (XLSX / CSV)
  if (normalizedFormat === 'XLSX' || docTitle.toLowerCase().includes('nilai') || docTitle.toLowerCase().includes('rekap')) {
    const headers = [
      'No',
      'NISN',
      'Nama Santri',
      'Kelas',
      'Quran Hadist',
      'Akidah Akhlak',
      'Fikih',
      'B. Arab',
      'Matematika',
      'IPA/Sains',
      'Rata-Rata',
      'Status Kelulusan',
    ];

    const rows = [
      [1, '0134982710', 'Muhammad Rayhan Daud', 'Kelas 5A', 95, 92, 94, 90, 88, 91, 91.6, 'LULUS (Amat Baik)'],
      [2, '0134982711', 'Aisyah Putri Botutihe', 'Kelas 5A', 98, 96, 95, 94, 92, 95, 95.0, 'LULUS (Istimewa)'],
      [3, '0142381902', 'Fadhil Al-Ghifari Gobel', 'Kelas 5A', 90, 89, 91, 86, 85, 87, 88.0, 'LULUS (Baik)'],
      [4, '0129038471', 'Khadijah Nurul Jannah', 'Kelas 5A', 96, 94, 95, 92, 90, 93, 93.3, 'LULUS (Amat Baik)'],
      [5, '0138472918', 'Ahmad Dani Puluhulawa', 'Kelas 5A', 88, 87, 89, 84, 86, 85, 86.5, 'LULUS (Baik)'],
      [6, '0149201834', 'Zahra Amelia Monoarfa', 'Kelas 5A', 94, 95, 93, 91, 89, 92, 92.3, 'LULUS (Amat Baik)'],
    ];

    return {
      blob: buildValidExcelDoc('Rekap Nilai Santri Kelas 5A', headers, rows),
      filename: 'Rekap_Nilai_Santri_MI_AlHuda_2026.csv',
      mimeType: 'text/csv;charset=utf-8;',
    };
  }

  // 5. Default PDF for other documents (Buku Panduan, SPTJM, etc.)
  const lines = [
    `DOKUMEN RESMI: ${docTitle}`,
    `Kode Berkas: ${docId}`,
    `Dikeluarkan oleh: Sekretariat Madrasah Ibtidaiyah Al-Huda Gorontalo`,
    '',
    'PENJELASAN UMUM:',
    'Dokumen ini merupakan salinan digital resmi untuk kebutuhan administrasi madrasah.',
    'Seluruh civitas akademika diwajibkan mematuhi panduan dan petunjuk teknis yang termaktub di dalamnya.',
    '',
    'KETENTUAN UMUM:',
    '1. Berkas ini sah dan berlaku untuk Tahun Ajaran 2025/2026.',
    '2. Informasi di dalamnya dilindungi oleh tata tertib kelembagaan Yayasan Al-Huda Gorontalo.',
    '3. Untuk pertanyaan dan asistensi teknis, hubungi kontak resmi madrasah.',
    '',
    'Gorontalo, ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
  ];

  return {
    blob: buildValidPdf(docTitle, lines),
    filename: `${docTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`,
    mimeType: 'application/pdf',
  };
}

/**
 * Triggers native browser download and saves file to user's device
 */
export function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
