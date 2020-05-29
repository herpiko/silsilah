import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';

i18n.use(LanguageDetector).init({
  resources: {
    en: {
      translations: {
        Tree: 'Tree',
        List: 'List',
        'Zoom in': 'Zoom in',
        'Zoom out': 'Zoom out',
        Reset: 'Reset',
        Export: 'Export',
        'Export to JSON': 'Export to JSON',
        'Export to PDF': 'Export to PDF',
        Import: 'Import',
        'Original derivatives': 'Original derivatives',
        Outsider: 'Outsider',
        Divorced: 'Divorced',
        Deceased: 'Deceased',

        Add: 'Add',
        Search: 'Search...',
        Name: 'Name',
        'Full name': 'Full name',
        'Birth place': 'Birth place',
        'Birth date': 'Birth date',
        City: 'City',
        Contact: 'Contact',
        Gender: 'Gender',
        Status: 'Status',
        Male: 'Male',
        Female: 'Female',
        Other: 'Other',
        Spouse: 'Spouse',
        Alive: 'Alive',
        '1st Parent': '1st Parent',
        '2nd Parent': '2nd Parent',
        Exs: 'Exs',
        Select: 'Select',
        Save: 'Save',
        Remove: 'Remove',
        'Select parent for': 'Select parent for',
        'Select spouse for': 'Select spouse for',
        'Select ex for': 'Select ex for',

        // alerts
        welcomeAlert:
          'It seems that you have not created any tree yet. You can continue to edit existing basic tree structure or import your existing JSON file.',
        resetConfirm:
          'You are attempting to reset the tree to the basic tree structure. Please save your work befork dong this. Continue?',
        'Are you sure that you want to remove this node?':
          'Are you sure that you want to remove this node?',
      },
    },
    id: {
      translations: {
        Tree: 'Trah',
        List: 'Daftar',
        'Zoom in': 'Besarkan',
        'Zoom out': 'Kecilkan',
        Reset: 'Reset',
        Export: 'Ekspor',
        'Export to JSON': 'Ekspor ke JSON',
        'Export to PDF': 'Ekspor ke PDF',
        Import: 'Impor',
        'Original derivatives': 'Turunan asli',
        Outsider: 'Luar',
        Divorced: 'Cerai',
        Deceased: 'Meninggal',

        Add: 'Tambah',
        Search: 'Cari...',
        Name: 'Nama',
        'Full name': 'Nama lengkap',
        'Birth place': 'Tempat lahir',
        'Birth date': 'Tanggal lahir',
        City: 'Kota',
        Contact: 'Kontak',
        Gender: 'Jenis kelamin',
        Status: 'Status',
        Male: 'Laki',
        Female: 'Perempuan',
        Other: 'Lainnya',
        Spouse: 'Pasangan',
        Alive: 'Masih hidup',
        '1st Parent': 'Ortu pertama',
        '2nd Parent': 'Ortu kedua',
        Exs: 'Mantan',
        Select: 'Pilih',
        Save: 'Simpan',
        Remove: 'Hapus',
        'Select parent for': 'Pilih ortu untuk',
        'Select spouse for': 'Pilih pasangan untuk',
        'Select ex for': 'Pilih mantan untuk',

        // alerts
        welcomeAlert:
          'Anda sepertinya belum membuat silsilah. Silakan lanjut menyunting struktur silsilah yang ada atau impor berkas JSON Anda jika ada.',
        resetConfirm:
          'Anda akan mereset silsilah ke struktur sederhana. Simpan/ekspor terlebih dahulu silsilah Anda sebelum melakukan ini. Lanjut reset?',
        'Are you sure that you want to remove this node?':
          'Apakah Anda yakin ingin menghapus ini?',
      },
    },
  },
  fallbackLng: 'en',
  debug: true,
  ns: ['translations'],
  defaultNS: 'translations',

  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  react: {
    wait: true,
  },
});

export default i18n;
