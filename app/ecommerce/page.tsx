'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

type Product = {
  id: number
  name: string
  category: 'Bags' | 'Shoes' | 'Accessories' | 'Clothing'
  price: number
  color: string
  tag: string
  rating: number
  stock: number
  description: string
  image: string
}

type CartItem = {
  product: Product
  quantity: number
}

type Customer = {
  firstName: string
  lastName: string
  email: string
}

type PortfolioOrder = {
  id: string
  customer: string
  email: string
  product: string
  status: 'Paid'
  revenue: number
  channel: string
  date: string
  items: number
}

const ORDERS_STORAGE_KEY = 'portfolio-commerce-orders'

const products: Product[] = [
  {
    id: 1,
    name: 'Noir Leather Tote',
    category: 'Bags',
    price: 189,
    color: 'Black',
    tag: 'Best seller',
    rating: 4.9,
    stock: 12,
    description: 'Structured everyday tote with a laptop sleeve and soft leather finish.',
    image:
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Cloud Runner Sneaker',
    category: 'Shoes',
    price: 142,
    color: 'White',
    tag: 'New drop',
    rating: 4.8,
    stock: 8,
    description: 'Lightweight sneaker designed for city walks, travel days and casual styling.',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Minimal Crossbody',
    category: 'Bags',
    price: 128,
    color: 'Brown',
    tag: 'Limited',
    rating: 4.7,
    stock: 5,
    description: 'Compact crossbody bag with adjustable strap and organized inner pockets.',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'Soft Gold Watch',
    category: 'Accessories',
    price: 96,
    color: 'Gold',
    tag: 'Gift pick',
    rating: 4.6,
    stock: 16,
    description: 'Minimal watch with a brushed gold case and soft neutral strap.',
    image:
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 5,
    name: 'City Low Sneaker',
    category: 'Shoes',
    price: 118,
    color: 'Beige',
    tag: 'Comfort',
    rating: 4.8,
    stock: 9,
    description: 'Low-profile sneaker with a cushioned sole and warm neutral palette.',
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 6,
    name: 'Silver Frame Sunglasses',
    category: 'Accessories',
    price: 74,
    color: 'Silver',
    tag: 'Summer',
    rating: 4.5,
    stock: 14,
    description: 'Light silver sunglasses with UV protection and a clean everyday frame.',
    image:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 7,
    name: 'Tailored Wool Blazer',
    category: 'Clothing',
    price: 214,
    color: 'Charcoal',
    tag: 'Premium',
    rating: 4.9,
    stock: 7,
    description: 'Structured wool blazer with a sharp silhouette for work and evening looks.',
    image:
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 8,
    name: 'Ribbed Knit Dress',
    category: 'Clothing',
    price: 132,
    color: 'Stone',
    tag: 'Soft touch',
    rating: 4.7,
    stock: 11,
    description: 'Comfortable ribbed midi dress with a clean cut and everyday styling range.',
    image:
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 9,
    name: 'Canvas Weekend Bag',
    category: 'Bags',
    price: 156,
    color: 'Olive',
    tag: 'Travel',
    rating: 4.6,
    stock: 10,
    description: 'Durable weekend bag with roomy compartments and reinforced handles.',
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 10,
    name: 'Pearl Hoop Earrings',
    category: 'Accessories',
    price: 68,
    color: 'Pearl',
    tag: 'Under €70',
    rating: 4.5,
    stock: 18,
    description: 'Lightweight pearl hoops that add a polished accent to simple outfits.',
    image:
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=900&auto=format&fit=crop',
  },
]

const categories = ['All', 'Bags', 'Shoes', 'Accessories', 'Clothing'] as const

