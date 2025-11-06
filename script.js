// 1. Inisialisasi Peta
// Kita set 'map' ke div dengan id 'map'
var map = L.map('map');

// 2. Tambahkan Tile Layer (Peta Dasarnya)
// Kita tetap pakai OpenStreetMap (gratis)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// 3. Siapkan Data Lokasi (Array of Objects)
// Ini adalah cara standar jika Anda punya banyak data
var locations = [
    { 
        name: "Monas, Jakarta", 
        lat: -6.175392, 
        lng: 106.827153, 
        desc: "Monumen Nasional, ikon utama kota Jakarta." 
    },
    { 
        name: "Candi Borobudur, Magelang", 
        lat: -7.607874, 
        lng: 110.203804, 
        desc: "Candi Buddha terbesar di dunia, warisan UNESCO." 
    },
    { 
        name: "Raja Ampat, Papua Barat", 
        lat: -0.556277, 
        lng: 130.518335, 
        desc: "Gugusan pulau tropis dengan keindahan bawah laut." 
    }
];

// 4. Looping Data dan Tambahkan Marker
var markerGroup = []; // Kita siapkan array kosong untuk menampung marker

locations.forEach(function(loc) {
    // Membuat marker untuk setiap lokasi
    var marker = L.marker([loc.lat, loc.lng]).addTo(map);
    
    // Menambahkan popup ke setiap marker
    marker.bindPopup(`<b>${loc.name}</b><br>${loc.desc}`);
    
    // Menambahkan marker ke group
    markerGroup.push(marker);
});

// 5. Tambahkan Bentuk (Shapes)
// Menambah Lingkaran (Circle) di sekitar Monas
var circle = L.circle([-6.175392, 106.827153], {
    color: 'red',       // Warna garis
    fillColor: '#f03',  // Warna isian
    fillOpacity: 0.4, // Transparansi isian
    radius: 1000        // Radius dalam meter
}).addTo(map);
circle.bindPopup("Radius 1km dari Monas.");

// Menambah Poligon (Polygon) - misal segitiga imajiner di Jawa
var polygon = L.polygon([
    [-6.917464, 107.619123], // Bandung
    [-7.257472, 112.752088], // Surabaya
    [-7.795580, 110.369490]  // Yogyakarta
], {
    color: 'blue',
    fillColor: '#3388ff',
    fillOpacity: 0.3
}).addTo(map);
polygon.bindPopup("Contoh Poligon: Segitiga JATIM-JABAR-DIY");


// 6. Set View Peta secara Otomatis
// Kita buat peta otomatis zoom dan center agar semua marker terlihat
var group = L.featureGroup(markerGroup); // Buat grup dari marker
map.fitBounds(group.getBounds().pad(0.2)); // pad(0.2) memberi sedikit padding