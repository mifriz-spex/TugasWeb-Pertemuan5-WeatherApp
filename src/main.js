import './style.css';
import { getWeatherByCity } from './api.js';
import { addHistory } from './storage.js';

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const errorMsg = document.getElementById('error-msg');
const weatherInfo = document.getElementById('weather-info');

// DOM Elements Info Cuaca
const cityName = document.getElementById('city-name');
const currentDate = document.getElementById('current-date');
const weatherIcon = document.getElementById('weather-icon');
const tempValue = document.getElementById('temp-value');
const conditionTxt = document.getElementById('condition-txt');
const humidityValue = document.getElementById('humidity-value');
const windValue = document.getElementById('wind-value');
const unitToggle = document.getElementById('unit-toggle');

// State Variables
let currentUnit = 'metric'; // 'metric' = Celcius, 'imperial' = Fahrenheit
let currentCity = '';

// Arrow Function: Format tanggal
const formatDate = () => {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return new Date().toLocaleDateString('en-GB', options);
};

// Fungsi untuk mengganti background berdasarkan cuaca
const updateBackground = (weatherCondition) => {
    let bgUrl = '';

    switch (weatherCondition) {
        case 'Clear':
            bgUrl = 'cerah.jpg';
            break;
        case 'Clouds':
            bgUrl = 'mendung.jpg';
            break;
        case 'Rain':
        case 'Drizzle':
            bgUrl = 'hujan.jpg';
            break;
        case 'Thunderstorm':
            bgUrl = 'badai.jpg';
            break;
        case 'Snow':
            bgUrl = 'salju.jpg'; // Opsional kalau mau nambah salju
            break;
        default:
            bgUrl = 'normal.jpg'; // Background default kalau cuaca tidak terdefinisi
    }

    // Mengganti background body CSS secara dinamis
    document.body.style.backgroundImage = `url('${bgUrl}')`;
};

// Arrow Function: Update UI setelah data berhasil diambil
const updateUI = (data) => {
    cityName.textContent = data.name;
    currentDate.textContent = formatDate();

    updateBackground(data.weather[0].main);
    
    // Set icon dari OpenWeatherMap
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    
    tempValue.textContent = Math.round(data.main.temp);
    conditionTxt.textContent = data.weather[0].description;
    humidityValue.textContent = `${data.main.humidity}%`;
    windValue.textContent = `${data.wind.speed} ${currentUnit === 'metric' ? 'm/s' : 'mph'}`;

    // Tampilkan data, sembunyikan loading & error
    loadingState.classList.add('hidden');
    errorState.classList.add('hidden');
    weatherInfo.classList.remove('hidden');
    weatherInfo.classList.add('flex');
};

// Arrow Function: Mengambil data dan mengatur transisi loading
const fetchWeather = async (city) => {
    if (!city) return;

    // Tampilkan state Loading
    weatherInfo.classList.remove('flex');
    weatherInfo.classList.add('hidden');
    errorState.classList.add('hidden');
    
    loadingState.classList.remove('hidden');
    loadingState.classList.add('flex');

    try {
        const weatherData = await getWeatherByCity(city, currentUnit);
        
        currentCity = city; 
        addHistory(city); // Simpan ke history menggunakan storage.js
        updateUI(weatherData);

    } catch (error) {
        // Tampilkan state Error
        loadingState.classList.remove('flex');
        loadingState.classList.add('hidden');
        
        errorState.classList.remove('hidden');
        errorState.classList.add('flex');
        
        errorMsg.textContent = error.message;
    }
};

// --- EVENT LISTENERS ---

// Event Klik Tombol Cari
searchBtn.addEventListener('click', () => {
    fetchWeather(cityInput.value.trim());
});

// Event Tekan Enter di Input
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchWeather(cityInput.value.trim());
    }
});

// Bonus: Fitur Toggle Suhu (°C / °F)
unitToggle.addEventListener('click', () => {
    if (!currentCity) return; // Mencegah toggle jika belum ada data kota

    if (currentUnit === 'metric') {
        currentUnit = 'imperial';
        unitToggle.textContent = '°F';
    } else {
        currentUnit = 'metric';
        unitToggle.textContent = '°C';
    }
    
    // Panggil ulang API dengan unit satuan yang baru
    fetchWeather(currentCity);
});

// (Opsional) Sembunyikan info cuaca saat aplikasi baru pertama kali dimuat
weatherInfo.classList.add('hidden');