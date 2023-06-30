/**
 * Usage
 * const handleLongPress = useLongPress(callback, delay)
 * <button {...handleLongPress}>...</button>
*/
import { useState, useEffect } from "react"

type LongPressSet = {
  onMouseDown: () => void
  onMouseUp: () => void
  onMouseLeave: () => void
  onTouchStart: () => void
  onTouchEnd: () => void
}

export const useLongPress = (callback: () => void, ms: number): LongPressSet => {
  const [longPressed, setLongPressed] = useState(false)

  useEffect(() => {
    let timeoutID: NodeJS.Timeout | undefined

    if (longPressed) {
        timeoutID = setTimeout(callback, ms)
    } else {
        clearTimeout(timeoutID as NodeJS.Timeout)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [longPressed, callback])

  let initialTimeoutID: NodeJS.Timeout | undefined

  const start = () => {
    initialTimeoutID = setTimeout(() => {
      setLongPressed(true)
    }, 1000)
  }

  const stop = () => {
    clearTimeout(initialTimeoutID as NodeJS.Timeout)
    setLongPressed(false)
  }

  return ({
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  })
}