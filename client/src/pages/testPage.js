import React, { useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'

export const TestPage = () => {
  const message = useMessage()

  const { loading, error, request, clearError } = useHttp()

  // hook для валидации на frontend
  const [form, setForm] = useState({})

  // обработка ошибок на клиенте
  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  // создаем запрос на сервер на основе своего hook
  const registerHandler = async () => {
    try {
      const data = await request('/testPage', 'POST', {
        ...form,
      })
      //message(data.message)
      console.log(data)
      setData(data) //  установил данные в React
      //setStartTrend(data.startOfTrend)
    } catch (e) {}
  }

  const [data, setData] = useState({})

  return (
    <>
      <div>
        <h3>Тест функций Binance</h3>
      </div>
      <hr></hr>
      <form action="/test" method="POST">
        <h4>Смотри данные в консоли браузера</h4>

        <button
          type="submit"
          class="btn"
          onClick={registerHandler}
          disabled={loading}
        >
          Запустить тест!
        </button>
      </form>
    </>
  )
}
