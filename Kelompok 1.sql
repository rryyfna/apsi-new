--
-- PostgreSQL database dump
--

\restrict OqN7t2dkaeA0rObvjpPY9bfRhed0A1RgaB1VZWGDnki39eKsbPCGWK2AKvBnqN9

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-06-30 12:56:31

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 873 (class 1247 OID 16402)
-- Name: Kehadiran; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Kehadiran" AS ENUM (
    'HADIR',
    'ALPA',
    'SAKIT',
    'IZIN'
);


ALTER TYPE public."Kehadiran" OWNER TO postgres;

--
-- TOC entry 870 (class 1247 OID 16390)
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'MAHASISWA',
    'DOSEN',
    'KAPRODI',
    'MUTU'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 225 (class 1259 OID 16496)
-- Name: CPL; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CPL" (
    id text NOT NULL,
    kode text NOT NULL,
    deskripsi text NOT NULL,
    "deskripsiEn" text
);


ALTER TABLE public."CPL" OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16569)
-- Name: CPMK; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CPMK" (
    id text NOT NULL,
    kode text NOT NULL,
    deskripsi text NOT NULL,
    "deskripsiEn" text,
    "mataKuliahId" text NOT NULL
);


ALTER TABLE public."CPMK" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16506)
-- Name: CourseCPLMapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CourseCPLMapping" (
    id text NOT NULL,
    "mataKuliahId" text NOT NULL,
    "cplId" text NOT NULL,
    "ukName" text NOT NULL,
    threshold double precision NOT NULL
);


ALTER TABLE public."CourseCPLMapping" OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16603)
-- Name: CpmkCplMapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CpmkCplMapping" (
    id text NOT NULL,
    "cpmkId" text NOT NULL,
    "cplId" text NOT NULL,
    bobot double precision
);


ALTER TABLE public."CpmkCplMapping" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16438)
-- Name: Dosen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Dosen" (
    id text NOT NULL,
    "userId" text NOT NULL,
    nidn text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Dosen" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16484)
-- Name: Enrollment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Enrollment" (
    id text NOT NULL,
    "mahasiswaId" text NOT NULL,
    "kelasId" text NOT NULL,
    "nilaiTugas" double precision,
    "nilaiUts" double precision,
    "nilaiUas" double precision,
    "nilaiPartisipasi" double precision,
    "nilaiProyek" double precision,
    "nilaiTotal" double precision,
    "nilaiAkhir" double precision,
    huruf text,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" text,
    "nonTeachingTemplateId" text
);


ALTER TABLE public."Enrollment" OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16549)
-- Name: Kaprodi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Kaprodi" (
    id text NOT NULL,
    "userId" text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Kaprodi" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16462)
-- Name: Kelas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Kelas" (
    id text NOT NULL,
    "mataKuliahId" text NOT NULL,
    "dosenId" text NOT NULL,
    "namaKelas" text NOT NULL,
    "tahunAkademik" text,
    "kuotaReguler" integer DEFAULT 0 NOT NULL,
    "jumlahAmbilReguler" integer DEFAULT 0 NOT NULL,
    "bobotTugas" double precision DEFAULT 20,
    "bobotUts" double precision DEFAULT 30,
    "bobotUas" double precision DEFAULT 30,
    "bobotPartisipasi" double precision DEFAULT 10,
    "bobotProyek" double precision DEFAULT 10,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" text
);


ALTER TABLE public."Kelas" OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16580)
-- Name: KelasCpmkKolomNilai; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KelasCpmkKolomNilai" (
    id text NOT NULL,
    "kelasId" text NOT NULL,
    "cpmkId" text NOT NULL,
    "namaKolom" text NOT NULL,
    bobot double precision NOT NULL
);


ALTER TABLE public."KelasCpmkKolomNilai" OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16592)
-- Name: KelasCpmkKolomNilaiScore; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KelasCpmkKolomNilaiScore" (
    id text NOT NULL,
    "enrollmentId" text NOT NULL,
    "kelasCpmkKolomNilaiId" text NOT NULL,
    nilai double precision NOT NULL
);


ALTER TABLE public."KelasCpmkKolomNilaiScore" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16427)
-- Name: Mahasiswa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Mahasiswa" (
    id text NOT NULL,
    "userId" text NOT NULL,
    nim text NOT NULL,
    name text NOT NULL,
    angkatan text,
    fakultas text,
    "programStudi" text
);


