import { LayoutDashboard, Users, PlusCircle, FileSpreadsheet, Settings } from 'lucide-react';

export type Menu = 'beranda' | 'pelanggan_list' | 'pelanggan_detail' | 'transaksi' | 'laporan' | 'pengaturan';

export const NAV: { id: Menu; icon: any; label: string }[] = [
  { id: 'beranda', icon: LayoutDashboard, label: 'Beranda' },
  { id: 'pelanggan_list', icon: Users, label: 'Buku Pelanggan' },
  { id: 'transaksi', icon: PlusCircle, label: 'Catat Transaksi' },
  { id: 'laporan', icon: FileSpreadsheet, label: 'Laporan Keuangan' },
  { id: 'pengaturan', icon: Settings, label: 'Pengaturan' },
];
