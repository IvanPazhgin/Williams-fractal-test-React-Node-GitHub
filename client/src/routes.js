import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom' // Using Routes instead of Switch in react-router v6
import { MainPage } from './pages/MainPage'
import { TestResult } from './pages/TestResult'
import { HistoryPage } from './pages/HistoryPage'

export const useRoutes = (isData) => {
  if (isData) {
    return (
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/result" element={<TestResult />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