ALTER TABLE public."Mahasiswa" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16449)
-- Name: MataKuliah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MataKuliah" (
    id text NOT NULL,
    "kodeMk" text NOT NULL,
    "namaMk" text NOT NULL,
    sks integer NOT NULL,
    semester integer,
    "isNonTeaching" boolean DEFAULT false NOT NULL,
    "prasyaratId" text,
    "namaMkEn" text,
    "deskripsiEn" text
);


ALTER TABLE public."MataKuliah" OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16559)
-- Name: Mutu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Mutu" (
    id text NOT NULL,
    "userId" text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Mutu" OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16527)
-- Name: NonTeachingGradeComponent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NonTeachingGradeComponent" (
    id text NOT NULL,
    "templateId" text NOT NULL,
    "namaKriteria" text NOT NULL,
    bobot double precision NOT NULL
);


ALTER TABLE public."NonTeachingGradeComponent" OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16538)
-- Name: NonTeachingGradeScore; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NonTeachingGradeScore" (
    id text NOT NULL,
    "enrollmentId" text NOT NULL,
    "componentId" text NOT NULL,
    nilai double precision NOT NULL
);


ALTER TABLE public."NonTeachingGradeScore" OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16518)
-- Name: NonTeachingGradeTemplate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NonTeachingGradeTemplate" (
    id text NOT NULL,
    nama text NOT NULL
);


ALTER TABLE public."NonTeachingGradeTemplate" OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16613)
-- Name: Presensi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Presensi" (
    id text NOT NULL,
    "kelasId" text NOT NULL,
    "pertemuanKe" integer NOT NULL,
    tanggal timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Presensi" OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16624)
-- Name: PresensiRecord; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PresensiRecord" (
    id text NOT NULL,
    "presensiId" text NOT NULL,
    "mahasiswaId" text NOT NULL,
    status public."Kehadiran" DEFAULT 'ALPA'::public."Kehadiran" NOT NULL
);


ALTER TABLE public."PresensiRecord" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16411)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    role public."Role" NOT NULL,
    "isApproved" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 5181 (class 0 OID 16496)
-- Dependencies: 225
-- Data for Name: CPL; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CPL" (id, kode, deskripsi, "deskripsiEn") FROM stdin;
\.


--
-- TOC entry 5188 (class 0 OID 16569)
-- Dependencies: 232
-- Data for Name: CPMK; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CPMK" (id, kode, deskripsi, "deskripsiEn", "mataKuliahId") FROM stdin;
\.


--
-- TOC entry 5182 (class 0 OID 16506)
-- Dependencies: 226
-- Data for Name: CourseCPLMapping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CourseCPLMapping" (id, "mataKuliahId", "cplId", "ukName", threshold) FROM stdin;
\.


--
-- TOC entry 5191 (class 0 OID 16603)
-- Dependencies: 235
-- Data for Name: CpmkCplMapping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CpmkCplMapping" (id, "cpmkId", "cplId", bobot) FROM stdin;
\.


--
-- TOC entry 5177 (class 0 OID 16438)
-- Dependencies: 221
-- Data for Name: Dosen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Dosen" (id, "userId", nidn, name) FROM stdin;
\.


--
-- TOC entry 5180 (class 0 OID 16484)
-- Dependencies: 224
-- Data for Name: Enrollment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Enrollment" (id, "mahasiswaId", "kelasId", "nilaiTugas", "nilaiUts", "nilaiUas", "nilaiPartisipasi", "nilaiProyek", "nilaiTotal", "nilaiAkhir", huruf, "updatedAt", "updatedBy", "nonTeachingTemplateId") FROM stdin;
\.


--
-- TOC entry 5186 (class 0 OID 16549)
-- Dependencies: 230
-- Data for Name: Kaprodi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Kaprodi" (id, "userId", name) FROM stdin;
\.


--
-- TOC entry 5179 (class 0 OID 16462)
-- Dependencies: 223
-- Data for Name: Kelas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Kelas" (id, "mataKuliahId", "dosenId", "namaKelas", "tahunAkademik", "kuotaReguler", "jumlahAmbilReguler", "bobotTugas", "bobotUts", "bobotUas", "bobotPartisipasi", "bobotProyek", "updatedAt", "updatedBy") FROM stdin;
\.


--
-- TOC entry 5189 (class 0 OID 16580)
-- Dependencies: 233
-- Data for Name: KelasCpmkKolomNilai; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."KelasCpmkKolomNilai" (id, "kelasId", "cpmkId", "namaKolom", bobot) FROM stdin;
\.


