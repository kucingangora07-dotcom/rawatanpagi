let scheduleData = {};
let selectedDateKey = "";

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    const today = new Date();
    displayFormattedDate(today);

    try {
        let response = await fetch('data-schedule.json?t=' + new Date().getTime());
        if (!response.ok) throw new Error('Gagal mengambil data-schedule.json');

        scheduleData = await response.json();
        selectedDateKey = getISOString(today);

        // Jika tanggal hari ini tidak ada di JSON, ambil tanggal paling pertama yang ada
        if (!scheduleData[selectedDateKey]) {
            selectedDateKey = Object.keys(scheduleData)[0];
        }

        muatMaterial(selectedDateKey);

    } catch (error) {
        console.error('Error loading content:', error);
    }
}

function displayFormattedDate(dateObj) {
    const namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    
    const stringTanggal = "Hari ini: " + namaHari[dateObj.getDay()] + ", " + dateObj.getDate() + " " + namaBulan[dateObj.getMonth()] + " " + dateObj.getFullYear();
    document.getElementById("tampilTanggal").innerText = stringTanggal;
}

function getISOString(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function muatMaterial(dateKey) {
    const data = scheduleData[dateKey];
    if (!data) return;

    let folderPath = (data.folder_path || '').replace(/\\/g, '/');

    // Tombol Baca
    const btnBaca = document.getElementById('btn-baca');
    const textBox = document.getElementById('text-box');
    const renunganBody = document.getElementById('renungan-body');

    if (data.renungan) {
        btnBaca.onclick = async () => {
            const renunganUrl = `${folderPath}/${data.renungan}`;
            try {
                const res = await fetch(renunganUrl);
                if (res.ok) {
                    renunganBody.innerHTML = await res.text();
                    sembunyikanSemuaMedia();
                    document.getElementById('media-preview').classList.remove('hidden');
                    textBox.classList.remove('hidden');
                }
            } catch (e) {
                alert('File bacaan belum tersedia.');
            }
        };
    } else {
        btnBaca.onclick = () => alert('Bahan bacaan belum tersedia untuk hari ini.');
    }

    // Tombol Audio
    const btnAudio = document.getElementById('btn-audio');
    const audioBox = document.getElementById('audio-box');
    const audioPlayer = document.getElementById('audio-player');

    if (data.audio) {
        btnAudio.onclick = () => {
            audioPlayer.src = `${folderPath}/${data.audio}`;
            sembunyikanSemuaMedia();
            document.getElementById('media-preview').classList.remove('hidden');
            audioBox.classList.remove('hidden');
            audioPlayer.play();
        };
    } else {
        btnAudio.onclick = () => alert('File audio belum tersedia untuk hari ini.');
    }

    // Tombol Video
    const btnVideo = document.getElementById('btn-video');
    const videoBox = document.getElementById('video-box');
    const videoPlayer = document.getElementById('video-player');

    if (data.video) {
        btnVideo.onclick = () => {
            videoPlayer.src = `${folderPath}/${data.video}`;
            sembunyikanSemuaMedia();
            document.getElementById('media-preview').classList.remove('hidden');
            videoBox.classList.remove('hidden');
            videoPlayer.play();
        };
    } else {
        btnVideo.onclick = () => alert('File video belum tersedia untuk hari ini.');
    }
}

function sembunyikanSemuaMedia() {
    document.getElementById('text-box').classList.add('hidden');
    document.getElementById('audio-box').classList.add('hidden');
    document.getElementById('video-box').classList.add('hidden');
    
    const audioPlayer = document.getElementById('audio-player');
    const videoPlayer = document.getElementById('video-player');
    if (audioPlayer) { audioPlayer.pause(); }
    if (videoPlayer) { videoPlayer.pause(); }
}

function bukaTampilanPilihHari() {
    document.getElementById("halamanUtama").classList.add("hidden");
    document.getElementById("halamanPilihHari").classList.remove("hidden");
}

function bukaHalamanUtama() {
    document.getElementById("halamanPilihHari").classList.add("hidden");
    document.getElementById("halamanUtama").classList.remove("hidden");
}

function pilihHariDanKembali(dayIndex) {
    const foundDateKey = Object.keys(scheduleData).find(dateStr => {
        const d = new Date(dateStr + 'T00:00:00');
        return d.getDay() === dayIndex;
    });

    if (foundDateKey) {
        selectedDateKey = foundDateKey;
        const dateObj = new Date(foundDateKey + 'T00:00:00');
        displayFormattedDate(dateObj);
        muatMaterial(selectedDateKey);
        bukaHalamanUtama();
    } else {
        alert("Materi untuk hari ini belum tersedia.");
    }
}