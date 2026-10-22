// ---------- Cetak / simpan PDF lewat dialog print browser ----------
export const escapeHtml = (v: unknown): string =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

export const printHtml = (title: string, bodyHtml: string): void => {
  const w = window.open('', '_blank', 'width=900,height=700');
  if (!w) {
    alert('Pop-up diblokir browser. Izinkan pop-up untuk mencetak.');
    return;
  }
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>
  body{font-family:system-ui,Segoe UI,Roboto,sans-serif;color:#0f172a;padding:28px;font-size:12px}
  h1{font-size:18px;margin:0 0 2px} h2{font-size:13px;margin:18px 0 6px}
  .muted{color:#64748b} table{width:100%;border-collapse:collapse;margin-top:8px}
  th,td{border-bottom:1px solid #e2e8f0;padding:6px 4px;text-align:left;vertical-align:top}
  th{font-size:10px;text-transform:uppercase;color:#64748b} .r{text-align:right}
  .box{display:inline-block;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px;margin:6px 8px 0 0}
  .red{color:#dc2626} .green{color:#059669}
</style></head><body>${bodyHtml}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
};

