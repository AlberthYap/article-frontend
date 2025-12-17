
# Frontend Article App

Frontend untuk menampilkan dan mengelola artikel (Published / Draft / Trashed), tambah artikel baru, edit, dan preview.

## Requirements
- Node.js 18+

## Install
```
npm install
```

## Run (Development)
```
npm run dev
```
Buka: http://localhost:5173

## Build
```
npm run build
npm run preview
```

## Environment
Buat file `.env`:

```
VITE_API_BASE_URL=http://localhost:8080
```

Di code akses dengan:
`import.meta.env.VITE_API_BASE_URL` (env di Vite harus prefix `VITE_`). [web:508]

## API Base URL
Pastikan backend jalan di `http://localhost:8080` atau lainnya sesuai dengan API berjalan.