--
-- TOC entry 5190 (class 0 OID 16592)
-- Dependencies: 234
-- Data for Name: KelasCpmkKolomNilaiScore; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."KelasCpmkKolomNilaiScore" (id, "enrollmentId", "kelasCpmkKolomNilaiId", nilai) FROM stdin;
\.


--
-- TOC entry 5176 (class 0 OID 16427)
-- Dependencies: 220
-- Data for Name: Mahasiswa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Mahasiswa" (id, "userId", nim, name, angkatan, fakultas, "programStudi") FROM stdin;
\.


--
-- TOC entry 5178 (class 0 OID 16449)
-- Dependencies: 222
-- Data for Name: MataKuliah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MataKuliah" (id, "kodeMk", "namaMk", sks, semester, "isNonTeaching", "prasyaratId", "namaMkEn", "deskripsiEn") FROM stdin;
\.


--
-- TOC entry 5187 (class 0 OID 16559)
-- Dependencies: 231
-- Data for Name: Mutu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Mutu" (id, "userId", name) FROM stdin;
\.


--
-- TOC entry 5184 (class 0 OID 16527)
-- Dependencies: 228
-- Data for Name: NonTeachingGradeComponent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NonTeachingGradeComponent" (id, "templateId", "namaKriteria", bobot) FROM stdin;
\.


--
-- TOC entry 5185 (class 0 OID 16538)
-- Dependencies: 229
-- Data for Name: NonTeachingGradeScore; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NonTeachingGradeScore" (id, "enrollmentId", "componentId", nilai) FROM stdin;
\.


--
-- TOC entry 5183 (class 0 OID 16518)
-- Dependencies: 227
-- Data for Name: NonTeachingGradeTemplate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NonTeachingGradeTemplate" (id, nama) FROM stdin;
\.


--
-- TOC entry 5192 (class 0 OID 16613)
-- Dependencies: 236
-- Data for Name: Presensi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Presensi" (id, "kelasId", "pertemuanKe", tanggal) FROM stdin;
\.


--
-- TOC entry 5193 (class 0 OID 16624)
-- Dependencies: 237
-- Data for Name: PresensiRecord; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PresensiRecord" (id, "presensiId", "mahasiswaId", status) FROM stdin;
\.


--
-- TOC entry 5175 (class 0 OID 16411)
-- Dependencies: 219
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, username, password, name, role, "isApproved", "createdAt") FROM stdin;
\.


--
-- TOC entry 4968 (class 2606 OID 16505)
-- Name: CPL CPL_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CPL"
    ADD CONSTRAINT "CPL_pkey" PRIMARY KEY (id);


--
-- TOC entry 4987 (class 2606 OID 16579)
-- Name: CPMK CPMK_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CPMK"
    ADD CONSTRAINT "CPMK_pkey" PRIMARY KEY (id);


--
-- TOC entry 4971 (class 2606 OID 16517)
-- Name: CourseCPLMapping CourseCPLMapping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CourseCPLMapping"
    ADD CONSTRAINT "CourseCPLMapping_pkey" PRIMARY KEY (id);


--
-- TOC entry 4996 (class 2606 OID 16612)
-- Name: CpmkCplMapping CpmkCplMapping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CpmkCplMapping"
    ADD CONSTRAINT "CpmkCplMapping_pkey" PRIMARY KEY (id);


--
-- TOC entry 4955 (class 2606 OID 16448)
-- Name: Dosen Dosen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Dosen"
    ADD CONSTRAINT "Dosen_pkey" PRIMARY KEY (id);


--
-- TOC entry 4965 (class 2606 OID 16495)
-- Name: Enrollment Enrollment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_pkey" PRIMARY KEY (id);


--
-- TOC entry 4980 (class 2606 OID 16558)
-- Name: Kaprodi Kaprodi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Kaprodi"
    ADD CONSTRAINT "Kaprodi_pkey" PRIMARY KEY (id);


--
-- TOC entry 4993 (class 2606 OID 16602)
-- Name: KelasCpmkKolomNilaiScore KelasCpmkKolomNilaiScore_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KelasCpmkKolomNilaiScore"
    ADD CONSTRAINT "KelasCpmkKolomNilaiScore_pkey" PRIMARY KEY (id);


