'use client'

import { useSyncExternalStore } from 'react'
import { ORDERS_STORAGE_KEY } from '../../ecommerce/_lib/orders'
import { clearLiveOrders, readLiveOrders, type Order } from './data'

let cachedRaw: string | null = null
let cachedOrders: Order[] = []
const emptyOrders: Order[] = []
const listeners = new Set<() => void>()

const getSnapshot = () => {
  const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY)
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedOrders = readLiveOrders()
  }
  return cachedOrders
}

// The storage event fires when the store is open in another tab, so new orders appear instantly.
const subscribe = (listener: () => void) => {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === ORDERS_STORAGE_KEY || event.key === null) listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export const useLiveOrders = () => useSyncExternalStore(subscribe, getSnapshot, () => emptyOrders)

export const resetLiveOrders = () => {
  clearLiveOrders()
  listeners.forEach((listener) => listener())
}
