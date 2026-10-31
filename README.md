# OpenJob RESTful API — Versi 1

RESTful API aplikasi rekrutmen **OpenJob** (Node.js + Express + PostgreSQL + JWT Bearer).

## Setup

1. **PostgreSQL** — sediakan database `openjob` (user/password `postgres`), atau lewat Docker:

   ```bash
   docker run --name openjob-pg -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_USER=postgres -e POSTGRES_DB=openjob -p 5432:5432 -d postgres:16
   ```

2. **Env** — salin `.env.example` menjadi `.env`, sesuaikan `PG*`, `HOST`, `PORT`, `ACCESS_TOKEN_KEY`, `REFRESH_TOKEN_KEY`.

3. **Dependency** — `npm install`

4. **Migrasi** — `npm run migrate:up` (reversibel: `npm run migrate:down` lalu up lagi)

5. **Jalankan** — `npm run start:dev` (server di `http://HOST:PORT`)

## Scripts

| Script | Fungsi |
|---|---|
| `npm start` | jalankan server |
| `npm run start:dev` | jalankan server (nodemon) |
| `npm run migrate:up` | terapkan semua migrasi |
| `npm run migrate:down` | rollback semua migrasi |
| `npm run db:reset` | reset DB (down + up) sebelum run Newman |
| `npm run smoke` | uji end-to-end cepat (butuh DB + migrasi) |
| `npm run test:postman` | jalankan koleksi Postman via Newman |

## Uji

- **Smoke**: `npm run migrate:down && npm run migrate:up && npm run smoke`
- **Postman/Newman**: salin `[271] OpenJob API Test V1.postman_collection.json` dan `OpenJob API.postman_environment.json` ke folder `postman/`, lalu dari DB bersih:

  ```bash
  npm run migrate:down && npm run migrate:up
  npm run start:dev            # terminal terpisah
  npm run test:postman
  ```

## Autentikasi

JWT Bearer (bukan session/cookie). Access token `exp - iat = 10800` (3 jam), payload `{ id }`. Refresh token ditandatangani `REFRESH_TOKEN_KEY` dan disimpan di tabel `authentications`, dengan `jti` acak agar login berulang dalam detik sama tidak bentrok `UNIQUE(token)`.

## Struktur

```
src/
  server.js app.js config/ exceptions/ middlewares/ validators/
  routes/ controllers/ services/ utils/
migrations/            # node-pg-migrate (timestamp)
docs/erd.mmd           # sumber ERD
ERD-OpenJob-versi-1.png
```
