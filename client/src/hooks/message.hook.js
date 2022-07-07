import { useCallback } from 'react'

// обработка ошибок на клиенте
export const useMessage = () => {
  return useCallback((text) => {
    if (window.M && text) {
      window.M.toast({ html: text })
    }
  }, [])
}
