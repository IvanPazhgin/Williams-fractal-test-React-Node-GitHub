import React, { useEffect, useState } from 'react'
// import mongoDBfind from '../../../API/mongoDB/mongoDBfind'
import { useHttp } from '../hooks/http.hook'

export const HistoryPage = () => {
  // let form = 'deals42'
  // const form = 'Williams'
  const { loading, request } = useHttp()

  // useEffect(() => {
  //   getDataFromMondoDB()
  // }, [])

  const [data, setData] = useState([])

  async function getDataFromMondoDB42() {
    let form = 'deals42'
    try {
      const data = await request('/history', 'POST', { form })
      console.log(data)
      setData(data) //  установил данные в React
    } catch (e) {}
  }

  async function getDataFromMondoDBW() {
    const form = 'Williams'
    try {
      const data = await request('/history', 'POST', { form })
      console.log(data)
      setData(data)
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
        <button
          type="submit"
          class="btn btn-primary"
          onClick={getDataFromMondoDB42}
          disabled={loading}
        >
          Статистика 4.2
        </button>{' '}
        |
        <button
          type="submit"
          class="btn btn-primary"
          onClick={getDataFromMondoDBW}
          disabled={loading}
        >
          Статистика Williams
        </button>
      </div>

      <br />
      <p>Стратегия Билла Вильямса на 4h_15m. v1: простейшая версия</p>
      <p>Test_4.2 на 30m: 3 зеленых</p>

      <div>
        <hr />
        {/* <h4>Стратегия {data && data[-1].strategy}</h4> */}

        <table class="deals">
          <thead>
            <tr>
              <th>№</th>
              <th>Направление</th>
              <th>Монета</th>
              <th>Время входа</th>
              <th>Цена входа</th>
              <th>Время выхода</th>
              <th>Цена выхода</th>
              <th>Депозит</th>
              <th>+ / -</th>
              <th>в %</th>
              <th>Take Profit</th>
              <th>Stop Loss</th>
            </tr>
          </thead>

          {data &&
            data.map((deal, i) => (
              <tr>
                <td>{i + 1}</td>
                <td>{deal.sidePosition}</td>
                <td>{deal.symbol}</td>
                <td>{deal.openDealTimeHuman}</td>
                <td>{deal.openDealPrice}</td>
                <td>{deal.closeDealTimeHuman}</td>
                <td>{deal.closeDealPrice}</td>
                <td>{deal.deposit}</td>
                <td>{deal.profit}</td>
                <td>{deal.percent}</td>
                <td>{deal.takeProfit}</td>
                <td>{deal.stopLoss}</td>
              </tr>
            ))}
        </table>
      </div>
    </>
  )
}
