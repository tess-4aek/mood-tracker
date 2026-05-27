export const MOOD_OPTIONS = [
  { score: 1, emoji: '😭', label: 'Очень плохо' },
  { score: 2, emoji: '😔', label: 'Плохо' },
  { score: 3, emoji: '😐', label: 'Нормально' },
  { score: 4, emoji: '🙂', label: 'Хорошо' },
  { score: 5, emoji: '😄', label: 'Отлично' }
]

export function getMoodByScore(score) {
  return MOOD_OPTIONS.find((item) => item.score === Number(score)) || MOOD_OPTIONS[2]
}