--
-- TOC entry 4990 (class 2606 OID 16591)
-- Name: KelasCpmkKolomNilai KelasCpmkKolomNilai_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KelasCpmkKolomNilai"
    ADD CONSTRAINT "KelasCpmkKolomNilai_pkey" PRIMARY KEY (id);


--
-- TOC entry 4962 (class 2606 OID 16483)
-- Name: Kelas Kelas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Kelas"
    ADD CONSTRAINT "Kelas_pkey" PRIMARY KEY (id);


--
-- TOC entry 4951 (class 2606 OID 16437)
-- Name: Mahasiswa Mahasiswa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mahasiswa"
    ADD CONSTRAINT "Mahasiswa_pkey" PRIMARY KEY (id);


--
-- TOC entry 4959 (class 2606 OID 16461)
-- Name: MataKuliah MataKuliah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MataKuliah"
    ADD CONSTRAINT "MataKuliah_pkey" PRIMARY KEY (id);


--
-- TOC entry 4983 (class 2606 OID 16568)
-- Name: Mutu Mutu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mutu"
    ADD CONSTRAINT "Mutu_pkey" PRIMARY KEY (id);


--
-- TOC entry 4975 (class 2606 OID 16537)
-- Name: NonTeachingGradeComponent NonTeachingGradeComponent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NonTeachingGradeComponent"
    ADD CONSTRAINT "NonTeachingGradeComponent_pkey" PRIMARY KEY (id);


--
-- TOC entry 4978 (class 2606 OID 16548)
-- Name: NonTeachingGradeScore NonTeachingGradeScore_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NonTeachingGradeScore"
    ADD CONSTRAINT "NonTeachingGradeScore_pkey" PRIMARY KEY (id);


--
-- TOC entry 4973 (class 2606 OID 16526)
-- Name: NonTeachingGradeTemplate NonTeachingGradeTemplate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NonTeachingGradeTemplate"
    ADD CONSTRAINT "NonTeachingGradeTemplate_pkey" PRIMARY KEY (id);


--
-- TOC entry 5001 (class 2606 OID 16635)
-- Name: PresensiRecord PresensiRecord_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PresensiRecord"
    ADD CONSTRAINT "PresensiRecord_pkey" PRIMARY KEY (id);


--
-- TOC entry 4999 (class 2606 OID 16623)
-- Name: Presensi Presensi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Presensi"
    ADD CONSTRAINT "Presensi_pkey" PRIMARY KEY (id);


--
-- TOC entry 4947 (class 2606 OID 16426)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 4966 (class 1259 OID 16644)
-- Name: CPL_kode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CPL_kode_key" ON public."CPL" USING btree (kode);


--
-- TOC entry 4985 (class 1259 OID 16649)
-- Name: CPMK_mataKuliahId_kode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CPMK_mataKuliahId_kode_key" ON public."CPMK" USING btree ("mataKuliahId", kode);


--
-- TOC entry 4969 (class 1259 OID 16645)
-- Name: CourseCPLMapping_mataKuliahId_cplId_ukName_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CourseCPLMapping_mataKuliahId_cplId_ukName_key" ON public."CourseCPLMapping" USING btree ("mataKuliahId", "cplId", "ukName");


--
-- TOC entry 4994 (class 1259 OID 16652)
-- Name: CpmkCplMapping_cpmkId_cplId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CpmkCplMapping_cpmkId_cplId_key" ON public."CpmkCplMapping" USING btree ("cpmkId", "cplId");


--
-- TOC entry 4953 (class 1259 OID 16640)
-- Name: Dosen_nidn_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Dosen_nidn_key" ON public."Dosen" USING btree (nidn);


--
-- TOC entry 4956 (class 1259 OID 16639)
-- Name: Dosen_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Dosen_userId_key" ON public."Dosen" USING btree ("userId");


--
-- TOC entry 4963 (class 1259 OID 16643)
-- Name: Enrollment_mahasiswaId_kelasId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Enrollment_mahasiswaId_kelasId_key" ON public."Enrollment" USING btree ("mahasiswaId", "kelasId");


--
-- TOC entry 4981 (class 1259 OID 16647)
-- Name: Kaprodi_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Kaprodi_userId_key" ON public."Kaprodi" USING btree ("userId");


--
-- TOC entry 4991 (class 1259 OID 16651)
-- Name: KelasCpmkKolomNilaiScore_enrollmentId_kelasCpmkKolomNilaiId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "KelasCpmkKolomNilaiScore_enrollmentId_kelasCpmkKolomNilaiId_key" ON public."KelasCpmkKolomNilaiScore" USING btree ("enrollmentId", "kelasCpmkKolomNilaiId");


