<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font==Press+Start+2P&Syne&size=30&pause=1000&color=0EA5E9&center=true&vCenter=true&width=1000&lines=Welcome+to+StudyHub;Sistem+Manajemen+Tugas+Mahasiswa;Teknik+Informatika+-+UTM" alt="StudyHub Typing SVG" />
</p>

<p align="center">
  <a href="https://study-hub.my.id" target="_blank">
    <img src="https://img.shields.io/badge/🌐 Live Demo-study--hub.my.id-0EA5E9?style=for-the-badge" alt="Live Demo" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
</p>

<p align="center">
  <strong><i>Sistem Manajemen Tugas Mahasiswa </i></strong>
  <br />
  Program Studi Teknik Informatika, Universitas Trunojoyo Madura.
</p>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif"></a>

## 📖 Deskripsi Project

**StudyHub** adalah sebuah Sistem Manajemen Tugas Mahasiswa komprehensif yang dirancang untuk meningkatkan produktivitas dan kolaborasi akademik. Dibangun menggunakan ekosistem JavaScript modern (**React.js** dan **Node.js**), aplikasi ini mengadaptasi alur kerja visual bergaya **Kanban** yang intuitif. Antarmuka StudyHub difokuskan pada desain UI/UX yang bersih, estetik, dan profesional, dilengkapi dengan **Study Music Widget** untuk menjaga fokus mahasiswa saat mengerjakan tenggat waktu perkuliahan.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif"></a>

## ✨ Fitur Unggulan

* 📋 **Papan Kanban Interaktif**
  Manajemen status tugas secara visual melalui tiga kolom:

  * Belum Dikerjakan
  * Dalam Proses
  * Selesai

* 🌗 **Dual-Mode Theme**
  Mendukung transisi mulus antara **Light Mode** dan **Dark Mode** untuk kenyamanan mata.

* 🎵 **Study Music Widget**
  Pemutar musik relaksasi terintegrasi langsung di dalam dashboard menggunakan API pencarian.

* 👥 **Kolaborasi Kelompok (Invite Task)**
  Fitur pertemanan antar-mahasiswa dan sinkronisasi pengerjaan tugas secara berkelompok.

* 📎 **Manajemen Lampiran**
  Dukungan unggah dokumen pendukung (PDF/Gambar) langsung ke dalam kartu tugas.

* ⏰ **Indikator Tenggat Waktu**
  Peringatan visual otomatis (merah) untuk tugas yang mendekati deadline (H-1).

* 💬 **Grup Studi & Chat Real-time**
  Buat grup studi, undang teman, dan komunikasi real-time menggunakan Socket.io.

* 🤖 **AI Chatbot — StudyBot**
  Asisten belajar berbasis **Google Gemini API** yang menjawab pertanyaan akademik secara kontekstual, termasuk membaca data tugas user sendiri.

* 🖼️ **Landing Page Interaktif**
  Halaman utama dengan efek **SplashCursor** dan **MetaBalls** untuk pengalaman visual yang unik.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif"></a>

## 🛠️ Teknologi & Identitas Visual

### 💻 Tech Stack

* **Frontend:** React.js (Vite), Axios, React Router DOM
* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **Styling:** Tailwind CSS
* **Authentication:** JWT & Bcrypt
* **File Upload:** Multer
* **Music Search API:** yt-search
* **Real-time Chat:** Socket.io
* **AI Chatbot:** Google Gemini API

### 📦 Library Frontend

| Package | Fungsi |
|---|---|
| `react` + `react-dom` | Library UI utama |
| `typescript` | Static typing |
| `vite` | Build tool & dev server |
| `axios` | HTTP client ke backend API |
| `react-player` | Player audio YouTube (prop `src` di v3) |
| `socket.io-client` | Client WebSocket untuk chat real-time |
| `lucide-react` | Icon library |
| `tailwindcss` | Utility-first CSS framework |
| `sonner` | Toast notifikasi |

### 📦 Library Backend

| Package | Fungsi |
|---|---|
| `express` | Framework web server Node.js |
| `mysql2` | Driver koneksi MySQL dengan Promise support |
| `jsonwebtoken` | Generate & verifikasi JWT token |
| `bcryptjs` | Hash & compare password |
| `dotenv` | Load variabel environment dari `.env` |
| `cors` | Izinkan cross-origin request dari frontend |
| `multer` | Middleware upload file |
| `socket.io` | WebSocket server untuk chat real-time |
| `yt-search` | Pencarian video YouTube untuk fitur musik |
| `@google/generative-ai` | Google Gemini API untuk StudyBot |

### 🎨 Tema Visual & Tipografi (Clean SaaS UI)

