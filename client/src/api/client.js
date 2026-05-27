const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method || 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  })

  let data = null

  try {
    data = await response.json()
  } catch (error) {
    data = null
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Ошибка запроса')
  }

  return data
}
