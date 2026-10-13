'use client'

import { useEffect, useRef, useState } from 'react'

export const useElementWidth = <T extends HTMLElement>() => {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, width] as const
}

// Round axis maximum and step to friendly numbers (1, 2, 2.5, 5 × 10ⁿ).
export const niceTicks = (max: number, count = 4) => {
  if (max <= 0) return [0, 1]
  const rough = max / count
  const power = 10 ** Math.floor(Math.log10(rough))
  const step = [1, 2, 2.5, 5, 10].map((factor) => factor * power).find((value) => value >= rough)!
  const top = Math.ceil(max / step) * step
  return Array.from({ length: Math.round(top / step) + 1 }, (_, index) => index * step)
}

// Smooth path through points using a monotone cubic curve so the line never overshoots.
export const smoothPath = (points: [number, number][]) => {
  if (points.length < 2) return ''
  const slopes = points.slice(0, -1).map(([x, y], index) => {
    const [nextX, nextY] = points[index + 1]
    return (nextY - y) / (nextX - x)
  })
  const tangents = points.map((_, index) => {
    if (index === 0) return slopes[0]
    if (index === points.length - 1) return slopes[slopes.length - 1]
    const before = slopes[index - 1]
    const after = slopes[index]
    return before * after <= 0 ? 0 : (before + after) / 2
  })

  return points
    .map(([x, y], index) => {
      if (index === 0) return `M${x},${y}`
      const [previousX, previousY] = points[index - 1]
      const dx = (x - previousX) / 3
      return `C${previousX + dx},${previousY + tangents[index - 1] * dx} ${x - dx},${y - tangents[index] * dx} ${x},${y}`
    })
    .join('')
}
