export const categories = ['Bags', 'Shoes', 'Accessories', 'Clothing'] as const

export type Category = (typeof categories)[number]

export type Product = {
  id: number
  slug: string
  name: string
  category: Category
  price: number
  compareAt?: number
  color: string
  swatch: string
  tag: string
  rating: number
  reviews: number
  stock: number
  sizes: string[]
  description: string
  details: string[]
  images: string[]
}

// Every product gets a main shot plus two detail crops of the same photo for the gallery.
const photo = (id: string, focus: [number, number] = [0.5, 0.5]) => [
  `https://images.unsplash.com/photo-${id}?w=1000&h=1250&fit=crop&q=80&auto=format`,
  `https://images.unsplash.com/photo-${id}?w=1000&h=1250&fit=crop&crop=focalpoint&fp-x=${focus[0]}&fp-y=${focus[1]}&fp-z=1.8&q=80&auto=format`,
  `https://images.unsplash.com/photo-${id}?w=1000&h=1250&fit=crop&crop=focalpoint&fp-x=${focus[0]}&fp-y=${focus[1]}&fp-z=2.8&q=80&auto=format`,
]

const shoeSizes = ['37', '38', '39', '40', '41', '42']
const clothingSizes = ['XS', 'S', 'M', 'L', 'XL']
const oneSize = ['One size']