--
-- TOC entry 4988 (class 1259 OID 16650)
-- Name: KelasCpmkKolomNilai_kelasId_namaKolom_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "KelasCpmkKolomNilai_kelasId_namaKolom_key" ON public."KelasCpmkKolomNilai" USING btree ("kelasId", "namaKolom");


--
-- TOC entry 4960 (class 1259 OID 16642)
-- Name: Kelas_mataKuliahId_namaKelas_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Kelas_mataKuliahId_namaKelas_key" ON public."Kelas" USING btree ("mataKuliahId", "namaKelas");


--
-- TOC entry 4949 (class 1259 OID 16638)
-- Name: Mahasiswa_nim_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Mahasiswa_nim_key" ON public."Mahasiswa" USING btree (nim);


--
-- TOC entry 4952 (class 1259 OID 16637)
-- Name: Mahasiswa_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Mahasiswa_userId_key" ON public."Mahasiswa" USING btree ("userId");


--
-- TOC entry 4957 (class 1259 OID 16641)
-- Name: MataKuliah_kodeMk_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "MataKuliah_kodeMk_key" ON public."MataKuliah" USING btree ("kodeMk");


--
-- TOC entry 4984 (class 1259 OID 16648)
-- Name: Mutu_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Mutu_userId_key" ON public."Mutu" USING btree ("userId");


--
-- TOC entry 4976 (class 1259 OID 16646)
-- Name: NonTeachingGradeScore_enrollmentId_componentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "NonTeachingGradeScore_enrollmentId_componentId_key" ON public."NonTeachingGradeScore" USING btree ("enrollmentId", "componentId");


--
-- TOC entry 5002 (class 1259 OID 16654)
-- Name: PresensiRecord_presensiId_mahasiswaId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PresensiRecord_presensiId_mahasiswaId_key" ON public."PresensiRecord" USING btree ("presensiId", "mahasiswaId");


--
-- TOC entry 4997 (class 1259 OID 16653)
-- Name: Presensi_kelasId_pertemuanKe_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Presensi_kelasId_pertemuanKe_key" ON public."Presensi" USING btree ("kelasId", "pertemuanKe");


--
-- TOC entry 4948 (class 1259 OID 16636)
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- TOC entry 5018 (class 2606 OID 16730)
-- Name: CPMK CPMK_mataKuliahId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CPMK"
    ADD CONSTRAINT "CPMK_mataKuliahId_fkey" FOREIGN KEY ("mataKuliahId") REFERENCES public."MataKuliah"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5011 (class 2606 OID 16700)
-- Name: CourseCPLMapping CourseCPLMapping_cplId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CourseCPLMapping"
    ADD CONSTRAINT "CourseCPLMapping_cplId_fkey" FOREIGN KEY ("cplId") REFERENCES public."CPL"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5012 (class 2606 OID 16695)
-- Name: CourseCPLMapping CourseCPLMapping_mataKuliahId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CourseCPLMapping"
    ADD CONSTRAINT "CourseCPLMapping_mataKuliahId_fkey" FOREIGN KEY ("mataKuliahId") REFERENCES public."MataKuliah"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5023 (class 2606 OID 16760)
-- Name: CpmkCplMapping CpmkCplMapping_cplId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CpmkCplMapping"
    ADD CONSTRAINT "CpmkCplMapping_cplId_fkey" FOREIGN KEY ("cplId") REFERENCES public."CPL"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5024 (class 2606 OID 16755)
-- Name: CpmkCplMapping CpmkCplMapping_cpmkId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CpmkCplMapping"
    ADD CONSTRAINT "CpmkCplMapping_cpmkId_fkey" FOREIGN KEY ("cpmkId") REFERENCES public."CPMK"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5004 (class 2606 OID 16660)
-- Name: Dosen Dosen_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Dosen"
    ADD CONSTRAINT "Dosen_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5008 (class 2606 OID 16685)
-- Name: Enrollment Enrollment_kelasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES public."Kelas"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5009 (class 2606 OID 16680)
-- Name: Enrollment Enrollment_mahasiswaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES public."Mahasiswa"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5010 (class 2606 OID 16690)
-- Name: Enrollment Enrollment_nonTeachingTemplateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_nonTeachingTemplateId_fkey" FOREIGN KEY ("nonTeachingTemplateId") REFERENCES public."NonTeachingGradeTemplate"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5016 (class 2606 OID 16720)
-- Name: Kaprodi Kaprodi_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Kaprodi"
    ADD CONSTRAINT "Kaprodi_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5021 (class 2606 OID 16745)
