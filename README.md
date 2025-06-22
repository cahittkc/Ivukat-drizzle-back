# Ivukat Drizzle Back

## Kurulum

```bash
npm install
```

## Geliştirme Ortamı

```bash
npm run dev
```

## Ortam Değişkenleri

`.env` dosyası örneği:

```
DATABASE_URL=postgres://kullanici:parola@localhost:5432/veritabani
PORT=3000
```

## Scriptler
- `npm run dev`: Geliştirme sunucusunu başlatır (nodemon + tsx)
- `npm run lint`: ESLint ile kodu kontrol eder
- `npm run format`: Prettier ile kodu formatlar

## Dizin Yapısı
```
src/
  db/
    schema.ts
    user.ts
  routes/
    userRoutes.ts
  controllers/
    userController.ts
  middlewares/
    errorHandler.ts
    logger.ts
  utils/
    logger.ts
  index.ts
```

## Açıklama
- Tüm endpointler `/api` altında toplanır.
- Kod kalitesi için ESLint ve Prettier kullanılır.
- Hata yönetimi ve loglama için global middleware'ler vardır. 