export const products: Product[] = [
  {
    id: 1,
    slug: 'margot-satchel',
    name: 'Margot Satchel',
    category: 'Bags',
    price: 189,
    color: 'Mustard',
    swatch: '#c9a44c',
    tag: 'Best seller',
    rating: 4.9,
    reviews: 214,
    stock: 12,
    sizes: oneSize,
    description:
      'A structured satchel in smooth saffiano leather, finished with a polished push-lock. Sized for the everyday essentials and a little more.',
    details: ['Saffiano calf leather', 'Push-lock closure', 'Detachable shoulder strap', '28 × 21 × 10 cm'],
    images: photo('1612902456551-333ac5afa26e', [0.55, 0.62]),
  },
  {
    id: 2,
    slug: 'celeste-croc-tote',
    name: 'Celeste Croc Tote',
    category: 'Bags',
    price: 168,
    compareAt: 210,
    color: 'Camel',
    swatch: '#a8835a',
    tag: 'Sale',
    rating: 4.7,
    reviews: 88,
    stock: 6,
    sizes: oneSize,
    description:
      'A soft-structured tote in croc-embossed leather with long handles that sit comfortably on the shoulder.',
    details: ['Croc-embossed leather', 'Suede-lined interior', 'Fits a 13" laptop', '34 × 30 × 12 cm'],
    images: photo('1713425886143-6ea8c776bf2d', [0.45, 0.55]),
  },
  {
    id: 3,
    slug: 'ivory-top-handle-bag',
    name: 'Ivory Top-Handle Bag',
    category: 'Bags',
    price: 249,
    color: 'Ivory',
    swatch: '#efe8dc',
    tag: 'New in',
    rating: 4.8,
    reviews: 41,
    stock: 4,
    sizes: oneSize,
    description:
      'A sculpted top-handle bag in glossy ivory leather. Polished gold hardware and a structured base keep its shape.',
    details: ['Patent calf leather', 'Gold-tone hardware', 'Two interior pockets', '26 × 20 × 12 cm'],
    images: photo('1682745230951-8a5aa9a474a0', [0.5, 0.45]),
  },
  {
    id: 4,
    slug: 'soft-belt-bag',
    name: 'Soft Belt Bag',
    category: 'Bags',
    price: 98,
    color: 'Cream',
    swatch: '#e6d8c3',
    tag: 'Under €100',
    rating: 4.6,
    reviews: 132,
    stock: 18,
    sizes: oneSize,
    description:
      'A hands-free belt bag in supple nappa, worn at the waist or across the body. Just enough room for phone, cards and keys.',
    details: ['Nappa leather', 'Adjustable strap', 'Zip-top closure', '22 × 12 × 6 cm'],
    images: photo('1588596589835-e5e6a5b3bf8c', [0.55, 0.6]),
  },
  {
    id: 5,
    slug: 'atelier-backpack',
    name: 'Atelier Backpack',
    category: 'Bags',
    price: 156,
    color: 'Black',
    swatch: '#2b2b2b',
    tag: 'Travel',
    rating: 4.7,
    reviews: 67,
    stock: 10,
    sizes: oneSize,
    description:
      'A clean-lined rucksack in water-repellent canvas with leather pulls and a padded laptop sleeve.',
    details: ['Water-repellent canvas', 'Fits a 15" laptop', 'Leather drawcord pulls', '20 L capacity'],
    images: photo('1642375352724-8b523c67b8be', [0.5, 0.4]),
  },
  {
    id: 6,
    slug: 'classic-court-sneaker',
    name: 'Classic Court Sneaker',
    category: 'Shoes',
    price: 118,
    color: 'White',
    swatch: '#f4f4f2',
    tag: 'Essential',
    rating: 4.8,
    reviews: 302,
    stock: 22,
    sizes: shoeSizes,
    description:
      'A minimal court sneaker in smooth white leather with a cushioned footbed. Goes with everything, all year round.',
    details: ['Full-grain leather upper', 'Cushioned footbed', 'Rubber cupsole', 'True to size'],
    images: photo('1544441892-794166f1e3be', [0.5, 0.5]),
  },
  {
    id: 7,
    slug: 'brogue-lace-up-boot',
    name: 'Brogue Lace-Up Boot',
    category: 'Shoes',
    price: 229,
    color: 'Cognac',
    swatch: '#9a5a2c',
    tag: 'Handmade',
    rating: 4.9,
    reviews: 58,
    stock: 7,
    sizes: shoeSizes,
    description:
      'A Goodyear-welted brogue boot in burnished cognac leather. Built to be resoled and worn for years.',
    details: ['Burnished calf leather', 'Goodyear-welted sole', 'Leather lining', 'Half a size large'],
    images: photo('1638609348722-aa2a3a67db26', [0.45, 0.55]),
  },
  {
    id: 8,
    slug: 'zip-chelsea-boot',
    name: 'Zip Chelsea Boot',
    category: 'Shoes',
    price: 189,
    compareAt: 239,
    color: 'Black',
    swatch: '#1d1d1d',
    tag: 'Sale',
    rating: 4.7,
    reviews: 96,
    stock: 5,
    sizes: shoeSizes,
    description:
      'A sleek ankle boot in polished black leather with twin side zips and a stacked heel.',
    details: ['Polished calf leather', 'Twin side zips', '3 cm stacked heel', 'True to size'],
    images: photo('1605732440685-d0654d81aa30', [0.5, 0.55]),
  },
  {
    id: 9,
    slug: 'heritage-leather-boot',
    name: 'Heritage Leather Boot',
    category: 'Shoes',
    price: 205,
    color: 'Espresso',
    swatch: '#4a3226',
    tag: 'Autumn edit',
    rating: 4.8,
    reviews: 73,
    stock: 9,
    sizes: shoeSizes,
    description:
      'A rugged lace-up boot in oiled espresso leather with a lug sole made for cold, wet city days.',
    details: ['Oiled nubuck leather', 'Lug rubber sole', 'Padded collar', 'True to size'],
    images: photo('1608256246200-53e635b5b65f', [0.5, 0.55]),
  },
  {
    id: 10,
    slug: 'aurelia-leather-watch',
    name: 'Aurelia Leather Watch',
    category: 'Accessories',
    price: 145,
    color: 'Ivory / Gold',
    swatch: '#d9c08a',
    tag: 'Gift pick',
    rating: 4.8,
    reviews: 121,
    stock: 14,
    sizes: oneSize,
    description:
      'A slim 34 mm watch with a brushed gold case, a clean ivory dial and a soft leather strap.',
    details: ['34 mm brushed case', 'Japanese quartz movement', 'Water resistant 3 ATM', 'Italian leather strap'],
    images: photo('1580226223521-5412ec88237a', [0.5, 0.42]),
  },
  {
    id: 11,
    slug: 'golden-teardrop-earrings',
    name: 'Golden Teardrop Earrings',
    category: 'Accessories',
    price: 64,
    color: 'Gold',
    swatch: '#d4af37',
    tag: 'Best seller',
    rating: 4.9,
    reviews: 187,
    stock: 20,
    sizes: oneSize,
    description:
      'Sculptural teardrop studs in 18k gold vermeil. Lightweight enough to wear from morning to night.',
    details: ['18k gold vermeil', 'Sterling silver base', 'Hypoallergenic', '2 cm drop'],
    images: photo('1727990865600-91f8cb8b0168', [0.5, 0.5]),
  },
  {
    id: 12,
    slug: 'riviera-aviator-sunglasses',
    name: 'Riviera Aviator Sunglasses',
    category: 'Accessories',
    price: 110,
    color: 'Gold',
    swatch: '#caa35a',
    tag: 'Summer',
    rating: 4.6,
    reviews: 64,
    stock: 11,
    sizes: oneSize,
    description:
      'A fine gold-tone aviator with gradient lenses and full UV400 protection. Comes with a leather case.',
    details: ['UV400 gradient lenses', 'Gold-tone titanium frame', 'Adjustable nose pads', 'Leather case included'],
    images: photo('1589642380614-4a8c2147b857', [0.5, 0.5]),
  },
  {
    id: 13,
    slug: 'twisted-gold-hoops',
    name: 'Twisted Gold Hoops',
    category: 'Accessories',
    price: 58,
    compareAt: 72,
    color: 'Gold',
    swatch: '#d4af37',
    tag: 'Sale',
    rating: 4.7,
    reviews: 93,
    stock: 15,
    sizes: oneSize,
    description:
      'Chunky twisted hoops in gold vermeil that catch the light from every angle.',
    details: ['18k gold vermeil', 'Hinged closure', 'Hypoallergenic', '2.5 cm diameter'],
    images: photo('1617038260897-41a1f14a8ca0', [0.5, 0.5]),
  },
  {
    id: 14,
    slug: 'teal-pointelle-cardigan',
    name: 'Teal Pointelle Cardigan',
    category: 'Clothing',
    price: 139,
    color: 'Teal',
    swatch: '#3f7a78',
    tag: 'New in',
    rating: 4.8,
    reviews: 45,
    stock: 8,
    sizes: clothingSizes,
    description:
      'A hand-finished pointelle cardigan in soft wool-alpaca. Relaxed through the body with a slightly cropped length.',
    details: ['70% wool, 30% alpaca', 'Pointelle knit', 'Horn buttons', 'Hand wash cold'],
    images: photo('1536992266094-82847e1fd431', [0.5, 0.5]),
  },
  {
    id: 15,
    slug: 'cloud-knit-sweater',
    name: 'Cloud Knit Sweater',
    category: 'Clothing',
    price: 119,
    color: 'Cream',
    swatch: '#efe6d6',
    tag: 'Soft touch',
    rating: 4.9,
    reviews: 156,
    stock: 16,
    sizes: clothingSizes,
    description:
      'An airy crew-neck sweater in brushed organic cotton. Light enough to layer, warm enough to wear alone.',
    details: ['Brushed organic cotton', 'Relaxed fit', 'Ribbed trims', 'Machine wash 30°'],
    images: photo('1633008004535-b255bab275cc', [0.5, 0.6]),
  },
  {
    id: 16,
    slug: 'merino-crew-knit',
    name: 'Merino Crew Knit',
    category: 'Clothing',
    price: 129,
    color: 'Chocolate',
    swatch: '#5a3a2a',
    tag: 'Autumn edit',
    rating: 4.7,
    reviews: 82,
    stock: 12,
    sizes: clothingSizes,
    description:
      'A fine-gauge merino jumper in a rich chocolate tone. Temperature-regulating and naturally soft.',
    details: ['100% extra-fine merino', 'Fine-gauge knit', 'Regular fit', 'Hand wash cold'],
    images: photo('1760013531865-89ff324f83a6', [0.5, 0.5]),
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
