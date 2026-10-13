export const categories = ['Bags', 'Shoes', 'Accessories', 'Clothing'] as const

export type Category = (typeof categories)[number]

export type Product = {
  id: number
  slug: string
  name: string
  category: Category
  price: number
  color: string
  tag: string
  rating: number
  reviews: number
  stock: number
  sizes: string[]
  description: string
  details: string[]
  image: string
}

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=1000&auto=format&fit=crop`

const shoeSizes = ['37', '38', '39', '40', '41', '42']
const clothingSizes = ['XS', 'S', 'M', 'L', 'XL']
const oneSize = ['One size']

export const products: Product[] = [
  {
    id: 1,
    slug: 'wicker-top-handle-bag',
    name: 'Wicker Top-Handle Bag',
    category: 'Bags',
    price: 189,
    color: 'Tan',
    tag: 'Best seller',
    rating: 4.9,
    reviews: 214,
    stock: 12,
    sizes: oneSize,
    description: 'Hand-woven wicker bag with a smooth leather flap and top handle.',
    details: ['Hand-woven rattan', 'Leather flap and handle', 'Turn-lock closure', '26 × 20 × 12 cm'],
    image: unsplash('1590874103328-eac38a683ce7'),
  },
  {
    id: 2,
    slug: 'knit-runner',
    name: 'Knit Runner',
    category: 'Shoes',
    price: 142,
    color: 'Crimson',
    tag: 'New in',
    rating: 4.8,
    reviews: 96,
    stock: 8,
    sizes: shoeSizes,
    description: 'Featherlight knit runner with a cushioned sole for city miles and travel days.',
    details: ['Seamless knit upper', 'Cushioned foam sole', 'Sock-like fit', 'True to size'],
    image: unsplash('1542291026-7eec264c27ff'),
  },
  {
    id: 3,
    slug: 'structured-top-handle-bag',
    name: 'Structured Top-Handle Bag',
    category: 'Bags',
    price: 128,
    color: 'Red',
    tag: 'Limited',
    rating: 4.7,
    reviews: 58,
    stock: 5,
    sizes: oneSize,
    description: 'Polished leather bag with a structured shape and silver turn-lock.',
    details: ['Smooth calf leather', 'Silver-tone hardware', 'Detachable shoulder strap', '24 × 18 × 10 cm'],
    image: unsplash('1584917865442-de89df76afd3'),
  },
  {
    id: 4,
    slug: 'steel-chronograph-watch',
    name: 'Steel Chronograph Watch',
    category: 'Accessories',
    price: 96,
    color: 'Silver / Navy',
    tag: 'Gift pick',
    rating: 4.6,
    reviews: 132,
    stock: 16,
    sizes: oneSize,
    description: 'Steel chronograph with a navy dial and rotating bezel.',
    details: ['42 mm stainless steel case', 'Navy dial, rotating bezel', 'Water resistant 10 ATM', 'Link bracelet'],
    image: unsplash('1523170335258-f5ed11844a49'),
  },
  {
    id: 5,
    slug: 'canvas-work-sneaker',
    name: 'Canvas Work Sneaker',
    category: 'Shoes',
    price: 118,
    color: 'Tan',
    tag: 'Comfort',
    rating: 4.8,
    reviews: 77,
    stock: 9,
    sizes: shoeSizes,
    description: 'Rugged tan sneaker with a padded collar, built for everyday wear.',
    details: ['Canvas and suede upper', 'Padded collar', 'Rubber cupsole', 'True to size'],
    image: unsplash('1549298916-b41d501d3772'),
  },
  {
    id: 6,
    slug: 'round-gold-sunglasses',
    name: 'Round Gold Sunglasses',
    category: 'Accessories',
    price: 74,
    color: 'Gold',
    tag: 'Summer',
    rating: 4.5,
    reviews: 41,
    stock: 14,
    sizes: oneSize,
    description: 'Round wire-frame sunglasses with green-tinted lenses.',
    details: ['UV400 protection', 'Gold-tone metal frame', 'Green tinted lenses', 'Case included'],
    image: unsplash('1511499767150-a48a237f0083'),
  },
  {
    id: 7,
    slug: 'checked-wool-blazer',
    name: 'Checked Wool Blazer',
    category: 'Clothing',
    price: 214,
    color: 'Blue check',
    tag: 'Premium',
    rating: 4.9,
    reviews: 63,
    stock: 7,
    sizes: clothingSizes,
    description: 'Tailored blue check blazer with a sharp silhouette for work and evening looks.',
    details: ['80% wool, 20% polyamide', 'Fully lined', 'Two flap pockets', 'Dry clean only'],
    image: unsplash('1594938298603-c8148c4dae35'),
  },
  {
    id: 8,
    slug: 'off-shoulder-cotton-dress',
    name: 'Off-Shoulder Cotton Dress',
    category: 'Clothing',
    price: 132,
    color: 'White',
    tag: 'Soft touch',
    rating: 4.7,
    reviews: 88,
    stock: 11,
    sizes: clothingSizes,
    description: 'Light cotton dress with an off-shoulder neckline and broderie trim.',
    details: ['100% cotton', 'Elasticated neckline', 'Broderie anglaise trim', 'Machine wash 30°'],
    image: unsplash('1515372039744-b8f02a3ae446'),
  },
  {
    id: 9,
    slug: 'everyday-backpack',
    name: 'Everyday Backpack',
    category: 'Bags',
    price: 156,
    color: 'Navy',
    tag: 'Travel',
    rating: 4.6,
    reviews: 49,
    stock: 10,
    sizes: oneSize,
    description: 'Clean-lined backpack with a padded laptop sleeve and water-repellent fabric.',
    details: ['Water-repellent nylon', 'Fits a 15" laptop', 'Front zip pocket', '22 L capacity'],
    image: unsplash('1553062407-98eeb64c6a62'),
  },
  {
    id: 10,
    slug: 'crystal-drop-earrings',
    name: 'Crystal Drop Earrings',
    category: 'Accessories',
    price: 68,
    color: 'Silver / Sapphire',
    tag: 'Under €70',
    rating: 4.5,
    reviews: 102,
    stock: 18,
    sizes: oneSize,
    description: 'Statement drop earrings with sapphire-blue stones and a crystal halo.',
    details: ['Sapphire-blue glass stones', 'Crystal halo setting', 'Rhodium-plated brass', '4 cm drop'],
    image: unsplash('1535632066927-ab7c9ab60908'),
  },
]

export const getProduct = (slug: string) => products.find((product) => product.slug === slug)

export const getProductById = (id: number) => products.find((product) => product.id === id)

export const FREE_SHIPPING_FROM = 120
export const STANDARD_SHIPPING = 8
export const EXPRESS_SHIPPING = 15
export const PROMO_CODE = 'LUMA10'

const currency = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

export const formatPrice = (value: number) => currency.format(value)
