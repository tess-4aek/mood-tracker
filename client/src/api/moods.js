import { api } from './client'

export function getMoodEntries() {
  return api('/moods')
}

export function getMoodByDate(date) {
  return api(`/moods/by-date/${date}`)
}

export function getMoodEntriesByMonth(month) {
  return api(`/moods/month/${month}`)
}

export function createMoodEntry(payload) {
  return api('/moods', {
    method: 'POST',
    body: payload
  })
}

export function updateMoodEntry(id, payload) {
  return api(`/moods/${id}`, {
    method: 'PUT',
    body: payload
  })
}

export function deleteMoodEntry(id) {
  return api(`/moods/${id}`, {
    method: 'DELETE'
  })
}
