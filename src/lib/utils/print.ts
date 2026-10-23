// ---------- Cetak / simpan PDF lewat dialog print browser ----------
export const escapeHtml = (v: unknown): string =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

// CSS dokumen laporan/nota. Semua selector diawali .doc supaya aman dipakai di jendela cetak maupun di halaman PDF.
const DOC_CSS = `
  .doc{font-family:system-ui,Segoe UI,Roboto,sans-serif;color:#0f172a;padding:28px;font-size:12px;background:#fff}
  .doc h1{font-size:18px;margin:0 0 2px} .doc h2{font-size:13px;margin:18px 0 6px}
  .doc .muted{color:#64748b} .doc table{width:100%;border-collapse:collapse;margin-top:8px}
  .doc th,.doc td{border-bottom:1px solid #e2e8f0;padding:6px 4px;text-align:left;vertical-align:top}
  .doc th{font-size:10px;text-transform:uppercase;color:#64748b} .doc .r{text-align:right}
  .doc .box{display:inline-block;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px;margin:6px 8px 0 0}
  .doc .red{color:#dc2626} .doc .green{color:#059669}
  .doc tr{page-break-inside:avoid}
`;

/** Buka dialog cetak browser (bisa juga "Simpan sebagai PDF" dari sana) */
export const printHtml = (title: string, bodyHtml: string): void => {
  const w = window.open('', '_blank', 'width=900,height=700');
  if (!w) {
    alert('Pop-up diblokir browser. Izinkan pop-up untuk mencetak.');
    return;
  }
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>${DOC_CSS}</style></head><body><div class="doc">${bodyHtml}</div></body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
};

/**
 * Langsung mengunduh file PDF ke folder Download (tanpa dialog cetak), seperti downloadCsv.
 * Memakai library html2pdf.js yang dimuat hanya saat tombol diklik.
 */
export const downloadPdf = async (filename: string, bodyHtml: string): Promise<void> => {
  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;background:#fff;';
  host.innerHTML = `<style>${DOC_CSS}</style><div class="doc">${bodyHtml}</div>`;
  document.body.appendChild(host);
  try {
    const mod: any = await import('html2pdf.js');
    const html2pdf = mod.default ?? mod;
    // Buat PDF sebagai Blob, lalu unduh dengan cara yang sama seperti downloadCsv.
    // (Memakai .save() bawaan library bisa membuat browser membuka PDF di tab baru,
    //  karena prosesnya lama sehingga klik unduhnya tidak lagi dianggap dari tombol.)
    const pdfBlob: Blob = await html2pdf()
      .set({
        margin: 8,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] },
      })
      .from(host.querySelector('.doc') as HTMLElement)
      .outputPdf('blob');

    // octet-stream supaya browser tidak menampilkan PDF-nya sebagai preview
    const url = URL.createObjectURL(new Blob([pdfBlob], { type: 'application/octet-stream' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } finally {
    document.body.removeChild(host);
  }
};