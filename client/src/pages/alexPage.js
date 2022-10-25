import React, { useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'

export const AlexPage = () => {
  const message = useMessage()

  const { loading, error, request, clearError } = useHttp()

  // hook для валидации на frontend
  const [form, setForm] = useState({
    symbol: '',
    timeFrame: '',
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
    delta: '', // стратегия 3.7
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
        <h3>Тест стратегий Алекса</h3>
      </div>
      <hr></hr>
      {/* Новая форма */}
      <div class="container py-5">
        <form class="mb-5" id="form" action="/alex" method="POST">
          <h4>параметры</h4>
          <div class="form-group">
            <label for="symbol">Монета: btcusdt, ETHUSDT</label>
            <input
              type="text"
              class="form-control"
              placeholder="введите хоть что-нибудь ))"
              id="symbol"
              name="symbol"
              onChange={changeHandler}
              required
            ></input>
          </div>

          <div class="form-group">
            <label for="timeFrame">
              Тайм фрейм: 2h (не более 12h включительно, т.к. требуются
              доработки в candlesInside)
            </label>
            <input
              type="text"
              class="form-control"
              id="timeFrame"
              name="timeFrame"
              onChange={changeHandler}
              required
            ></input>
          </div>

          <div class="form-group">
            <label for="dateStart">
              Дата и время первой свечи: 2022-01-01T00:00:00.000
            </label>
            <input
              type="text"
              class="form-control"
              id="dateStart"
              name="dateStart"
              onChange={changeHandler}
              required
            ></input>
          </div>

          <div class="form-group">
            <label for="dateFinish">
              Дата и время последней свечи: 2022-02-30T00:00:00.000
            </label>
            <input
              type="text"
              class="form-control"
              id="dateFinish"
              name="dateFinish"
              onChange={changeHandler}
              required
            ></input>
          </div>

          <div class="form-group">
            <label for="deposit">размер депозита</label>
            <input
              type="number"
              class="form-control"
              id="deposit"
              name="deposit"
              onChange={changeHandler}
              required
            ></input>
          </div>

          <div class="form-group">
            <label for="partOfDeposit">
              % от депозита: от 0.01 до 1 (через точку). Например: 0.25
            </label>
            <input
              type="number"
              class="form-control"
              id="partOfDeposit"
              name="partOfDeposit"
              onChange={changeHandler}
              required
            ></input>
          </div>

          <div class="form-group">
            <label for="multiplier">плечо: от 1 до 20. Например: 10</label>
            <input
              type="number"
              class="form-control"
              id="multiplier"
              name="multiplier"
              onChange={changeHandler}
              required
            ></input>
          </div>

          <div class="form-group">
            <label for="takeProfit">
              размер ручного Take Profit (%). Например: 4
            </label>
            <input
              type="number"
              class="form-control"
              id="takeProfit"
              name="takeProfit"
              onChange={changeHandler}
              required
            ></input>
          </div>

          <div class="form-group">
            <label for="stopLoss">
              размер ручного Stop Loss(%). Например: 2
            </label>
            <input
              type="number"
              class="form-control"
              id="stopLoss"
              name="stopLoss"
              onChange={changeHandler}
              required
            ></input>
          </div>

          <hr></hr>
          <p>
            <b>
              К1 - процент отношения верхней тени к нижней тени (на красной
              свечке)
            </b>
            <br />
            Условие проверки коэффициента: отношение меньше значения
            пользователя.
            <br /> Допустимо: 0.139 - 0.625
            <br /> Не допустимо: 0.853
          </p>

          <div class="form-group">
            <label for="diffShadow35big">
              процент отношения теней на красной свечке. Например: 0.62
            </label>
            <input
              type="number"
              class="form-control"
              id="diffShadow35big"
              name="diffShadow35big"
              onChange={changeHandler}
              required
            ></input>
          </div>
          {/*
          <p>
            <b>К2 - на красной свече верхняя тень сильно меньше нижней тени.</b>
            <br /> Низкий коэффициент. Задает пользователь.
            <br /> Условие проверки: отношение меньше значения пользователя.
            <br /> на примере atomusdt 24.07.2022 at 09:00 коэффициент = 0.102
          </p>

          <div class="form-group">
            <label for="diffShadow35small">
              микро процент отношения теней. Например: 0.11
            </label>
            <input
              type="number"
              class="form-control"
              id="diffShadow35small"
              name="diffShadow35small"
              onChange={changeHandler}
              required
            ></input>
          </div>
*/}
          <hr></hr>
          <p>
            <b>К3</b> - коэффициент для входа в сделку относительно{' '}
            <b>High Price</b> сигнальной красной свечки
            {/* <br />
            На двух примерах было вычислено: от 0.13 до 0.17.*/}
            <br />
            Ноль - коэффициент будет равень нулю.
          </p>

          <div class="form-group">
            <label for="delta">коэффициент для входа в сделку (K3 = 0.5)</label>
            <input
              type="number"
              class="form-control"
              id="delta"
              name="delta"
              onChange={changeHandler}
              required
            ></input>
          </div>

          <br />
          <button
            type="submit"
            class="btn btn-primary"
            onClick={registerHandler}
            disabled={loading}
          >
            Запустить тест!
          </button>

          {/* 
          <button
            type="submit"
            class="btn btn-primary"
            onClick={registerHandler}
            disabled={loading}
          >
            Вторая кнопка!
          </button>
        */}
        </form>
      </div>

      <hr></hr>
      <div>
        <b>Время запуска скрипта: {data.startProgramAt}</b>
      </div>

      <hr></hr>

      {/*таблица всех сделок: Слот №1*/}
      <h4>
        {data && data.statistics35 && (
          <div>{data.statistics35.nameStrategy}</div>
        )}
      </h4>

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
      <br />

      <h5>Таблица всех сделок:</h5>
      <div>
        <table class="deals">
          <thead>
            <tr>
              <th>№</th>
              <th>Open</th>
              <th>Цена входа</th>
              <th>Время входа</th>
              <th>Объем сделки</th>
              <th>Close</th>
              <th>Цена выхода</th>
              <th>Время выхода</th>
              <th>Прибыль / Убыток</th>
              <th>в процентах</th>
              {/*<th>Депозит2</th>*/}
              <th>Take Profit</th>
              <th>Stop Loss</th>
              <th>Время изменения TP</th>
              <th>Время изменения SL</th>
              <th>Сигнал</th>
            </tr>
          </thead>

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
                {/*<td>{deal.deposit2}</td>*/}
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

      {/*таблица всех сделок: Слот №2*/}
      <h4>
        {data && data.statistics37 && (
          <div>{data.statistics37.nameStrategy}</div>
        )}
      </h4>

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
          <div>- кол-во нулевых сделок: {data.statistics37.countOfZero}</div>
        </div>
      )}
      <br />

      <h5>Таблица всех сделок:</h5>
      <div>
        <table class="deals">
          <thead>
            <tr>
              <th>№</th>
              <th>Open</th>
              <th>Цена входа</th>
              <th>Время входа</th>
              <th>Объем сделки</th>
              <th>Close</th>
              <th>Цена выхода</th>
              <th>Время выхода</th>
              <th>Прибыль / Убыток</th>
              <th>в процентах</th>
              {/*<th>Депозит2</th>*/}
              <th>Take Profit</th>
              <th>Stop Loss</th>
              <th>Время изменения TP</th>
              <th>Время изменения SL</th>
              <th>Сигнал</th>
            </tr>
          </thead>
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
                {/*<td>{deal.deposit2}</td>*/}
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
      {/*таблица всех сделок: Слот 3*/}
      <h4>
        {data && data.statistics38 && (
          <div>{data.statistics38.nameStrategy}</div>
        )}
      </h4>

      <h5>Общая статистика:</h5>
      {data && data.statistics38 && (
        <div>
          <div>Депозит в начале: {data.statistics38.depositAtStart} USD</div>
          <div>Депозит в конце: {data.statistics38.depositAtEnd} USD</div>
          <div>
            Итоговая прибыль/убыток: {data.statistics38.globalProfit} USD
          </div>
          <div>ROI: {data.statistics38.roi} %</div>

          <p></p>
          <div>
            Всего сделок: {data.statistics38.allDealsCount}, из которых:
          </div>
          <div>
            - кол-во положительных сделок: {data.statistics38.countOfPositive}
          </div>
          <div>
            - кол-во отрицательных сделок: {data.statistics38.countOfNegative}
          </div>
          <div>- кол-во нулевых сделок: {data.statistics38.countOfZero}</div>
        </div>
      )}

      <br />
      <h5>Таблица всех сделок:</h5>
      <div>
        <table class="deals">
          <thead>
            <tr>
              <th>№</th>
              <th>Открываем</th>
              <th>Цена входа</th>
              <th>Время входа</th>
              <th>Объем сделки</th>
              <th>Закрываем</th>
              <th>Цена выхода</th>
              <th>Время выхода</th>
              <th>Прибыль / Убыток</th>
              <th>в процентах</th>
              {/*<th>Депозит2</th>*/}
              <th>Take Profit</th>
              <th>Stop Loss</th>
              <th>Время изменения TP</th>
              <th>Время изменения SL</th>
              <th>Сигнал</th>
              {/*<th>Условие</th>*/}
            </tr>
          </thead>

          {data &&
            data.deals38 &&
            data.deals38.map((deal, i) => (
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
                {/*<td>{deal.deposit2}</td>*/}
                <td>{deal.takeProfit}</td>
                <td>{deal.stopLoss}</td>
                <td>{deal.dateChangeTP}</td>
                <td>{deal.dateChangeSL}</td>
                <td>{deal.whitchSignal}</td>
                {/*<td>{deal.condition}</td>*/}
              </tr>
            ))}
        </table>
      </div>

      <hr></hr>
      {/*таблица всех сделок: Слот 4*/}
      <h4>
        {data && data.statistics39 && (
          <div>{data.statistics39.nameStrategy}</div>
        )}
      </h4>

      <h5>Общая статистика:</h5>
      {data && data.statistics39 && (
        <div>
          <div>Депозит в начале: {data.statistics39.depositAtStart} USD</div>
          <div>Депозит в конце: {data.statistics39.depositAtEnd} USD</div>
          <div>
            Итоговая прибыль/убыток: {data.statistics39.globalProfit} USD
          </div>
          <div>ROI: {data.statistics39.roi} %</div>

          <p></p>
          <div>
            Всего сделок: {data.statistics39.allDealsCount}, из которых:
          </div>
          <div>
            - кол-во положительных сделок: {data.statistics39.countOfPositive}
          </div>
          <div>
            - кол-во отрицательных сделок: {data.statistics39.countOfNegative}
          </div>
          <div>- кол-во нулевых сделок: {data.statistics39.countOfZero}</div>
        </div>
      )}

      <br />
      <h5>Таблица всех сделок:</h5>
      <div>
        <table class="deals">
          <thead>
            <tr>
              <th>№</th>
              <th>Открываем</th>
              <th>Цена входа</th>
              <th>Время входа</th>
              <th>Объем сделки</th>
              <th>Закрываем</th>
              <th>Цена выхода</th>
              <th>Время выхода</th>
              <th>Прибыль / Убыток</th>
              <th>в процентах</th>
              {/*<th>Депозит2</th>*/}
              <th>Take Profit</th>
              <th>Stop Loss</th>
              <th>Время изменения TP</th>
              <th>Время изменения SL</th>
              <th>Сигнал</th>
              {/*<th>Условие</th>*/}
            </tr>
          </thead>
          {data &&
            data.deals39 &&
            data.deals39.map((deal, i) => (
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
                {/*<td>{deal.deposit2}</td>*/}
                <td>{deal.takeProfit}</td>
                <td>{deal.stopLoss}</td>
                <td>{deal.dateChangeTP}</td>
                <td>{deal.dateChangeSL}</td>
                <td>{deal.whitchSignal}</td>
                {/*<td>{deal.condition}</td>*/}
              </tr>
            ))}
        </table>
      </div>
    </>
  )
}
