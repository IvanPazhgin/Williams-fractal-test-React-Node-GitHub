import React, { useState } from 'react'
import { useHttp } from '../hooks/http.hook'
// import mongoClient from '../../../API/mongoDB/mongoDB.init'

export const HistoryPage = () => {
  // const form = 'deals42'
  const form = 'Williams'
  const { loading, request } = useHttp()

  const getDataFromMondoDB = async () => {
    try {
      const data = await request('/history', 'POST', { form })
      console.log(data)
      setData(data) //  установил данные в React
    } catch (e) {}
  }
  const [data, setData] = useState({})

  // const nameOfCollection = 'deals42'

  // const getDataFromMondoDB = async () => {
  //   const collection = mongoClient.db().collection(nameOfCollection) // выносим коллекцию в переменную
  //   const allDeals = await collection.find({}).toArray()
  //   console.log('allDeals', allDeals)
  // }

  return (
    <>
      <div>
        <h1>Вся история тестов</h1>
        <hr />

        <button
          type="submit"
          class="btn btn-primary"
          onClick={getDataFromMondoDB}
          disabled={loading}
        >
          Статистика 4.2
        </button>
      </div>

      <div>
        <hr />
        {/* <h4>Стратегия {data[0].strategy}</h4> */}

        <table class="deals">
          <thead>
            <tr>
              <th>№</th>
              <th>Монета</th>
              <th>Время входа</th>
              <th>Цена входа</th>
              <th>Время выхода</th>
              <th>Цена выхода</th>
              <th>Прибыль / Убыток</th>
              <th>в процентах</th>
              <th>Take Profit</th>
              <th>Stop Loss</th>
            </tr>
          </thead>

          {/* {data &&
            data.map((deal, i) => (
              <tr>
                <td>{i + 1}</td>
                <td>{deal.symbol}</td>
                <td>{deal.openDealTimeHuman}</td>
                <td>{deal.openDealPrice}</td>
                <td>{deal.closeDealTimeHuman}</td>
                <td>{deal.closeDealPrice}</td>
                <td>{deal.profit}</td>
                <td>{deal.percent}</td>
                <td>{deal.takeProfit}</td>
                <td>{deal.stopLoss}</td>
              </tr>
            ))} */}
        </table>
      </div>
    </>
  )
}
