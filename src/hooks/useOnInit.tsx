import { useEffect } from 'react'

export const useOnInit = (initialCallBack: () => void): void => {
  useEffect(() => {
    initialCallBack()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}