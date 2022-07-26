import React, { useEffect, useState } from 'react'
// import mongoDBfind from '../../../API/mongoDB/mongoDBfind'
import { useHttp } from '../hooks/http.hook'

export const HistoryPage = () => {
  // let form = 'deals42'
  // const form = 'Williams'
  const { loading, request } = useHttp()

  useEffect(() => {
    getDataFromMondoDBall()
  }, [])

  const [data, setData] = useState([])

  // async function getDataFromMondoDB42() {
  //   let form = 'deals42'
  //   try {
  //     const data = await request('/history', 'POST', { form })
  //     console.log(data)
  //     setData(data.reverse()) //  установил данные в React
  //   } catch (e) {}
  // }

  // async function getDataFromMondoDBW() {
  //   const form = 'Williams'
  //   try {
  //     const data = await request('/history', 'POST', { form })
  //     console.log(data)
  //     setData(data.reverse())
  //   } catch (e) {}
  // }

  async function getDataFromMondoDBall() {
    const form = 'allDeals'
    try {
      const data = await request('/history', 'POST', { form })
      // console.log(data)
      setData(data.reverse())
    } catch (e) {}
  }

  // async function getDataFromMondoDB(form) {
  //   const data = mongoDBfind(form)
  //   console.log(data)
  //   setData(data)
  // }

  return (
    <>
      <div>
        <h4>История торговли робота в режиме оповещений</h4>
        <hr />
        {/* <button
          type="submit"
          class="btn btn-primary"
          onClick={getDataFromMondoDB42}
          disabled={loading}
        >
          Статистика 4.2
        </button>
        |
        <button
          type="submit"
          class="btn btn-primary"
          onClick={getDataFromMondoDBW}
          disabled={loading}
        >
          Статистика Williams
        </button>
        | */}

        {/* <button
          type="submit"
          class="btn btn-primary"
          onClick={getDataFromMondoDBall}
          disabled={loading}
        >
          Вся статистика
        </button> */}
      </div>

      <div>
        <h5>
          Вверху таблицы - самые последние сделки, внизу - самые давние сделки
        </h5>

        <hr />
        {/* <h4>Стратегия {data && data[-1].strategy}</h4> */}

        <table class="deals">
          <thead>
            <tr>
              <th>№</th>
              <th>Стратегия</th>
              <th>Монета</th>
              <th>Интервал</th>
              <th>Направление</th>
              <th>Время входа</th>
              <th>Цена входа</th>
              <th>Время выхода</th>
              <th>Цена выхода</th>
              <th>Депозит</th>
              <th>+ / -</th>
              <th>в %</th>
              {/* <th>Take Profit</th> */}
              {/* <th>Stop Loss</th> */}
            </tr>
          </thead>

          {data &&
            data.map((deal, i) => (
              <tr>
                <td>{i + 1}</td>
                <td>{deal.strategy}</td>
                <td>{deal.symbol}</td>
                <td>{deal.interval}</td>
                <td>{deal.sidePosition}</td>
                <td>{deal.openDealTimeHuman}</td>
                <td>{deal.openDealPrice}</td>
                <td>{deal.closeDealTimeHuman}</td>
                <td>{deal.closeDealPrice}</td>
                <td>{deal.deposit}</td>
                <td>{deal.profit}</td>
                <td>{deal.percent}</td>
                {/* <td>{deal.takeProfit}</td> */}
                {/* <td>{deal.stopLoss}</td> */}
              </tr>
            ))}
        </table>
      </div>
    </>
  )
}
