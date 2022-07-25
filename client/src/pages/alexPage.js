import React, { useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'

export const AlexPage = () => {
  const message = useMessage()

  const { loading, error, request, clearError } = useHttp()

  // hook для валидации на frontend
  const [form, setForm] = useState({
    symbol: '',
    TimeFrame: '',
    dateStart: '',
    dateFinish: '',
    deposit: '',
    partOfDeposit: '',
    multiplier: '',
    diffVolume: '',
    takeProfit: '',
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
      const data = await request('/alexPage', 'POST', {
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
        <h2>Тест стратегии Алекса. RC 1.3</h2>
      </div>
      <hr></hr>
      {/* Запрос пользователя */}
      <form action="/alex" method="POST">
        <h4>Введите параметры:</h4>

        <div class="input-field">
          <input type="text" name="symbol" onChange={changeHandler} />
          <label>Инструмент. Например: btcusdt, ETHUSDT</label>
        </div>

        <div class="input-field">
          <input type="text" name="TimeFrame" onChange={changeHandler} />
          <label>Тайм фрейм. Например: 15m</label>
        </div>

        <p>
          Ниже укажи временной интервал в формате YYYY-MM-DDTHH:mm:ss.sss, где:
          <br />
          YYYY-MM-DD – дата в формате год-месяц-день.
          <br />
          Обычный символ T используется как разделитель.
          <br />
          HH:mm:ss.sss – время: часы-минуты-секунды-миллисекунды.
        </p>

        <div class="input-field">
          <input type="text" name="dateStart" onChange={changeHandler} />
          <label>
            Дата и время первой свечи. Например: 2022-01-01T00:00:00.000
          </label>
        </div>

        <div class="input-field">
          <input type="text" name="dateFinish" onChange={changeHandler} />
          <label>
            Дата и время последней свечи. Например: 2022-02-30T00:00:00.000
          </label>
        </div>

        <div class="input-field">
          <input type="text" name="deposit" onChange={changeHandler} />
          <label>Введите размер депозита</label>
        </div>

        <div class="input-field">
          <input type="text" name="partOfDeposit" onChange={changeHandler} />
          <label>
            Введите % от депозита для работы: от 0.01 до 1 (через точку).
            Например: 0.25
          </label>
        </div>

        <div class="input-field">
          <input type="text" name="multiplier" onChange={changeHandler} />
          <label>Введите плечо: от 1 до 20. Например: 10</label>
        </div>

        <div class="input-field">
          <input type="text" name="diffVolume" onChange={changeHandler} />
          <label>
            Отсекать сделки при разнице в объемах (считаем в %). Например: 50
          </label>
        </div>

        <div class="input-field">
          <input type="text" name="takeProfit" onChange={changeHandler} />
          <label>Введите размер ручного Take Profit (%). Например: 3</label>
        </div>

        <h6>
          Внимание! Отсутствует защита от дурака! Поэтому проверь корректность
          данных
        </h6>

        <button
          type="submit"
          class="btn"
          onClick={registerHandler}
          disabled={loading}
        >
          Запустить тест!
        </button>
      </form>

      <hr></hr>
      <div>
        <b>Время запуска скрипта: {data.startProgramAt}</b>
      </div>
      {/*таблица всех сделок № 1*/}
      <h4>Стратегия №1: "три красных". Таблица всех сделок:</h4>
      <div>
        <table>
          <tr>
            <td>№</td>
            <td>Открываем</td>
            <td>Цена входа</td>
            <td>Время входа</td>
            <td>Объем сделки</td>
            <td>Закрываем</td>
            <td>Цена выхода</td>
            <td>Время выхода</td>
            <td>Прибыль / Убыток</td>
            <td>в процентах</td>
            <td>Депозит</td>
            <td>Разница vol, %</td>
            <td>volume Green</td>
            <td>volume Red</td>
            <td>Take Profit</td>
            <td>Stop Loss</td>
          </tr>
          {data &&
            data.deals1 &&
            data.deals1.map((deal, i) => (
              <tr>
                <td>{i + 1}</td>
                <td>{deal.openPosition}</td>
                <td>{deal.openPrice}</td>
                <td>{deal.openTime}</td>
                <td>{deal.amountOfPosition}</td>
                <td>{deal.closePosition}</td>
                <td>{deal.closePrice}</td>
                <td>{deal.closeTime}</td>
                <td>{deal.profit}</td>
                <td>{deal.percent}</td>
                <td>{deal.deposit}</td>
                <td>{deal.diffVolume}</td>
                <td>{deal.volumeGreen}</td>
                <td>{deal.volumeRed}</td>
                <td>{deal.takeProfit}</td>
                <td>{deal.stopLoss}</td>
              </tr>
            ))}
        </table>
      </div>

      <hr></hr>

      {/*таблица всех сделок № 2*/}
      <h4>Стратегия №2: "требуются доработки". Таблица всех сделок:</h4>
      <div>
        <table>
          <tr>
            <td>№</td>
            <td>Открываем</td>
            <td>Цена входа</td>
            <td>Время входа</td>
            <td>Объем сделки</td>
            <td>Закрываем</td>
            <td>Цена выхода</td>
            <td>Время выхода</td>
            <td>Прибыль / Убыток</td>
            <td>в процентах</td>
            <td>Депозит</td>
            <td>Take Profit</td>
            <td>Stop Loss</td>
          </tr>
          {data &&
            data.deals2 &&
            data.deals2.map((deal, i) => (
              <tr>
                <td>{i + 1}</td>
                <td>{deal.openPosition}</td>
                <td>{deal.openPrice}</td>
                <td>{deal.openTime}</td>
                <td>{deal.amountOfPosition}</td>
                <td>{deal.closePosition}</td>
                <td>{deal.closePrice}</td>
                <td>{deal.closeTime}</td>
                <td>{deal.profit}</td>
                <td>{deal.percent}</td>
                <td>{deal.deposit}</td>
                <td>{deal.takeProfit}</td>
                <td>{deal.stopLoss}</td>
              </tr>
            ))}
        </table>
      </div>

      <hr></hr>

      {/*таблица всех сделок № 3*/}
      <h4>Стратегия №3: "без теневая". Таблица всех сделок:</h4>
      <div>
        <table>
          <tr>
            <td>№</td>
            <td>Открываем</td>
            <td>Цена входа</td>
            <td>Время входа</td>
            <td>Объем сделки</td>
            <td>Закрываем</td>
            <td>Цена выхода</td>
            <td>Время выхода</td>
            <td>Прибыль / Убыток</td>
            <td>в процентах</td>
            <td>Депозит</td>
            <td>Take Profit</td>
            <td>Stop Loss</td>
            <td>Время изменения TP/SL</td>
          </tr>
          {data &&
            data.deals3 &&
            data.deals3.map((deal, i) => (
              <tr>
                <td>{i + 1}</td>
                <td>{deal.openPosition}</td>
                <td>{deal.openPrice}</td>
                <td>{deal.openTime}</td>
                <td>{deal.amountOfPosition}</td>
                <td>{deal.closePosition}</td>
                <td>{deal.closePrice}</td>
                <td>{deal.closeTime}</td>
                <td>{deal.profit}</td>
                <td>{deal.percent}</td>
                <td>{deal.deposit}</td>
                <td>{deal.takeProfit}</td>
                <td>{deal.stopLoss}</td>
                <td>{deal.dateChangeTPSL}</td>
              </tr>
            ))}
        </table>
      </div>
    </>
  )
}