#### ✍️ Tipografi

* `Syne` → Logo & Heading besar.
* `Outfit` → Teks UI & Paragraf.

#### 🌞 Light Mode

* Background : `#F8FAFC`
* Card : `#FFFFFF`
* Text : `#0F172A`

#### 🌙 Dark Mode

* Background : `#09090B`
* Card : `#18181B`
* Text : `#FAFAFA`

#### 🎯 Aksen Global

* Sky Blue : `#0EA5E9`
* Red Danger : `#EF4444`

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif"></a>

## 👨‍💻 Tim Pengembang & Pembagian Tugas

Proyek ini dikembangkan secara kolaboratif oleh tim yang terdiri dari 4 anggota:

### 1. Idan (Spesialis Antarmuka Frontend)

* Membangun UI/UX React.js dan layout Kanban 3 kolom.
* Menerapkan logika tombol Toggle Tema (Light/Dark).
* Mengintegrasikan `react-player` untuk antarmuka Study Music.

### 2. Riel (Database, Backend API & Visual Effects)

* Merancang struktur database MySQL dan relasi pivot `friends`.
* Mengonfigurasi `yt-search` di Node.js untuk endpoint pencarian musik.
* Mengembangkan backend API playlist musik (CRUD, play urutan/acak, antrian, search publik).
* Mengintegrasikan **Google Gemini API** untuk fitur **StudyBot AI Chatbot**.
* Membuat efek visual interaktif di Landing Page: **SplashCursor** (efek cipratan warna mengikuti kursor) dan **MetaBalls** (animasi bola cair di background hero section).

### 3. Zaki (Core Task API & Kolaborasi)

* Membangun API CRUD data Tugas di Express.js.
* Mengelola logika relasi tabel `task_members` untuk fitur Invite Task.

### 4. Ijul (Keamanan & Penyimpanan Data)

* Mengonfigurasi autentikasi Register/Login menggunakan JWT & Bcrypt.
* Mengatur middleware `multer` di Node.js untuk fitur unggah dokumen.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif"></a>

## 🚀 Panduan Instalasi (Local Development)

Ikuti langkah-langkah di bawah ini untuk menjalankan StudyHub di komputer lokal.

### 📋 Prasyarat Sistem

* Node.js (Versi 18 atau terbaru)
* MySQL (XAMPP / Laragon / HeidiSQL)
* Git

### 🗄️ Langkah 1: Persiapan Database

1. Buka phpMyAdmin / HeidiSQL.
2. Buat database baru bernama:

```sql
CREATE DATABASE studyhub;
```

3. Eksekusi query SQL yang telah disepakati oleh tim (tabel `users`, `tasks`, `friends`, `task_members`, beserta trigger dan relasi yang diperlukan).

### ⚙️ Langkah 2: Instalasi Backend (Node.js)

Clone repository dan masuk ke folder backend:

```bash
git clone https://github.com/zeovarince/StudyHub.git
cd StudyHub/backend
```

Install seluruh dependency:

```bash
npm install
```

Buat file `.env` di dalam folder `backend`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=studyhub

JWT_SECRET=rahasia_studyhub_aman

GEMINI_API_KEY=your_gemini_api_key
```

Jalankan server backend:

```bash
npm run dev
```

### 💻 Langkah 3: Instalasi Frontend (React.js)

Buka terminal baru, kemudian masuk ke folder frontend:

```bash
cd StudyHub/frontend
```

Install dependency:

```bash
npm install
```

Buat file `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Jalankan frontend:

```bash
npm run dev
```

Buka alamat berikut pada browser:

```text
http://localhost:5173
```

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif"></a>

## 📂 Struktur Project

```text
StudyHub/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── vite.config.js
│
└── README.md
```

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif"></a>

## 🌟 Tujuan Pengembangan

StudyHub dikembangkan sebagai media pembelajaran dan implementasi konsep **Full Stack Web Development**, khususnya dalam penerapan:

* Arsitektur Client-Server.
* RESTful API.
* Manajemen Database Relasional.
* Autentikasi berbasis JWT.
* Desain antarmuka modern menggunakan Tailwind CSS.
* Kolaborasi data dalam lingkungan akademik.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif"></a>

## 📄 Lisensi

Proyek ini dikembangkan untuk keperluan akademik pada **Program Studi Teknik Informatika, Universitas Trunojoyo Madura**.

<p align="center">
  Mau ikut berkontribusi? Ajukan <b>Pull Request</b> ke <a href="https://github.com/zeovarince/StudyHub">zeovarince/StudyHub</a>!<br/>
  ⭐ Jangan lupa berikan <b>Star</b> pada repository ini jika bermanfaat! ⭐
</p>
