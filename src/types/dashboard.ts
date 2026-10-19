export type DashboardMenu = 'beranda' | 'pelanggan' | 'transaksi' | 'laporan' | 'pengaturan';

export interface SelectedCustomer {
  name: string;
  role: string;
  amount: string;
  overdue: string;
  items: string;
  waText: string;
}