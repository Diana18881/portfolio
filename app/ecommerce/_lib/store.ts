'use client'

import { useSyncExternalStore } from 'react'
import { getProductById, type Product } from './products'

// Cart and wishlist live in localStorage so they survive reloads and stay in sync across tabs.

export type CartLine = {
  productId: number
  size: string
  quantity: number
}

type StoreState = {
  cart: CartLine[]
  wishlist: number[]
  cartOpen: boolean
}

const STORAGE_KEY = 'luma-store'
const serverState: StoreState = { cart: [], wishlist: [], cartOpen: false }

let state: StoreState | null = null
const listeners = new Set<() => void>()

const readStorage = (): StoreState => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}')

    return {
      cart: Array.isArray(saved.cart) ? saved.cart : [],
      wishlist: Array.isArray(saved.wishlist) ? saved.wishlist : [],
      cartOpen: false,
    }
  } catch {
    return { ...serverState }
  }
}

const getState = () => {
  if (!state) state = readStorage()
  return state
}

const setState = (update: (current: StoreState) => Partial<StoreState>) => {
  const current = getState()
  state = { ...current, ...update(current) }
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ cart: state.cart, wishlist: state.wishlist }),
  )
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)

  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return
    state = { ...readStorage(), cartOpen: getState().cartOpen }
    listener()
  }

  window.addEventListener('storage', onStorage)

  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export const useStore = () => useSyncExternalStore(subscribe, getState, () => serverState)

export const openCart = () => setState(() => ({ cartOpen: true }))

export const closeCart = () => setState(() => ({ cartOpen: false }))

export const addToCart = (product: Product, size: string, quantity = 1) =>
  setState(({ cart }) => {
    const existing = cart.find((line) => line.productId === product.id && line.size === size)

    if (!existing) {
      return { cart: [...cart, { productId: product.id, size, quantity }], cartOpen: true }
    }

    return {
      cart: cart.map((line) =>
        line === existing
          ? { ...line, quantity: Math.min(line.quantity + quantity, product.stock) }
          : line,
      ),
      cartOpen: true,
    }
  })

export const setQuantity = (line: CartLine, quantity: number) =>
  setState(({ cart }) => {
    const stock = getProductById(line.productId)?.stock ?? 0

    return {
      cart: cart
        .map((item) =>
          item.productId === line.productId && item.size === line.size
            ? { ...item, quantity: Math.min(quantity, stock) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    }
  })

export const clearCart = () => setState(() => ({ cart: [] }))

export const toggleWishlist = (productId: number) =>
  setState(({ wishlist }) => ({
    wishlist: wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId],
  }))

export const getCartLines = (cart: CartLine[]) =>
  cart.flatMap((line) => {
    const product = getProductById(line.productId)
    return product ? [{ ...line, product }] : []
  })

const subscribeNothing = () => () => {}

// False during server render and hydration, so UI that depends on the saved bag doesn't flash.
export const useHydrated = () =>
  useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  )
