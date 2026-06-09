# Siakad Fedo

Sistem Informasi Akademik (SIAKAD) yang dibangun menggunakan [Next.js](https://nextjs.org), Prisma ORM, dan PostgreSQL.

## Prasyarat (Prerequisites)

Sebelum menjalankan aplikasi ini, pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (versi 18.x atau lebih baru)
- [PostgreSQL](https://www.postgresql.org/) (pastikan service database berjalan)

## Panduan Instalasi (Setup Tutorial)

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi setelah melakukan *clone* dari repository:

### 1. Clone Repository

```bash
git clone <url-repository-github-anda>
cd Siakad_Fedo
```

### 2. Install Dependencies

Jalankan perintah berikut untuk mengunduh semua paket yang dibutuhkan:

```bash
npm install
```

### 3. Konfigurasi Environment Variables

Aplikasi ini membutuhkan file konfigurasi environment untuk dapat terkoneksi ke database.

1. Salin file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
2. Buka file `.env` dan sesuaikan kredensial PostgreSQL Anda (username, password, port, dan nama database) pada variabel `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`, dan `DATABASE_URL`. Ubah juga `JWT_SECRET` menjadi teks acak yang aman.

### 4. Setup Database & Prisma

Setelah `.env` terkonfigurasi, Anda harus melakukan migrasi skema Prisma ke dalam database PostgreSQL Anda.

Jalankan perintah ini:

```bash
npx prisma db push
```

*Catatan: Perintah di atas akan membaca file `prisma/schema.prisma` dan membuatkan tabel-tabel yang diperlukan di database PostgreSQL Anda.*

### 5. Seeding Database (Opsional namun sangat disarankan)

Karena database yang baru dibuat masih kosong, Anda bisa menjalankan *seed script* untuk mengisi data awal (termasuk akun administrator default dan data dummy lainnya).

```bash
npx ts-node scripts/seed.ts
```

*Jika terjadi error terkait module, Anda juga bisa mencoba menjalankan: `npx prisma db seed` jika sudah dikonfigurasi di `package.json`.*

### 6. Jalankan Server Development

Sekarang aplikasi siap dijalankan:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

---

## Learn More (Bawaan Next.js)

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
