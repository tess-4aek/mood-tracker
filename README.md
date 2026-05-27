# Mood Calendar MERN Skeleton

Личный календарь настроения на стеке:

- React + Vite, JavaScript без TypeScript
- Express
- MongoDB + Mongoose
- JWT auth через httpOnly cookie
- Email OTP auth
- shadcn-style UI components + Tailwind

## Быстрый старт

### 1. Установка

```bash
npm install
npm run install:all
```

### 2. Backend

```bash
cd server
cp .env.example .env
npm run dev
```

По умолчанию backend стартует на `http://localhost:4000`.

Для локального MongoDB можно использовать:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/mood_calendar
```

Если SMTP не настроен, OTP-код будет выводиться в консоль сервера.

### 3. Frontend

```bash
cd client
cp .env.example .env
npm run dev
```

Frontend стартует на `http://localhost:5173`.

## shadcn/ui и JavaScript

Проект уже содержит `components.json` с настройкой:

```json
"tsx": false
```

Это значит, что новые shadcn-компоненты можно добавлять в JavaScript-формате.

Пример:

```bash
cd client
npx shadcn@latest add button card input textarea dialog
```

В проекте уже есть минимальные shadcn-style компоненты в:

```txt
client/src/components/ui
```

## Основная логика

- Пользователь вводит email.
- Backend генерирует OTP и отправляет на почту или выводит в консоль.
- Пользователь вводит OTP.
- Backend создает JWT и кладет его в httpOnly cookie.
- Все записи настроения привязаны к userId.
- На один день разрешена только одна запись.
- Календарь отображает emoji по оценке настроения.

## API

### Auth

```txt
POST /api/auth/request-otp
POST /api/auth/verify-otp
POST /api/auth/logout
GET  /api/auth/me
```

### Mood entries

```txt
GET    /api/moods
GET    /api/moods/by-date/:date
GET    /api/moods/month/:month
POST   /api/moods
PUT    /api/moods/:id
DELETE /api/moods/:id
```

## Структура

```txt
mood-calendar-mern/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── App.jsx
│   └── components.json
└── server/
    ├── src/
    │   ├── config/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   ├── services/
    │   └── utils/
    └── package.json
```
# mood-tracker
# mood-tracker
