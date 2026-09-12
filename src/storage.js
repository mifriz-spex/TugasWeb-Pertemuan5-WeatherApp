const STORAGE_KEY = 'weather_history';

// Mengambil history dari LocalStorage
export const getHistory = () => {
    const history = localStorage.getItem(STORAGE_KEY);
    return history ? JSON.parse(history) : [];
};

// Menambahkan kota ke history
export const addHistory = (city) => {
    let history = getHistory();

    // ARRAY METHOD: filter() untuk menghapus nama kota yang sama jika sudah ada di history sebelumnya
    history = history.filter(item => item.toLowerCase() !== city.toLowerCase());

    // Masukkan kota yang baru dicari ke urutan paling awal
    history.unshift(city);

    // Batasi riwayat maksimal 5 kota saja
    if (history.length > 5) {
        history.pop();
    }

    // Simpan kembali ke LocalStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};