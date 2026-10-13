'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { FREE_SHIPPING_FROM, formatPrice } from '../_lib/products'
import { closeCart, getCartLines, setQuantity, useStore } from '../_lib/store'

export default function CartDrawer() {
  const { cart, cartOpen } = useStore()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const lines = getCartLines(cart)
  const subtotal = lines.reduce((total, line) => total + line.product.price * line.quantity, 0)
  const missingForFreeShipping = Math.max(FREE_SHIPPING_FROM - subtotal, 0)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (cartOpen && !dialog.open) dialog.showModal()
    if (!cartOpen && dialog.open) dialog.close()
  }, [cartOpen])

  return (
    <dialog
      ref={dialogRef}
      onClose={closeCart}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeCart()
      }}
      aria-labelledby="cart-title"
      className="m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-[#f7f3ed] p-0 text-[#171412] backdrop:bg-black/45 backdrop:backdrop-blur-sm"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <h2 id="cart-title" className="text-lg font-semibold">
            Your bag
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close bag"
            className="grid h-9 w-9 place-items-center rounded-full text-xl hover:bg-black/5"
          >
            ×
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-black/60">Your bag is empty.</p>
            <Link
              href="/ecommerce#catalog"
              onClick={closeCart}
              className="rounded-full bg-[#171412] px-6 py-3 text-sm font-medium text-white"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-black/10 px-6 py-4 text-sm">
              <p className="text-black/65">
                {missingForFreeShipping > 0
                  ? `Add ${formatPrice(missingForFreeShipping)} more for free shipping`
                  : 'You’ve unlocked free shipping'}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full rounded-full bg-[#8c6a2f] transition-[width] duration-500"
                  style={{ width: `${Math.min((subtotal / FREE_SHIPPING_FROM) * 100, 100)}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-black/10 overflow-y-auto px-6">
              {lines.map((line) => (
                <li key={`${line.productId}-${line.size}`} className="flex gap-4 py-5">
                  <Image
                    width={160}
                    height={200}
                    src={line.product.image}
                    alt=""
                    className="h-28 w-22 shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex justify-between gap-3">
                      <Link
                        href={`/ecommerce/product/${line.product.slug}`}
                        onClick={closeCart}
                        className="font-medium hover:underline"
                      >
                        {line.product.name}
                      </Link>
                      <p className="font-medium">
                        {formatPrice(line.product.price * line.quantity)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-black/55">
                      {line.product.color} · {line.size}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-full border border-black/15">
                        <button
                          type="button"
                          onClick={() => setQuantity(line, line.quantity - 1)}
                          aria-label={`Decrease quantity of ${line.product.name}`}
                          className="h-8 w-8"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm">{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(line, line.quantity + 1)}
                          disabled={line.quantity >= line.product.stock}
                          aria-label={`Increase quantity of ${line.product.name}`}
                          className="h-8 w-8 disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setQuantity(line, 0)}
                        className="text-sm text-black/50 underline-offset-4 hover:text-black hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-black/10 px-6 py-5">
              <div className="flex justify-between text-lg font-semibold">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-sm text-black/50">Shipping and discounts at checkout.</p>
              <Link
                href="/ecommerce/checkout"
                onClick={closeCart}
                className="mt-5 block rounded-full bg-[#171412] px-6 py-4 text-center text-sm font-medium text-white transition hover:bg-black"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </dialog>
  )
}
