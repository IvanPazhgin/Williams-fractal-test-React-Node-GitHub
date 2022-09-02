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
        <h4>параметры</h4>
        <form class="mb-5" id="form">
          <div class="form-group">
            <label for="symbol">Монета: btcusdt, ETHUSDT</label>
            <input
              type="text"
              class="form-control"
              id="symbol"
              name="symbol"
              onChange={changeHandler}
              required
            ></input>
          </div>
          <div class="form-group">
            <label for="TimeFrame">
              Тайм фрейм: 2h (не более 12h включительно, т.к. требуются
              доработки в candlesInside)
            </label>
            <input class="form-control" id="TimeFrame" required></input>
          </div>
          <div class="form-group">
            <label for="num">какое то число</label>
            <input type="number" class="form-control" id="num" required></input>
          </div>
        </form>
      </div>

      {/* старая форма */}
      <hr></hr>
      <form action="/alex" method="POST">
        <h4>параметры:</h4>

        <div class="input-field">
          <input type="text" name="symbol" onChange={changeHandler} />
          <label>Инструмент: btcusdt, ETHUSDT</label>
        </div>

        <div class="input-field">
          <input type="text" name="TimeFrame" onChange={changeHandler} />
          <label>
            Тайм фрейм: 2h (не более 12h включительно, т.к. требуются доработки
            в candlesInside)
          </label>
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
          {/*<b>Стратегия 3.5: Сигнал № 1 (3 зеленых, 1 красная):</b>
          <br />*/}
          <b>Стратегии 3.7: Сигнал № 1 (в таблице: 2g 1r k~0.62):</b>
          <br /> УСЛОВИЕ входа: 2 зеленых, 1 красная, процент отношения верхней
          тени к нижней тени (на красной свечке)
          <br />
          Условие проверки коэффициента: отношение меньше значения пользователя.
          <br /> Допустимо: 0.139 - 0.625
          <br /> Не допустимо: 0.853
        </p>
        <div class="input-field">
          <input type="text" name="diffShadow35big" onChange={changeHandler} />
          <label>
            процент отношения теней на красной свечке. Например: 0.62
          </label>
        </div>

        <p>
          <b>Стратегии 3.7: сигнал №3 (в таблице: 2g 1r h=o)</b>
          <br />
          УСЛОВИЕ входа: 2 зеленых; 1 красная, у которой нет верхней тени
        </p>

        <p>
          {/*<b>Стратегии 3.5: сигнал №3</b>. Вход по <b>Close Price</b>
          <br />*/}{' '}
          <b>Стратегии 3.7: сигнал №4 (в таблице: 1r k~0.3)</b>
          <br /> УСЛОВИЕ входа: на красной свече верхняя тень сильно меньше
          нижней тени. <b>Низкий коэффициент. Задает пользователь</b>.
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

        <p>
          <b>Стратегия 3.7, сигнал №4</b>: коэффициент для входа в сделку
          относительно <b>Open Price</b> сигнальной красной свечки
          <br />
          На двух примерах было вычислено: от 0.13 до 0.17.
          <br /> <b>Ноль - коэффициент будет равень нулю.</b>
        </p>
        <div class="input-field">
          <input type="text" name="delta" onChange={changeHandler} />
          <label>коэффициент для входа в сделку</label>
        </div>

        <button
          type="submit"
          class="btn"
          onClick={registerHandler}
          disabled={loading}
        >
          Запустить тест!
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          onClick={registerHandler}
          disabled={loading}
        >
          Вторая кнопка!
        </button>
      </form>

      {/*
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
      */}

      <hr></hr>
      <div>
        <b>Время запуска скрипта: {data.startProgramAt}</b>
      </div>

      <hr></hr>

      {/*таблица всех сделок: Слот №1*/}
      {/* 
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
*/}
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
            {/*<td>Депозит2</td>*/}
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
            {/*<td>Депозит2</td>*/}
            <td>Take Profit</td>
            <td>Stop Loss</td>
            <td>Время изменения TP</td>
            <td>Время изменения SL</td>
            <td>Сигнал</td>
            <td>Условие</td>
          </tr>
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
                <td>{deal.condition}</td>
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
            {/*<td>Депозит2</td>*/}
            <td>Take Profit</td>
            <td>Stop Loss</td>
            <td>Время изменения TP</td>
            <td>Время изменения SL</td>
            <td>Сигнал</td>
            <td>Условие</td>
          </tr>
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
                <td>{deal.condition}</td>
              </tr>
            ))}
        </table>
      </div>
    </>
  )
}
