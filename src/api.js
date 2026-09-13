const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getWeatherByCity = async (city, unit = 'metric') => {
    try {
        // Fetch API menggunakan template literals
        const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=${unit}`);

        // Error handling: Kota tidak ditemukan (404)
        if (response.status === 404) {
            throw new Error('Kota tidak ditemukan (404)');
        }

        // Error handling: Kesalahan server lain
        if (!response.ok) {
            throw new Error('Terjadi kesalahan saat mengambil data');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        // Error handling: Menangkap Network Error (gagal fetch)
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            throw new Error('Network error: Periksa koneksi internetmu');
        }
        throw error;
    }
};

//forecast 5 hari
export const getForecastByCity = async (city, unit = 'metric') => {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${unit}`);
        
        if (!response.ok) {
            throw new Error('Gagal mengambil data prakiraan cuaca');
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching forecast:", error);
        return null; // Kembalikan null jika gagal agar tidak merusak tampilan utama
    }
};