-- Name: KelasCpmkKolomNilaiScore KelasCpmkKolomNilaiScore_enrollmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KelasCpmkKolomNilaiScore"
    ADD CONSTRAINT "KelasCpmkKolomNilaiScore_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES public."Enrollment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5022 (class 2606 OID 16750)
-- Name: KelasCpmkKolomNilaiScore KelasCpmkKolomNilaiScore_kelasCpmkKolomNilaiId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KelasCpmkKolomNilaiScore"
    ADD CONSTRAINT "KelasCpmkKolomNilaiScore_kelasCpmkKolomNilaiId_fkey" FOREIGN KEY ("kelasCpmkKolomNilaiId") REFERENCES public."KelasCpmkKolomNilai"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5019 (class 2606 OID 16740)
-- Name: KelasCpmkKolomNilai KelasCpmkKolomNilai_cpmkId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KelasCpmkKolomNilai"
    ADD CONSTRAINT "KelasCpmkKolomNilai_cpmkId_fkey" FOREIGN KEY ("cpmkId") REFERENCES public."CPMK"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5020 (class 2606 OID 16735)
-- Name: KelasCpmkKolomNilai KelasCpmkKolomNilai_kelasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KelasCpmkKolomNilai"
    ADD CONSTRAINT "KelasCpmkKolomNilai_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES public."Kelas"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5006 (class 2606 OID 16675)
-- Name: Kelas Kelas_dosenId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Kelas"
    ADD CONSTRAINT "Kelas_dosenId_fkey" FOREIGN KEY ("dosenId") REFERENCES public."Dosen"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5007 (class 2606 OID 16670)
-- Name: Kelas Kelas_mataKuliahId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Kelas"
    ADD CONSTRAINT "Kelas_mataKuliahId_fkey" FOREIGN KEY ("mataKuliahId") REFERENCES public."MataKuliah"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5003 (class 2606 OID 16655)
-- Name: Mahasiswa Mahasiswa_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mahasiswa"
    ADD CONSTRAINT "Mahasiswa_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5005 (class 2606 OID 16665)
-- Name: MataKuliah MataKuliah_prasyaratId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MataKuliah"
    ADD CONSTRAINT "MataKuliah_prasyaratId_fkey" FOREIGN KEY ("prasyaratId") REFERENCES public."MataKuliah"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5017 (class 2606 OID 16725)
-- Name: Mutu Mutu_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mutu"
    ADD CONSTRAINT "Mutu_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5013 (class 2606 OID 16705)
-- Name: NonTeachingGradeComponent NonTeachingGradeComponent_templateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NonTeachingGradeComponent"
    ADD CONSTRAINT "NonTeachingGradeComponent_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES public."NonTeachingGradeTemplate"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5014 (class 2606 OID 16715)
-- Name: NonTeachingGradeScore NonTeachingGradeScore_componentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NonTeachingGradeScore"
    ADD CONSTRAINT "NonTeachingGradeScore_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES public."NonTeachingGradeComponent"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5015 (class 2606 OID 16710)
-- Name: NonTeachingGradeScore NonTeachingGradeScore_enrollmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NonTeachingGradeScore"
    ADD CONSTRAINT "NonTeachingGradeScore_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES public."Enrollment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5026 (class 2606 OID 16775)
-- Name: PresensiRecord PresensiRecord_mahasiswaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PresensiRecord"
    ADD CONSTRAINT "PresensiRecord_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES public."Mahasiswa"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5027 (class 2606 OID 16770)
-- Name: PresensiRecord PresensiRecord_presensiId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PresensiRecord"
    ADD CONSTRAINT "PresensiRecord_presensiId_fkey" FOREIGN KEY ("presensiId") REFERENCES public."Presensi"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5025 (class 2606 OID 16765)
-- Name: Presensi Presensi_kelasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Presensi"
    ADD CONSTRAINT "Presensi_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES public."Kelas"(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2026-06-30 12:56:32

--
-- PostgreSQL database dump complete
--

\unrestrict OqN7t2dkaeA0rObvjpPY9bfRhed0A1RgaB1VZWGDnki39eKsbPCGWK2AKvBnqN9

