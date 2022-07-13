// like as AuthPage.js
import React, { useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'

export const MainPage = () => {
  const message = useMessage()

  const { loading, error, request, clearError } = useHttp()
  // hook для валидации на frontend
  const [form, setForm] = useState({
    symbol: '',
    seniorTimeFrame: '',
    lowerTimeFrame: '',
  })

  // обработка ошибок на клиенте
  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  // обработка формы (метод принимает нативный js event)
  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  // создаем запрос на сервер на основе своего hook
  const registerHandler = async () => {
    try {
      const data = await request('/api/userrequest/datarequest', 'POST', {
        ...form,
      })
      message(data.message)
    } catch (e) {}
  }

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>Тестер стратегии</h1>
        <h3>фракталы Билла Вильямса</h3>
        <div className="card blue darken-1">
          <div className="card-content white-text">
            <span className="card-title">Выбор параметров</span>
            <div>
              <div className="input-field">
                <input
                  placeholder="Например: ETHUSDT"
                  id="symbol"
                  type="text"
                  name="symbol"
                  className="yellow-input"
                  onChange={changeHandler}
                />
                <label htmlFor="Symbol">Введите название фьючерса</label>
              </div>

              <div className="input-field">
                <input
                  placeholder="Например: 1h"
                  id="seniorTimeFrame"
                  type="text"
                  name="seniorTimeFrame"
                  className="yellow-input"
                  onChange={changeHandler}
                />
                <label htmlFor="seniorTimeFrame">
                  Введите старший тайм фрэйм
                </label>
              </div>

              <div className="input-field">
                <input
                  placeholder="Например: 5m"
                  id="lowerTimeFrame"
                  type="text"
                  name="lowerTimeFrame"
                  className="yellow-input"
                  onChange={changeHandler}
                />
                <label htmlFor="lowerTimeFrame">
                  Введите младший тайм фрэйм
                </label>
              </div>
            </div>
          </div>
          <div className="card-action">
            <button
              className="btn yellow darken-4"
              onClick={registerHandler}
              disabled={loading}
            >
              Запустить скрипт
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
