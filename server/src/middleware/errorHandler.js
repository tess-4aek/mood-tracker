export function notFound(req, res) {
  res.status(404).json({ message: 'Маршрут не найден' })
}

export function errorHandler(error, req, res, next) {
  console.error(error)

  if (error?.code === 11000) {
    return res.status(409).json({ message: 'Такая запись уже существует' })
  }

  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
  res.status(status).json({
    message: error.message || 'Ошибка сервера'
  })
}
