// like as AuthPage.js
import React, { useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
// import Loader from '../loader'

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
      //const data = await request('/api/userrequest/datarequest', 'POST', {
      const data = await request('/', 'POST', {
        ...form,
      })
      //message(data.message)
      console.log(data)
      setData(data) //  установил данные в React
      //setStartTrend(data.startOfTrend)
    } catch (e) {}
  }

  const [data, setData] = useState({})
  //const [startTrend, setStartTrend] = useState(0)
  // const [loading2, setLoading2] = useState(true)

  /*
  const registerHandler = async () => {
    try {
      const data = await request('/api/userrequest/datarequest', {
        method: 'POST',
        headers: {
          //'Content-Type': 'application/json;charset=utf-8',
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        body: JSON.stringify(...form),
      })
      message(data.message)
    } catch (e) {}
  }
  */

  return (
    <>
      <h2>Тестер стратегии</h2>
      <h3>фракталы Билла Вильямса</h3>
      <hr></hr>
      {/* Запрос пользователя */}
      <div class="container py-5">
        <form class="mb-5" id="form" action="/" method="POST">
          <h4>Введите параметры:</h4>

          <div class="form-group">
            <label for="symbol">
              Монета: btcusdt, <b>ETHUSDT</b>
            </label>
            <input
              type="text"
              class="form-control"
              id="symbol"
              name="symbol"
              onChange={changeHandler}
              required
            ></input>
          </div>

          <hr></hr>
          <p>
            Ниже введи старший и младщий таймфрейм.
            <br />
            <em>
              Таймфреймы бывают: 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h,
              1d, 3d, 1w, 1M, где:
              <br />m - minutes; h - hours; d - days; w - weeks; M - months
            </em>
          </p>

          <div class="form-group">
            <label for="seniorTimeFrame">
              Старший таймфрейм. Например: <b>2h</b>
            </label>
            <input
              type="text"
              class="form-control"
              id="seniorTimeFrame"
              name="seniorTimeFrame"
              onChange={changeHandler}
              required
            ></input>
          </div>

          <div class="form-group">
            <label for="lowerTimeFrame">
              Младший таймфрейм. Например: <b>5m</b>
            </label>
            <input
              type="text"
              class="form-control"
              id="lowerTimeFrame"
              name="lowerTimeFrame"
              onChange={changeHandler}
              required
            ></input>
          </div>

          <hr></hr>
          <p>
            Ниже укажи временной интервал в формате{' '}
            <em>
              YYYY-MM-DD<strong>T</strong>HH:mm:ss.sss, где:
              <br />
              YYYY-MM-DD – дата в формате год-месяц-день.
              <br />
              Обычный символ T используется как разделитель.
              <br />
              HH:mm:ss.sss – время: часы-минуты-секунды-миллисекунды.
            </em>
          </p>

          <div class="form-group">
            <label for="dateStart">
              Дата и время первой свечи: <b>2022-01-01T00:00:00.000</b>
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
              Дата и время последней свечи: <b>2022-02-30T00:00:00.000</b>
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

          <hr></hr>
          <div class="form-group">
            <label for="deposit">
              Введите размер депозита. Например: <b>1000</b>
            </label>
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
              Введите % от депозита: от 0.01 до 1. Например: <b>0.25</b>
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
            <label for="multiplier">
              Введите плечо: от 1 до 20. Например: <b>10</b>
            </label>
            <input
              type="number"
              class="form-control"
              id="multiplier"
              name="multiplier"
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
        </form>
      </div>

      {/*<div>re re: {startTrend}</div> */}
      <hr></hr>
      {/* справочные данные */}
      <h4>Общая статистика:</h4>

      <div>Время запуска скрипта: {data.startProgramAtToHuman}</div>
      {data && data.statistics && (
        <div>
          <div>Депозит в начале: {data.statistics.deposit} USD</div>
          <div>Депозит в конце: {data.statistics.resultOfDeposit} USD</div>
          <div>Итоговая прибыль/убыток: {data.statistics.globalProfit} USD</div>
          <div>ROI: {data.statistics.roi} %</div>
          <div>Дней торговли: {data.statistics.dayOfTrade}</div>
          <div>ROI годовых: {data.statistics.roiPerYear} %</div>
          <div>
            Максимальная просадка: {data.statistics.drawdown} USD, (
            {data.statistics.drawdownPer} %, соответственно, потенциальное плечо
            = {data.statistics.multiplierMayBe})
          </div>
          <p></p>
          <div>Всего сделок: {data.statistics.allDealsCount}, из которых:</div>
          <div>
            - кол-во положительных сделок: {data.statistics.countOfPositive}
          </div>
          <div>
            - кол-во отрицательных сделок: {data.statistics.countOfNegative}
          </div>
          <p></p>
          <div>
            Так же рассчитывается потенциальная прибыль по убыточным сделкам,
            которую можно было получить до выхода по stopLoss. Соответственно:
          </div>
          <div>Минимальная доходность = {data.statistics.minOfVMP}%</div>
          <div>Максимальная доходность = {data.statistics.maxOfVMP}%</div>
          <div>
            Средняя доходность averageOfVMP = {data.statistics.averageOfVMP}%
          </div>
          <div>
            Кол-во убыточных сделок, которые можно закрыть в TP выше
            averageOfVMP = {data.statistics.countMoreAverageOfVMP}
          </div>
          <div>
            Кол-во убыточных сделок, которые нельзя закрыть в TP выше
            averageOfVMP = {data.statistics.countLessAverageOfVMP}
          </div>
          <div>Это хороший повод задуматься!..</div>
          <p></p>

          <div>
            Время работы приложения: {data.statistics.diffInSecond} секунд(ы)
          </div>
        </div>
      )}

      <p>Ниже вся детальная информация</p>
      <hr></hr>
      {/* Список трендов (после фильтрации) */}
      <h4>Список трендов</h4>
      {/*<p>PS: соединил повторяющиеся тренды</p>*/}
      <div>
        {/*обёртка*/}
        <table>
          {/*таблица*/}
          <thead>
            <tr>
              {/*строка*/}
              <th>№</th> {/*ячейка*/}
              <th>Тренд</th>
              <th>Время фрактала</th>
              <th>Цена фрактала</th>
              <th>Начало тренда</th>
              <th>Экстремум цены пробития</th>
            </tr>
          </thead>
          {data &&
            data.trends &&
            data.trends.map((trend, i) => (
              <tr>
                <td>{i + 1}</td>
                <td>{trend.trend}</td>
                <td>{trend.fractalTime}</td>
                <td>{trend.fractalPrice}</td>
                <td>{trend.priceTime}</td>
                <td>{trend.price}</td>
              </tr>
            ))}
        </table>
      </div>
      <hr></hr>
      {/* Статистика внутри трендов*/}
      <h4>Статистика внутри трендов</h4>
      <p>Прибыль или убыток внутри каждого тренда:</p>
      <div>
        {' '}
        {/*обёртка*/}
        <table>
          {/*таблица*/}
          <thead>
            <tr>
              {/*строка*/}
              <th>№</th> {/*ячейка*/}
              <th>Тренд</th>
              <th>Начало</th>
              <th>Завершение</th>
              <th>Результат</th>
            </tr>
          </thead>
          {data &&
            data.statInTredn &&
            data.statInTredn.map((stat) => (
              <tr>
                <td>{stat.indexOfTrend + 1}</td>
                <td>{stat.trendIs}</td>
                <td>{stat.startTrend}</td>
                <td>{stat.endTrend}</td>
                <td>{stat.profitInTrend}</td>
              </tr>
            ))}
        </table>
      </div>
      <hr></hr>
      {/*таблица всех сделок*/}
      <h4>Таблица всех сделок</h4>
      <p>
        <b>Цена выхода</b> - закрытие сделки по последнему фракталу.
        <br />
        <b>varMaxProfit</b> - Потенциальная максимальая прибыль до закрытия
        сделки по stopLoss.
        <br />
        <b>procentVMP</b> - процент varMaxProfit. Можно вычислить средний
        процент.
        <br />
        <b>timeOfVMP</b> - время наступленмя varMaxProfit.
        <br />
        <b>lastPrice</b> - закрытие сделки по цене последней свечки в конце
        тренда.
      </p>
      <div className="table">
        {' '}
        {/*обёртка*/}
        <table>
          {/*таблица*/}
          <thead>
            <tr>
              {/*строка*/}
              <th>№</th> {/*ячейка*/}
              <th>Открываем</th>
              <th>Цена входа</th>
              <th>Время входа</th>
              <th>Объем сделки</th>
              <th>Закрываем</th>
              <th>Цена выхода</th>
              <th>Время выхода</th>
              <th>Прибыль / Убыток</th>
              <th>в процентах</th>
              <th>lastPrice</th>
              <th>Депозит</th>
            </tr>
          </thead>

          {data &&
            data.allDealsReal &&
            data.allDealsReal.map((deal, i) => (
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
                <td>{deal.lastPrice}</td>
                <td>{deal.deposit}</td>
              </tr>
            ))}
        </table>
      </div>
      <hr></hr>
      <h4>Таблица всех сделок с разбивкой по трендам</h4>
      <div className="table">
        <table>
          <tr>
            <td>№ тренда</td>
          </tr>
          {data &&
            data.allDealsReal2 &&
            data.allDealsReal2.map((trends, i) => (
              <tr>
                <td>
                  <b>{i + 1}</b>
                </td>
                <tr>
                  <td>№ сделки</td>
                  <td>Открываем</td>
                  <td>Цена входа</td>
                  <td>Время входа</td>
                  <td>Объем сделки</td>
                  <td>Закрываем</td>
                  <td>Цена выхода</td>
                  <td>Время выхода</td>
                  <td>
                    <b>Прибыль / Убыток</b>
                  </td>
                  <td>в процентах</td>
                  <td>lastPrice</td>
                  <td>
                    <b>Депозит</b>
                  </td>
                </tr>
                {trends.map((deal, j) => (
                  <tr text-align="center">
                    <td>{j + 1}</td>
                    <td>{deal.openPosition}</td>
                    <td>{deal.openPrice}</td>
                    <td>{deal.openTime}</td>
                    <td>{deal.amountOfPosition}</td>
                    <td>{deal.closePosition}</td>
                    <td>{deal.closePrice}</td>
                    <td>{deal.closeTime}</td>
                    <td text-align="center">
                      <b>{deal.profit}</b>
                    </td>
                    <td>{deal.percent}</td>
                    <td>{deal.lastPrice}</td>
                    <td>
                      <b>{deal.deposit}</b>
                    </td>
                  </tr>
                ))}
              </tr>
            ))}
        </table>
      </div>
      <hr></hr>
      <p>Спасибо!</p>
      {/* <p>
        <b>Доработки:</b>
        <br />
        <b>Release candidate 3.3</b>:
        <br /> - исправлен расчет депозита в случае, если внутри тренда не было
        сделок
        <br />
        <b>Release candidate 3.2</b>:
        <br /> - Добавлена статистика по сокращению убыточных сделок
        <br /> - Разделил функции приложения по отдельным файлам
        <br />
        <b>Release candidate 3.1</b>:
        <br /> - исправлен расчет ROI
        <br /> - исправлен подсчет прибыли внутри тренда если была всего 1
        сделка
        <br /> - выделил столбцы "Прибыль / Убыток" и "Депозит" жирным цветом
        <br />
        <b>Release candidate 3.0</b>:
        <br /> - добавлен запуск тестов на любом диапозоне дат
        <br /> - добавлены: депозит, плечо, % от дипозита (в дальнейшем: для
        распределения депозита среди нескольких инструментов)
      </p> */}
    </>
  )
}
