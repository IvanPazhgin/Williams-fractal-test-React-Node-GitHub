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
        <h2>
          Тест стратегии Алекса: <b>3.3</b>, 3.4, 3.5, 4.0
        </h2>
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
            Отсекать сделки при разнице в объемах <b>для стратегии №1</b>{' '}
            (считаем в %). Например: 50
          </label>
        </div>

        <div class="input-field">
          <input type="text" name="takeProfit" onChange={changeHandler} />
          <label>Введите размер ручного Take Profit (%). Например: 3</label>
        </div>

        <div class="input-field">
          <input type="text" name="stopLoss" onChange={changeHandler} />
          <label>Введите размер ручного Stop Loss(%). Например: 3</label>
        </div>

        <p>
          <b>Для стратегии 3.5:</b>
          <br /> <b>Сигнал № 1 (3 зеленых, 1 красная):</b> введите процент
          отношения верхней тени к нижней тени на красной свечке.
          <br />
          Условие проверки: отношение меньше значения пользователя.
          <br /> Допустимо (на примерах из tg) до: 0.625. Минимальные значения
          были 0.139
          <br /> Не допустимо (на примерах из tg) больше: 0.853
        </p>
        <div class="input-field">
          <input type="text" name="diffShadow35big" onChange={changeHandler} />
          <label>Введите процент отношения теней. Например: 0.62</label>
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
          <label>Введите микро процент отношения теней. Например: 0.11</label>
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
      <h4>Стратегия №2: "требуются доработки"</h4>
      <p>временно отключена</p>
      {/* 
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
      */}
      <hr></hr>

      {/*таблица всех сделок № 3.3*/}
      <h4>Стратегия №3.3: "без теневая"</h4>
      <p>
        <b>РАБОЧАЯ</b>
      </p>

      <h5>Общая статистика:</h5>
      {data && data.statistics33 && (
        <div>
          <div>Депозит в начале: {data.statistics33.depositAtStart} USD</div>
          <div>Депозит в конце: {data.statistics33.depositAtEnd} USD</div>
          <div>
            Итоговая прибыль/убыток: {data.statistics33.globalProfit} USD
          </div>
          <div>ROI: {data.statistics4.roi} %</div>

          <p></p>
          <div>
            Всего сделок: {data.statistics33.allDealsCount}, из которых:
          </div>
          <div>
            - кол-во положительных сделок: {data.statistics33.countOfPositive}
          </div>
          <div>
            - кол-во отрицательных сделок: {data.statistics33.countOfNegative}
          </div>
          <div>- кол-во нулевых сделок: {data.statistics33.countOfZero}</div>
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
            <td>Время изменения TP/SL</td>
            <td>diffSL</td>
          </tr>
          {data &&
            data.deals33 &&
            data.deals33.map((deal, i) => (
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
                <td>{deal.diffSL}</td>
              </tr>
            ))}
        </table>
      </div>

      <hr></hr>

      {/*таблица всех сделок № 3.4*/}
      <h4>Стратегия №3.4: "без теневая"</h4>
      <p>
        <b>
          PS: Посчитать какой указать коэффициент тени для "безтеневой" свечи
        </b>
      </p>

      <h5>Общая статистика:</h5>
      {data && data.statistics34 && (
        <div>
          <div>Депозит в начале: {data.statistics34.depositAtStart} USD</div>
          <div>Депозит в конце: {data.statistics34.depositAtEnd} USD</div>
          <div>
            Итоговая прибыль/убыток: {data.statistics34.globalProfit} USD
          </div>
          <div>ROI: {data.statistics34.roi} %</div>

          <p></p>
          <div>
            Всего сделок: {data.statistics34.allDealsCount}, из которых:
          </div>
          <div>
            - кол-во положительных сделок: {data.statistics34.countOfPositive}
          </div>
          <div>
            - кол-во отрицательных сделок: {data.statistics34.countOfNegative}
          </div>
          <div>- кол-во нулевых сделок: {data.statistics34.countOfZero}</div>
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
            <td>Время изменения TP/SL</td>
            <td>diffSL</td>
          </tr>
          {data &&
            data.deals34 &&
            data.deals34.map((deal, i) => (
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
                <td>{deal.diffSL}</td>
              </tr>
            ))}
        </table>
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

      {/*таблица всех сделок № 4*/}
      <h4>Стратегия №4: "1h - часовик"</h4>
      <p>
        <b>Проверка общих условий для входа</b>
        <br /> 1. 1я свеча - зеленая
        <br /> 2. 2я свеча - зеленая
        <br /> 3. если тень 2й зеленой меньше на 30% 1й зеленой и более
        <br /> 4. у 2й зеленой есть хоть какая-нибудь минимальная тень
        <br /> 5. 3я свеча - красная
        <br /> 6. цена закрытия 3й красной свечи больше половины тела 2й зеленой
        свечи
        <br /> <b>то ждем 2 возможных сигнала:</b>
        <br /> сигнал №1: если vol 3 красной больше vol зеленой 2, то вход на
        середине тела 3й красной свечи
        <br /> сигнал №2: иначе цена входа = close 3й свечи
        <br /> <b>изменение TP и SL:</b>
        <br /> на 5й свече (в момент ее открытия):
        <br /> 1. если мы сидим в плюсе, то переносим SL на точку входа
        <br /> 2. если мы сидим в минусе, то переносим TP на точку входа
        <br /> <b>условия выхода из сделки по TP</b>: low price меньше take
        profit
        <br /> <b>условия выхода из сделки по SL</b>: high price больше stop
        loss
      </p>
      <h5>Общая статистика:</h5>
      {data && data.statistics4 && (
        <div>
          <div>Депозит в начале: {data.statistics4.depositAtStart} USD</div>
          <div>Депозит в конце: {data.statistics4.depositAtEnd} USD</div>
          <div>
            Итоговая прибыль/убыток: {data.statistics4.globalProfit} USD
          </div>
          <div>ROI: {data.statistics4.roi} %</div>

          <p></p>
          <div>Всего сделок: {data.statistics4.allDealsCount}, из которых:</div>
          <div>
            - кол-во положительных сделок: {data.statistics4.countOfPositive}
          </div>
          <div>
            - кол-во отрицательных сделок: {data.statistics4.countOfNegative}
          </div>
          <div>- кол-во нулевых сделок: {data.statistics4.countOfZero}</div>
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
          </tr>
          {data &&
            data.deals4 &&
            data.deals4.map((deal, i) => (
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
              </tr>
            ))}
        </table>
      </div>
    </>
  )
}
