const API_URL = "http://localhost:3000/api/locations";

// Inisialisasi Peta
var map = L.map("map").setView([-2.5489, 118.0149], 5); // Tengah Indonesia

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap",
}).addTo(map);

// --- 1. READ: Load Data ---
function loadLocations() {
  // Hapus marker lama agar tidak duplikat saat refresh
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((loc) => addMarkerToMap(loc));
    })
    .catch((err) => console.error("Error backend:", err));
}

function addMarkerToMap(loc) {
  var marker = L.marker([loc.lat, loc.lng]).addTo(map);

  // Popup dengan tombol Edit & Hapus
  var popupContent = `
        <b>${loc.name}</b><br>
        ${loc.desc}<br><br>
        <div style="display:flex; gap:5px;">
            <button onclick="editLocation('${loc.id}', '${loc.name}', '${loc.desc}')" style="cursor:pointer;">Edit</button>
            <button onclick="deleteLocation('${loc.id}')" style="cursor:pointer; color:red;">Hapus</button>
        </div>
    `;

  marker.bindPopup(popupContent);
}

// --- 2. CREATE: Tambah Data (Klik Peta) ---
map.on("click", function (e) {
  var name = prompt("Nama Lokasi Baru:");
  if (!name) return; // Batal jika kosong
  var desc = prompt("Deskripsi:");

  var newLoc = {
    name: name,
    lat: e.latlng.lat,
    lng: e.latlng.lng,
    desc: desc || "-",
  };

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newLoc),
  })
    .then((res) => res.json())
    .then((savedLoc) => {
      addMarkerToMap(savedLoc);
      alert("Lokasi tersimpan!");
    })
    .catch((err) => alert("Gagal simpan: " + err));
});

// --- 3. UPDATE: Edit Data ---
window.editLocation = function (id, oldName, oldDesc) {
  var newName = prompt("Edit Nama:", oldName);
  if (newName === null) return;
  var newDesc = prompt("Edit Deskripsi:", oldDesc);

  var updateData = { name: newName, desc: newDesc };

  fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  }).then((res) => {
    if (res.ok) {
      loadLocations(); // Refresh peta
      alert("Data berhasil diupdate!");
    } else {
      alert("Gagal update.");
    }
  });
};

// --- 4. DELETE: Hapus Data ---
window.deleteLocation = function (id) {
  if (!confirm("Yakin hapus?")) return;

  fetch(`${API_URL}/${id}`, { method: "DELETE" }).then((res) => {
    if (res.ok) {
      loadLocations(); // Refresh peta
    } else {
      alert("Gagal hapus.");
    }
  });
};

// Panggil saat awal
loadLocations();
