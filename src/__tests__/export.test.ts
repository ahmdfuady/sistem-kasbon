import { describe, it, expect, vi, afterEach } from 'vitest';
import { downloadCsv, printHtml } from '../lib/utils';

/**
 * downloadCsv / printHtml talk to the browser (Blob, <a download>, window.open).
 * Here the browser parts are replaced with small fakes so the test can inspect
 * exactly what would have been downloaded.
 */
function captureDownload() {
  let blob: Blob | undefined;
  const link = { href: '', download: '', click: vi.fn(), remove: vi.fn() };
  vi.spyOn(URL, 'createObjectURL').mockImplementation((b: any) => {
    blob = b as Blob;
    return 'blob:test';
  });
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  vi.stubGlobal('document', { createElement: () => link, body: { appendChild: vi.fn() } });
  return { link, getBlob: () => blob as Blob };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('export: CSV download', () => {
  it('writes a UTF-8 BOM, comma-separated cells and CRLF between rows', async () => {
    const { getBlob } = captureDownload();
    downloadCsv('x.csv', [['Nama', 'Sisa'], ['Budi', 50000]]);
    const bytes = new Uint8Array(await getBlob().arrayBuffer());
    expect(Array.from(bytes.slice(0, 3))).toEqual([0xef, 0xbb, 0xbf]); // Excel reads Indonesian text correctly
    expect(await getBlob().text()).toBe('Nama,Sisa\r\nBudi,50000');
  });

  it('quotes cells with commas, semicolons or line breaks and doubles inner quotes', async () => {
    const { getBlob } = captureDownload();
    downloadCsv('x.csv', [['Budi, Warung "Maju"', 'a;b', 'baris1\nbaris2']]);
    expect(await getBlob().text()).toBe('"Budi, Warung ""Maju""","a;b","baris1\nbaris2"');
  });

  it('turns empty values into empty cells and leaves numbers unquoted', async () => {
    const { getBlob } = captureDownload();
    downloadCsv('x.csv', [['A', null, undefined, 0, 12500]]);
    expect(await getBlob().text()).toBe('A,,,0,12500');
  });

  it('downloads under the given file name and removes the temporary link', () => {
    const { link } = captureDownload();
    downloadCsv('laporan-kasbon-2026-10.csv', [['x']]);
    expect(link.download).toBe('laporan-kasbon-2026-10.csv');
    expect(link.href).toBe('blob:test');
    expect(link.click).toHaveBeenCalled();
    expect(link.remove).toHaveBeenCalled();
  });
});

describe('export: printing', () => {
  it('tells the user instead of crashing when the browser blocks the print pop-up', () => {
    const alertFn = vi.fn();
    vi.stubGlobal('window', { open: () => null });
    vi.stubGlobal('alert', alertFn);
    expect(() => printHtml('Laporan', '<p>isi</p>')).not.toThrow();
    expect(alertFn).toHaveBeenCalled();
  });
});