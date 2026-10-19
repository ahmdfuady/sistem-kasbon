export interface FaqItem {
  q: string;
  a: string;
}

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export const FAQ_DATA: FaqItem[] = [
  {
    q: 'Apakah aplikasi ini benar-benar gratis?',
    a: 'Ya, fitur pencatatan kasbon, batas limit, dan pengingat WhatsApp santun bisa Anda gunakan 100% gratis untuk mendukung pertumbuhan warung tradisional Indonesia.'
  },
  {
    q: 'Bagaimana jika HP saya hilang atau rusak?',
    a: 'Tenang saja! Seluruh data tersimpan otomatis di cloud server yang aman. Anda cukup login kembali dengan nomor HP terdaftar di HP baru.'
  },
  {
    q: 'Apakah pelanggan tetangga harus download aplikasi ini juga?',
    a: 'Tidak perlu sama sekali! Pelanggan Anda cukup menerima nota atau pesan pengingat ramah lewat aplikasi WhatsApp yang biasa mereka pakai.'
  },
  {
    q: 'Apakah nomor kontak tetangga saya aman dan tidak disalahgunakan?',
    a: 'Sangat aman. Privasi data Anda dan nomor kontak pelanggan terenkripsi dan tidak akan pernah dibagikan ke pihak ketiga.'
  }
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    quote: 'Dulu buku kasbon sering kecipratan minyak pas goreng pisang, tulisannya kabur. Sekarang tinggal buka HP, tetangga mau ngelak juga ada rinciannya lengkap di WA.',
    name: 'Bu Siti Rodiah',
    role: 'Warung Berkah Sembako, Klaten',
    initials: 'BS'
  },
  {
    quote: 'Paling suka sama fitur pengingat WhatsApp santunnya. Nggak ada kata kasar, tetangga paham dan bayar tepat waktu tanpa musuhan.',
    name: 'Pak Hendra',
    role: 'Toko Kelontong Berjaya, Bekasi',
    initials: 'PH'
  },
  {
    quote: 'Alhamdulillah modal buat kulakan rokok dan sembako nggak kegencet kasbon lagi. Begitu nyentuh limit langsung ada tandanya.',
    name: 'Mas Yahya',
    role: 'Warung Madura 24 Jam, Tangerang',
    initials: 'YM'
  }
];