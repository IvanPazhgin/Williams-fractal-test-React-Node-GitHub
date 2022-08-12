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
    stopLoss: '',
    diffShadow35big: '', // стратегия 3.5
    diffShadow35small: '', // стратегия 3.5
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
        <h3>
          Тест стратегий Алекса: <b>3.5</b> и <b>3.7</b>
        </h3>
      </div>
      <hr></hr>
      <form action="/alex" method="POST">
        <h4>параметры:</h4>

        <div class="input-field">
          <input type="text" name="symbol" onChange={changeHandler} />
          <label>Инструмент: btcusdt, ETHUSDT</label>
        </div>

        <div class="input-field">
          <input type="text" name="TimeFrame" onChange={changeHandler} />
          <label>Тайм фрейм: 2h</label>
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
          <label>Дата и время первой свечи: 2022-01-01T00:00:00.000</label>
        </div>

        <div class="input-field">
          <input type="text" name="dateFinish" onChange={changeHandler} />
          <label>Дата и время последней свечи: 2022-02-30T00:00:00.000</label>
        </div>

        <div class="input-field">
          <input type="text" name="deposit" onChange={changeHandler} />
          <label>размер депозита</label>
        </div>

        <div class="input-field">
          <input type="text" name="partOfDeposit" onChange={changeHandler} />
          <label>
            % от депозита: от 0.01 до 1 (через точку). Например: 0.25
          </label>
        </div>

        <div class="input-field">
          <input type="text" name="multiplier" onChange={changeHandler} />
          <label>плечо: от 1 до 20. Например: 10</label>
        </div>

        <div class="input-field">
          <input type="text" name="takeProfit" onChange={changeHandler} />
          <label>размер ручного Take Profit (%). Например: 4</label>
        </div>

        <div class="input-field">
          <input type="text" name="stopLoss" onChange={changeHandler} />
          <label>размер ручного Stop Loss(%). Например: 2</label>
        </div>

        <p>
          <b>Для стратегии 3.5:</b>
          <br /> <b>Сигнал № 1 (3 зеленых, 1 красная):</b> введи процент
          отношения верхней тени к нижней тени (на красной свечке).
          <br />
          Условие проверки: отношение меньше значения пользователя.
          <br /> Допустимо: 0.139 - 0.625
          <br /> Не допустимо: 0.853
        </p>
        <div class="input-field">
          <input type="text" name="diffShadow35big" onChange={changeHandler} />
          <label>процент отношения теней. Например: 0.62</label>
        </div>

        <p>
          <b>сигнал №3</b>
          <br /> на красной верхняя тень сильно меньше нижней тени.{' '}
          <b>Низкий коэффициент. Задает пользователь</b>.
          <br /> Условие проверки: отношение меньше значения пользователя.
          <br /> на примере atomusdt 24.07 at 09:00 коэффициент = 0.102
        </p>
        <div class="input-field">
          <input
            type="text"
            name="diffShadow35small"
            onChange={changeHandler}
          />
          <label>микро процент отношения теней. Например: 0.11</label>
        </div>

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
      <h5>Общие рекомендации:</h5>
      <div>
        <table>
          <tr>
            <td>Стратегия</td>
            <td>таймфрейм</td>
            <td>Take Profit</td>
            <td>Stop Loss</td>
            <td>Выставлены</td>
          </tr>
          <tr>
            <td>3.5: без теневая</td>
            <td>2h</td>
            <td>4%</td>
            <td>2%</td>
            <td>в коде</td>
          </tr>
        </table>
      </div>

      <hr></hr>
      <div>
        <b>Время запуска скрипта: {data.startProgramAt}</b>
      </div>

      <hr></hr>

      {/*таблица всех сделок № 3.5*/}
      <h4>Стратегия №3.5: "без теневая"</h4>

      <h5>Общая статистика:</h5>
      {data && data.statistics35 && (
        <div>
          <div>Депозит в начале: {data.statistics35.depositAtStart} USD</div>
          <div>Депозит в конце: {data.statistics35.depositAtEnd} USD</div>
          <div>
            Итоговая прибыль/убыток: {data.statistics35.globalProfit} USD
          </div>
          <div>ROI: {data.statistics35.roi} %</div>

          <p></p>
          <div>
            Всего сделок: {data.statistics35.allDealsCount}, из которых:
          </div>
          <div>
            - кол-во положительных сделок: {data.statistics35.countOfPositive}
          </div>
          <div>
            - кол-во отрицательных сделок: {data.statistics35.countOfNegative}
          </div>
          <div>- кол-во нулевых сделок: {data.statistics35.countOfZero}</div>
        </div>
      )}

      <h5>Таблица всех сделок:</h5>
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
            <td>Время изменения TP</td>
            <td>Время изменения SL</td>
            <td>Сигнал</td>
          </tr>
          {data &&
            data.deals35 &&
            data.deals35.map((deal, i) => (
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
                <td>{deal.dateChangeTP}</td>
                <td>{deal.dateChangeSL}</td>
                <td>{deal.whitchSignal}</td>
              </tr>
            ))}
        </table>
      </div>

      <hr></hr>

      {/*таблица всех сделок № 3.7*/}
      <h4>Стратегия №3.7: "без теневая"</h4>

      <h5>Общая статистика:</h5>
      {data && data.statistics37 && (
        <div>
          <div>Депозит в начале: {data.statistics37.depositAtStart} USD</div>
          <div>Депозит в конце: {data.statistics37.depositAtEnd} USD</div>
          <div>
            Итоговая прибыль/убыток: {data.statistics37.globalProfit} USD
          </div>
          <div>ROI: {data.statistics37.roi} %</div>

          <p></p>
          <div>
            Всего сделок: {data.statistics37.allDealsCount}, из которых:
          </div>
          <div>
            - кол-во положительных сделок: {data.statistics37.countOfPositive}
          </div>
          <div>
            - кол-во отрицательных сделок: {data.statistics37.countOfNegative}
          </div>
          <div>- кол-во нулевых сделок: {data.statistics35.countOfZero}</div>
        </div>
      )}

      <h5>Таблица всех сделок:</h5>
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
            <td>Депозит2</td>
            <td>Take Profit</td>
            <td>Stop Loss</td>
            <td>Время изменения TP</td>
            <td>Время изменения SL</td>
            <td>Сигнал</td>
          </tr>
          {data &&
            data.deals37 &&
            data.deals37.map((deal, i) => (
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
                <td>{deal.deposit2}</td>
                <td>{deal.takeProfit}</td>
                <td>{deal.stopLoss}</td>
                <td>{deal.dateChangeTP}</td>
                <td>{deal.dateChangeSL}</td>
                <td>{deal.whitchSignal}</td>
              </tr>
            ))}
        </table>
      </div>
    </>
  )
}
