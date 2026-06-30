# Software Design Document (SDD)
## Sistem Informasi Akademik (SIAKAD)

**Versi:** 1.0.0
**Tanggal:** 6 Juni 2026
**Nama Sistem:** SIAKAD (Sistem Informasi Akademik)
**Klien:** Universitas / Institusi Pendidikan
**Standar Dokumen:** IEEE 1016-2009

---

## Daftar Isi
1. Pendahuluan
2. Arsitektur Sistem (System Architecture)
3. Desain Komponen Berbasis Peran (Role-Based Components)
4. Desain Database (Data Design)
5. Desain Keamanan (Security Design)
6. Antarmuka Pengguna (User Interface)

---

## 1. Pendahuluan
### 1.1 Tujuan Dokumen
Dokumen Desain Perangkat Lunak (SDD) ini memberikan gambaran struktural komprehensif mengenai *software architecture* SIAKAD. SDD ditujukan bagi *software engineer*, *architect*, dan pihak *stakeholder* akademis untuk memahami abstraksi dari rancangan hingga level implementasi *codebase*.

## 2. Arsitektur Sistem (System Architecture)
SIAKAD diimplementasikan menggunakan arsitektur *Monolithic Fullstack* yang dibangun di atas kerangka kerja **Next.js 15 (App Router)**.
- **Client-Side (Browser):** Menjalankan React 18+ (RSC/Client Components) yang dirender di sisi server dan disajikan sebagai HTML dinamis ke klien.
- **Server-Side (Node.js Edge Runtime):** Middleware Edge menangani proteksi *routing*. Server Node konvensional menangani interaksi langsung dengan database PostgreSQL.
- **Lapisan Transport Data:** Pengiriman *form* dari komponen antarmuka ke *backend* menggunakan mekanisme inovatif **Next.js Server Actions**, yang secara otomatis mengeleminasi kebutuhan pengelolaan lapisan RESTful API intermediasi.

## 3. Desain Komponen Berbasis Peran (Role-Based Components)
Kode sumber dipisahkan sesuai hierarki perutean (*routing tree*) berbasis peran pengguna. Masing-masing ruang nama direktori di `/src/app` memiliki fungsi agregasi logika khusus.
1. **Modul Mahasiswa (`/mahasiswa`)**: Modul yang berpusat pada komponen KRS dan KHS. Fitur asinkron diisolasi pada `/actions/mahasiswa.ts` yang mengakses agregat tabel `Enrollment`.
2. **Modul Dosen (`/dosen`)**: Modul rekapitulasi yang berfokus pada kelas (`Kelas`) yang berelasi balik ke dosen pengampu, di mana entitas ini memiliki akses mutasi tabel `Enrollment` spesifik untuk parameter Nilai.
3. **Modul Administrator (`/admin`)**: Lapisan agnostik yang memiliki kapabilitas perhitungan silang (`COUNT` queries) pada *Master Data*.

## 4. Desain Database (Data Design)
Skema relasional dibangun menggunakan **Prisma ORM**, dirancang tangguh untuk menampung format data hierarkis universitas:

- **Entity Relationship Model (Textual ERD):**
  - Entitas `User` memiliki relasi Opsional 1:1 terhadap `Mahasiswa` maupun `Dosen`.
  - Entitas `MataKuliah` memiliki relasi 1:N terhadap entitas pecahannya, yaitu `Kelas`.
  - Entitas `Kelas` merupakan simpul pusat (N:1 terhadap `MataKuliah` dan `Dosen`).
  - Entitas `Enrollment` memecahkan relasi M:N antara `Mahasiswa` dan `Kelas`, dan dialihfungsikan secara cerdas sebagai penyimpanan metrik operasional harian (Nilai UTS, UAS, Proyek).

## 5. Desain Keamanan (Security Design)
Desain pengamanan akses SIAKAD menerapkan *Stateless Authentication*:
1. Autentikasi primer dienkapsulasi pada *Server Action* `/actions/auth.ts` yang, bila tervalidasi, membangkitkan dan menandatangani (sign) payload dalam format JSON Web Token (JWT). Pustaka kriptografi yang digunakan adalah `jose`.
2. Token diekstraksi ke dalam *HTTP-only cookie* berumur 8 jam.
3. Pengawasan kontrol akses diserahkan pada berkas hierarki tertinggi `middleware.ts` yang mencegat *request* *route* manapun, melakukan verifikasi integritas JWT rahasia (`JWT_SECRET`), dan seketika menggugurkan permintaan jika *payload role* tidak selaras.

## 6. Antarmuka Pengguna (User Interface)
- Arsitektur antarmuka mengikuti kaidah *Responsive Web Design* yang distrukturisasi melalui spesifikasi `TailwindCSS`. 
- Sistem palet grafis diturunkan dari pedoman merek universitas rujukan (SIAKAD Universitas Sebelas Maret), menggunakan paduan rona *Blue* `#2563EB` dan korpus putih minimalis untuk mengurangi keletihan visual saat penggunaan intensif (*Cognitive Load Optimization*).
