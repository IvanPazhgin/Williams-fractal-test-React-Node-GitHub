import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { MainPage } from './pages/MainPage'
import { TestResult } from './pages/TestResult'
import { HistoryPage } from './pages/HistoryPage'

export const useRoutes = (isData) => {
  if (isData) {
    // если пользователь отправил запрос для тестов
    return (
      <Switch>
        <Route path="/result" exact>
          <TestResult />
        </Route>
        <Route path="/history" exact>
          <HistoryPage />
        </Route>
        <Redirect to="/" />
      </Switch>
    )
  }

  return (
    <Switch>
      <Route path="/" exact>
        <MainPage />
      </Route>
      <Redirect to="/" />
    </Switch>
  )
}
