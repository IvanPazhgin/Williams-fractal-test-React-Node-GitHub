import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom' // Using Routes instead of Switch in react-router v6
import { MainPage } from './pages/MainPage'
import { TestResult } from './pages/TestResult'
import { HistoryPage } from './pages/HistoryPage'
import { AlexPage } from './pages/alexPage'
import { TestPage } from './pages/testPage'

export const useRoutes = (isData) => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/result" element={<TestResult />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/alex" element={<AlexPage />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

// по принципу Владилена Минина
/*
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
*/
