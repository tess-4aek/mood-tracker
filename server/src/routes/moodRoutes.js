import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import { MoodEntry } from '../models/MoodEntry.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { getNextMonthString, isValidDateString, isValidMonthString } from '../utils/date.js'

export const moodRouter = express.Router()

moodRouter.use(requireAuth)

function normalizeMoodPayload(body) {
  const date = String(body.date || '').trim()
  const moodScore = Number(body.moodScore)
  const note = String(body.note || '').slice(0, 5000)

  return { date, moodScore, note }
}

function validateMoodPayload(payload, res) {
  if (!isValidDateString(payload.date)) {
    res.status(400).json({ message: 'Некорректная дата. Используйте формат YYYY-MM-DD' })
    return false
  }

  if (!Number.isInteger(payload.moodScore) || payload.moodScore < 1 || payload.moodScore > 5) {
    res.status(400).json({ message: 'Настроение должно быть числом от 1 до 5' })
    return false
  }

  return true
}

moodRouter.get('/', asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 50), 100)
  const offset = Math.max(Number(req.query.offset || 0), 0)

  const entries = await MoodEntry
    .find({ userId: req.user._id })
    .sort({ date: -1 })
    .skip(offset)
    .limit(limit)

  res.json({ entries })
}))

moodRouter.get('/by-date/:date', asyncHandler(async (req, res) => {
  const date = req.params.date

  if (!isValidDateString(date)) {
    return res.status(400).json({ message: 'Некорректная дата' })
  }

  const entry = await MoodEntry.findOne({ userId: req.user._id, date })

  if (!entry) {
    return res.status(404).json({ message: 'Запись не найдена' })
  }

  res.json({ entry })
}))

moodRouter.get('/month/:month', asyncHandler(async (req, res) => {
  const month = req.params.month

  if (!isValidMonthString(month)) {
    return res.status(400).json({ message: 'Некорректный месяц. Используйте формат YYYY-MM' })
  }

  const nextMonth = getNextMonthString(month)

  const entries = await MoodEntry
    .find({
      userId: req.user._id,
      date: { $gte: `${month}-01`, $lt: `${nextMonth}-01` }
    })
    .sort({ date: 1 })

  res.json({ entries })
}))

moodRouter.post('/', asyncHandler(async (req, res) => {
  const payload = normalizeMoodPayload(req.body)

  if (!validateMoodPayload(payload, res)) return

  const exists = await MoodEntry.findOne({ userId: req.user._id, date: payload.date })

  if (exists) {
    return res.status(409).json({ message: 'За этот день запись уже существует' })
  }

  const entry = await MoodEntry.create({
    userId: req.user._id,
    date: payload.date,
    moodScore: payload.moodScore,
    note: payload.note
  })

  res.status(201).json({ entry })
}))

moodRouter.put('/:id', asyncHandler(async (req, res) => {
  const payload = normalizeMoodPayload(req.body)

  if (!validateMoodPayload(payload, res)) return

  const entry = await MoodEntry.findOne({ _id: req.params.id, userId: req.user._id })

  if (!entry) {
    return res.status(404).json({ message: 'Запись не найдена' })
  }

  entry.date = payload.date
  entry.moodScore = payload.moodScore
  entry.note = payload.note

  await entry.save()

  res.json({ entry })
}))

moodRouter.delete('/:id', asyncHandler(async (req, res) => {
  const entry = await MoodEntry.findOneAndDelete({ _id: req.params.id, userId: req.user._id })

  if (!entry) {
    return res.status(404).json({ message: 'Запись не найдена' })
  }

  res.json({ message: 'Запись удалена' })
}))