export default function EcommercePage() {
  const [category, setCategory] = useState<(typeof categories)[number]>('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('Featured')
  const [maxPrice, setMaxPrice] = useState(240)
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0])
  const [modalProduct, setModalProduct] = useState<Product | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [promoCode, setPromoCode] = useState('')
  const [completedOrder, setCompletedOrder] = useState<PortfolioOrder | null>(null)
  const [customer, setCustomer] = useState<Customer>({
    firstName: '',
    lastName: '',
    email: '',
  })
  const [checkoutMessage, setCheckoutMessage] = useState('')

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category
      const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase())
      const matchesPrice = product.price <= maxPrice

      return matchesCategory && matchesQuery && matchesPrice
    })

    return [...result].sort((a, b) => {
      if (sort === 'Price low') return a.price - b.price
      if (sort === 'Price high') return b.price - a.price
      return a.id - b.id
    })
  }, [category, query, sort, maxPrice])

  const addToCart = (product: Product) => {
    setCart((items) => {
      const existingItem = items.find((item) => item.product.id === product.id)

      if (existingItem) {
        return items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item,
        )
      }

      return [...items, { product, quantity: 1 }]
    })
    setCartOpen(true)
    setCompletedOrder(null)
    setCheckoutMessage('')
  }

  const updateQuantity = (productId: number, direction: 'decrease' | 'increase') => {
    setCart((items) =>
      items
        .map((item) => {
          if (item.product.id !== productId) return item

          const nextQuantity =
            direction === 'increase' ? item.quantity + 1 : item.quantity - 1

          return {
            ...item,
            quantity: Math.min(Math.max(nextQuantity, 0), item.product.stock),
          }
        })
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (productId: number) => {
    setCart((items) => items.filter((item) => item.product.id !== productId))
  }

  const openProductModal = (product: Product) => {
    setSelectedProduct(product)
    setModalProduct(product)
  }

  const toggleWishlist = (productId: number) => {
    setWishlist((items) =>
      items.includes(productId)
        ? items.filter((item) => item !== productId)
        : [...items, productId],
    )
  }

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartSubtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  )
  const discount = promoCode.trim().toUpperCase() === 'LUMA10' ? Math.round(cartSubtotal * 0.1) : 0
  const shipping = cartSubtotal > 0 && cartSubtotal < 120 ? 8 : 0
  const cartTotal = cartSubtotal - discount + shipping
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())
  const emailError =
    customer.email.trim() && !emailIsValid ? 'Enter a valid email address with @ and domain.' : ''
  const canCheckout =
    cartItemsCount > 0 &&
    customer.firstName.trim() &&
    customer.lastName.trim() &&
    emailIsValid

  const handleCheckout = () => {
    if (!canCheckout) {
      setCheckoutMessage('Add products and complete the customer details with a valid email.')
      return
    }

    const order: PortfolioOrder = {
      id: `#${Math.floor(2000 + Math.random() * 7000)}`,
      customer: `${customer.firstName.trim()} ${customer.lastName.trim()}`,
      email: customer.email.trim(),
      product: cart.map((item) => `${item.quantity}x ${item.product.name}`).join(', '),
      status: 'Paid',
      revenue: cartTotal,
      channel: 'Checkout demo',
      date: 'Just now',
      items: cartItemsCount,
    }

    const existingOrders = JSON.parse(
      window.localStorage.getItem(ORDERS_STORAGE_KEY) || '[]',
    ) as PortfolioOrder[]

    window.localStorage.setItem(
      ORDERS_STORAGE_KEY,
      JSON.stringify([order, ...existingOrders].slice(0, 12)),
    )

    setCart([])
    setPromoCode('')
    setCompletedOrder(order)
    setCheckoutMessage('Order saved. Thank you for shopping with Luma Market.')
  }

  return (
    <main className="min-h-screen bg-[#f7f3ed] text-[#171412]">
      <section className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-5 sm:px-5 md:px-8 lg:px-10 xl:px-14">
        <div>
          <header className="flex flex-col gap-4 border-b border-black/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="text-sm font-semibold uppercase tracking-[0.25em]">
              Diana Tsymbaliuk
            </Link>
            <nav className="flex flex-wrap gap-4 text-sm text-black/60 sm:gap-6">
              <a href="#catalog" className="hover:text-black">Catalog</a>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="hover:text-black"
              >
                Cart {cartItemsCount}
              </button>
              <Link href="/" className="hover:text-black">Portfolio</Link>
            </nav>
          </header>

          <div className="grid gap-8 py-10 md:py-12 xl:grid-cols-[0.9fr_1.1fr] xl:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#8c6a2f]">
                E-commerce case study
              </p>
              <h1 className="mt-5 text-5xl font-semibold leading-none md:text-7xl">
                Luma Market
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-black/65">
                A responsive shopping interface with product discovery, filters,
                product preview, sorting and a lightweight cart flow.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full border border-black/10 px-4 py-2">React</span>
                <span className="rounded-full border border-black/10 px-4 py-2">Next.js</span>
                <span className="rounded-full border border-black/10 px-4 py-2">TypeScript</span>
                <span className="rounded-full border border-black/10 px-4 py-2">Responsive UI</span>
              </div>
              <div className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-[1.25rem] bg-white p-4 shadow-sm">
                  <p className="text-2xl font-semibold">{products.length}</p>
                  <p className="mt-1 text-sm text-black/55">products</p>
                </div>
                <div className="rounded-[1.25rem] bg-white p-4 shadow-sm">
                  <p className="text-2xl font-semibold">5</p>
                  <p className="mt-1 text-sm text-black/55">filters</p>
                </div>
                <div className="rounded-[1.25rem] bg-white p-4 shadow-sm">
                  <p className="text-2xl font-semibold">100%</p>
                  <p className="mt-1 text-sm text-black/55">responsive</p>
                </div>
                <div className="rounded-[1.25rem] bg-white p-4 shadow-sm">
                  <p className="text-2xl font-semibold">{wishlist.length}</p>
                  <p className="mt-1 text-sm text-black/55">saved</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] bg-[#1d1a17] p-3 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1400&auto=format&fit=crop"
                alt="Fashion store interior"
                className="h-[420px] w-full rounded-[1.5rem] object-cover"
              />
            </div>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] bg-[#171412] p-5 text-white">
              <p className="text-sm uppercase tracking-[0.25em] text-[#d4af37]">Discovery</p>
              <p className="mt-3 text-white/65">Search, category filters and price control help users narrow the catalog quickly.</p>
            </div>
            <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
              <p className="text-sm uppercase tracking-[0.25em] text-[#8c6a2f]">Product preview</p>
              <p className="mt-3 text-black/60">A selected item panel shows rating, stock and short product context before adding to cart.</p>
            </div>
            <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
              <p className="text-sm uppercase tracking-[0.25em] text-[#8c6a2f]">Checkout</p>
              <p className="mt-3 text-black/60">Cart state updates immediately with item removal, shipping state and total price.</p>
            </div>
          </div>

          <section id="catalog" className="rounded-[2rem] bg-white p-5 shadow-sm md:p-7">
            <div className="flex flex-col gap-4 border-b border-black/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#8c6a2f]">
                  Product catalog
                </p>
                <h2 className="mt-2 text-3xl font-semibold">Shop the edit</h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search products"
                  className="rounded-full border border-black/10 px-5 py-3 text-sm outline-none transition focus:border-black/35"
                />
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm outline-none transition focus:border-black/35"
                >
                  <option>Featured</option>
                  <option>Price low</option>
                  <option>Price high</option>
                </select>
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_260px] lg:items-end">
              <div className="flex flex-wrap gap-3">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`rounded-full px-5 py-3 text-sm transition ${
                      category === item
                        ? 'bg-[#171412] text-white'
                        : 'bg-[#f3eee7] text-black/65 hover:text-black'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <label className="block rounded-[1.25rem] bg-[#f7f3ed] p-4 text-sm">
                <span className="flex justify-between text-black/60">
                  Max price
                  <strong className="text-black">€{maxPrice}</strong>
                </span>
                <input
                  type="range"
                  min="70"
                  max="240"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(Number(event.target.value))}
                  className="mt-3 w-full accent-[#171412]"
                />
              </label>
            </div>

            <div className="mt-8 grid gap-5 rounded-[1.5rem] bg-[#f7f3ed] p-4 md:grid-cols-[180px_1fr_auto] md:items-center">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="h-44 w-full rounded-[1.25rem] object-cover md:h-36"
              />
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#8c6a2f]">Quick view</p>
                <h3 className="mt-2 text-2xl font-semibold">{selectedProduct.name}</h3>
                <p className="mt-2 leading-7 text-black/60">{selectedProduct.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm text-black/55">
                  <span>Rating {selectedProduct.rating}/5</span>
                  <span>•</span>
                  <span>{selectedProduct.stock} in stock</span>
                  <span>•</span>
                  <span>{selectedProduct.category}</span>
                </div>
              </div>
              <button
                onClick={() => openProductModal(selectedProduct)}
                className="rounded-full bg-[#171412] px-6 py-3 text-sm font-semibold text-white"
              >
                Open details
              </button>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-[#fbfaf8]"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-64 w-full object-cover"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold">
                      {product.tag}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      aria-label={`${wishlist.includes(product.id) ? 'Remove from' : 'Add to'} wishlist`}
                      className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-lg shadow-sm ${
                        wishlist.includes(product.id)
                          ? 'bg-[#d4af37] text-black'
                          : 'bg-white/90 text-black/70'
                      }`}
                    >
                      ♥
                    </button>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold">{product.name}</h3>
                        <p className="mt-1 text-sm text-black/55">
                          {product.category} • {product.color}
                        </p>
                        <p className="mt-2 text-sm text-black/45">
                          {product.rating}/5 rating • {product.stock} left
                        </p>
                      </div>
                      <p className="font-semibold">€{product.price}</p>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => openProductModal(product)}
                        className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-black/70 transition hover:border-black/30"
                      >
                        Quick view
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        className="rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.01]"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

        </div>

        {cartOpen ? (
          <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm">
            <aside id="cart" className="fixed right-0 top-0 h-full w-full max-w-[540px] overflow-y-auto bg-[#171412] p-5 text-white shadow-2xl sm:p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d4af37]">
              Cart drawer
            </p>
            <button
              type="button"
              onClick={() => setCartOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl text-black"
              aria-label="Close cart"
            >
              ×
            </button>
          </div>
          <div className="flex flex-col gap-3 border-b border-white/10 pb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d4af37]">
                Checkout
              </p>
              <h2 className="mt-4 text-4xl font-semibold md:text-5xl">Your bag</h2>
            </div>
            <p className="max-w-xl leading-7 text-white/55">
              Review your products, update quantities, apply a promo code and place your order.
            </p>
          </div>

          <div className="mt-5 flex items-end justify-between">
            <div>
              <p className="mt-2 text-sm text-white/55">
                {cartItemsCount} item{cartItemsCount === 1 ? '' : 's'} selected
              </p>
            </div>
            <p className="text-2xl font-semibold">€{cartTotal}</p>
          </div>

          <div className="mt-8 grid gap-8">
            <div className="space-y-4">
              {cart.length === 0 ? (
                <p className="rounded-[1.5rem] border border-white/10 p-5 text-white/60">
                  Add products to preview the cart interaction.
                </p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="rounded-[1.5rem] bg-white/5 p-3"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.image}
                        alt=""
                        className="h-20 w-20 rounded-[1rem] object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{item.product.name}</p>
                        <p className="text-sm text-white/50">
                          €{item.product.price} • {item.product.color}
                        </p>
                      </div>
                      <p className="font-semibold">€{item.product.price * item.quantity}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center rounded-full border border-white/10">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, 'decrease')}
                          className="px-4 py-2 text-white/70"
                          aria-label={`Decrease ${item.product.name}`}
                        >
                          -
                        </button>
                        <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, 'increase')}
                          className="px-4 py-2 text-white/70 disabled:opacity-30"
                          disabled={item.quantity >= item.product.stock}
                          aria-label={`Increase ${item.product.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/65"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div>
              <div className="rounded-[1.5rem] border border-white/10 p-5">
                <p className="font-semibold">Customer details</p>
                <div className="mt-4 grid gap-3">
                  <input
                    value={customer.firstName}
                    onChange={(event) =>
                      setCustomer((current) => ({
                        ...current,
                        firstName: event.target.value,
                      }))
                    }
                    placeholder="First name"
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/35"
                  />
                  <input
                    value={customer.lastName}
                    onChange={(event) =>
                      setCustomer((current) => ({
                        ...current,
                        lastName: event.target.value,
                      }))
                    }
                    placeholder="Last name"
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/35"
                  />
                  <input
                    value={customer.email}
                    onChange={(event) =>
                      setCustomer((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder="Email"
                    type="email"
                    aria-invalid={Boolean(emailError)}
                    className={`rounded-full border bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/35 ${
                      emailError ? 'border-red-400/70' : 'border-white/10'
                    }`}
                  />
                  {emailError ? (
                    <p className="px-2 text-xs leading-5 text-red-300">{emailError}</p>
                  ) : null}
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-6">
            <div className="rounded-[1.5rem] border border-white/10 p-4">
              <label className="text-sm font-medium">Promo code</label>
              <div className="mt-3 flex gap-2">
                <input
                  value={promoCode}
                  onChange={(event) => setPromoCode(event.target.value)}
                  placeholder="Try LUMA10"
                  className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/35"
                />
                <span className="rounded-full bg-white/10 px-4 py-3 text-xs font-semibold text-white/70">
                  {discount ? 'Applied' : 'Optional'}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-between text-white/65">
              <span>Subtotal</span>
              <span>€{cartSubtotal}</span>
            </div>
            <div className="mt-3 flex justify-between text-white/65">
              <span>Discount</span>
              <span>{discount ? `-€${discount}` : '€0'}</span>
            </div>
            <div className="mt-3 flex justify-between text-white/65">
              <span>Shipping</span>
              <span>{shipping ? `€${shipping}` : 'Free'}</span>
            </div>
            <div className="mt-3 flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>€{cartTotal}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="mt-6 w-full rounded-full bg-white px-5 py-4 text-sm font-semibold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!canCheckout}
            >
              Place order
            </button>
            {checkoutMessage ? (
              <p className="mt-4 rounded-[1rem] bg-white/5 p-3 text-sm leading-6 text-white/65">
                {checkoutMessage}
              </p>
            ) : null}
            {completedOrder ? (
              <div className="mt-4 rounded-[1.25rem] bg-[#d4af37]/15 p-4 text-sm leading-6 text-[#d4af37]">
                <p className="font-semibold">Order {completedOrder.id} created</p>
                <p className="mt-1">
                  {completedOrder.items} item{completedOrder.items === 1 ? '' : 's'} saved for{' '}
                  {completedOrder.customer}.
                </p>
              </div>
            ) : null}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-white/10 p-5">
            <p className="font-semibold">Store features</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-white/60">
              <li>Filterable product catalog</li>
              <li>Quick product preview</li>
              <li>Max-price range control</li>
              <li>Search and price sorting</li>
              <li>Interactive cart state</li>
              <li>Quantity controls and promo discount</li>
              <li>Order confirmation state</li>
              <li>Customer checkout form</li>
              <li>Mobile-first responsive layout</li>
            </ul>
          </div>
        </aside>
          </div>
        ) : null}
      </section>

      {modalProduct ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-[#f7f3ed] p-4 text-[#171412] shadow-2xl md:p-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setModalProduct(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white"
                aria-label="Close product details"
              >
                ×
              </button>
            </div>
            <div className="grid gap-6 md:grid-cols-[0.9fr_1fr] md:items-center">
              <img
                src={modalProduct.image}
                alt={modalProduct.name}
                className="h-80 w-full rounded-[1.5rem] object-cover sm:h-96"
              />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8c6a2f]">
                  Product details
                </p>
                <h2 className="mt-3 text-4xl font-semibold leading-tight">
                  {modalProduct.name}
                </h2>
                <p className="mt-4 text-lg leading-8 text-black/65">
                  {modalProduct.description}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  <span className="rounded-full bg-white px-4 py-3">€{modalProduct.price}</span>
                  <span className="rounded-full bg-white px-4 py-3">{modalProduct.rating}/5</span>
                  <span className="rounded-full bg-white px-4 py-3">{modalProduct.stock} left</span>
                  <span className="rounded-full bg-white px-4 py-3">{modalProduct.color}</span>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => toggleWishlist(modalProduct.id)}
                    className="rounded-full border border-black/10 px-6 py-4 text-sm font-semibold"
                  >
                    {wishlist.includes(modalProduct.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(modalProduct)
                      setModalProduct(null)
                    }}
                    className="rounded-full bg-[#d4af37] px-6 py-4 text-sm font-semibold text-black"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}
