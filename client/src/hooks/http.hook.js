import { useCallback, useState } from 'react'

// реализация асинхронного запроса на сервер посредством нативного API браузера fetch, но в формате hook. По сути этот hook будет позволять взаимодействовать с сервером. Он будет экспортировать определенные сущности.

export const useHttp = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // метод Минина
  const request = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setLoading(true)
      try {
        if (body) {
          body = JSON.stringify(body)
          headers['Content-Type'] = 'application/json'
        }
        console.log(`url in http.hoos.js = ${url}`)

        const response = await fetch(url, {
          method,
          body,
          headers,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Что-то пошло не так')
        }

        setLoading(false)

        return data
      } catch (e) {
        setLoading(false)
        setError(e.message)
        throw e
      }
    },
    []
  )

  //const clearError = () => setError(null)
  const clearError = useCallback(() => setError(null), [])

  return { loading, request, error, clearError }
}
