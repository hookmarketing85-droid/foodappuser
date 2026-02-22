import { FormEvent, useEffect, useMemo, useState } from 'react'
import './App.css'

type CuisineTag =
  | 'All'
  | 'Biryani'
  | 'Burgers'
  | 'Pizza'
  | 'Chinese'
  | 'Healthy'
  | 'Dessert'

interface Restaurant {
  id: string
  name: string
  cuisine: Exclude<CuisineTag, 'All'>
  rating: number
  deliveryTime: number
  deliveryFee: number
  minOrder: number
  distanceKm: number
  description: string
  tags: string[]
}

interface MenuItem {
  id: string
  restaurantId: string
  name: string
  description: string
  price: number
  prepTime: number
  isVeg: boolean
  popular?: boolean
}

interface CartItem {
  menuItemId: string
  restaurantId: string
  name: string
  price: number
  qty: number
}

type SortBy = 'recommended' | 'rating' | 'deliveryTime' | 'deliveryFee'
type PaymentMethod = 'Cash on Delivery' | 'Card' | 'Mobile Banking'

const cuisineFilters: CuisineTag[] = [
  'All',
  'Biryani',
  'Burgers',
  'Pizza',
  'Chinese',
  'Healthy',
  'Dessert',
]

const restaurants: Restaurant[] = [
  {
    id: 'r1',
    name: 'Dhaka Biryani House',
    cuisine: 'Biryani',
    rating: 4.8,
    deliveryTime: 32,
    deliveryFee: 45,
    minOrder: 180,
    distanceKm: 2.4,
    description: 'Classic kacchi, tehari, and rezala style rice meals.',
    tags: ['Top Rated', 'Free Salad'],
  },
  {
    id: 'r2',
    name: 'Burger Lab 24',
    cuisine: 'Burgers',
    rating: 4.6,
    deliveryTime: 26,
    deliveryFee: 35,
    minOrder: 220,
    distanceKm: 1.7,
    description: 'Smash burgers, loaded fries, and spicy wings.',
    tags: ['Fast Delivery', 'Buy 1 Get 1'],
  },
  {
    id: 'r3',
    name: 'Pizza Corner',
    cuisine: 'Pizza',
    rating: 4.5,
    deliveryTime: 34,
    deliveryFee: 40,
    minOrder: 250,
    distanceKm: 3.1,
    description: 'Stone baked pizza with local and Italian toppings.',
    tags: ['Popular', 'Family Packs'],
  },
  {
    id: 'r4',
    name: 'Wok and Bowl',
    cuisine: 'Chinese',
    rating: 4.4,
    deliveryTime: 30,
    deliveryFee: 38,
    minOrder: 200,
    distanceKm: 2,
    description: 'Noodles, fried rice, and stir-fry boxes.',
    tags: ['Combo Meals', 'Late Night'],
  },
  {
    id: 'r5',
    name: 'Green Bite',
    cuisine: 'Healthy',
    rating: 4.7,
    deliveryTime: 24,
    deliveryFee: 30,
    minOrder: 160,
    distanceKm: 1.3,
    description: 'Healthy bowls, grilled plates, and fresh wraps.',
    tags: ['Healthy', 'Low Calorie'],
  },
  {
    id: 'r6',
    name: 'Sweet Cravings',
    cuisine: 'Dessert',
    rating: 4.6,
    deliveryTime: 22,
    deliveryFee: 25,
    minOrder: 120,
    distanceKm: 1.1,
    description: 'Cake jars, waffles, falooda, and ice cream treats.',
    tags: ['Best Seller', 'Party Box'],
  },
]

const menuItems: MenuItem[] = [
  {
    id: 'm1',
    restaurantId: 'r1',
    name: 'Kacchi Biryani',
    description: 'Aromatic rice with mutton, potato, and special spices.',
    price: 390,
    prepTime: 20,
    isVeg: false,
    popular: true,
  },
  {
    id: 'm2',
    restaurantId: 'r1',
    name: 'Beef Tehari',
    description: 'Rich and spicy beef tehari served with borhani.',
    price: 280,
    prepTime: 18,
    isVeg: false,
  },
  {
    id: 'm3',
    restaurantId: 'r1',
    name: 'Chicken Roast Plate',
    description: 'Polao, roast, and salad platter.',
    price: 320,
    prepTime: 16,
    isVeg: false,
  },
  {
    id: 'm4',
    restaurantId: 'r2',
    name: 'Double Smash Burger',
    description: 'Two beef patties, cheddar, onion jam, and sauce.',
    price: 340,
    prepTime: 15,
    isVeg: false,
    popular: true,
  },
  {
    id: 'm5',
    restaurantId: 'r2',
    name: 'Crispy Chicken Burger',
    description: 'Buttermilk chicken with lettuce and spicy mayo.',
    price: 300,
    prepTime: 14,
    isVeg: false,
  },
  {
    id: 'm6',
    restaurantId: 'r2',
    name: 'Loaded Fries',
    description: 'Fries with cheese sauce, jalapeno, and beef bits.',
    price: 210,
    prepTime: 10,
    isVeg: false,
  },
  {
    id: 'm7',
    restaurantId: 'r3',
    name: 'Pepperoni Classic',
    description: '12 inch hand-tossed pepperoni pizza.',
    price: 550,
    prepTime: 22,
    isVeg: false,
    popular: true,
  },
  {
    id: 'm8',
    restaurantId: 'r3',
    name: 'BBQ Chicken Pizza',
    description: 'Smoky BBQ chicken, onion, and mozzarella.',
    price: 520,
    prepTime: 22,
    isVeg: false,
  },
  {
    id: 'm9',
    restaurantId: 'r3',
    name: 'Margherita Pizza',
    description: 'Tomato sauce, basil, and mozzarella cheese.',
    price: 420,
    prepTime: 18,
    isVeg: true,
  },
  {
    id: 'm10',
    restaurantId: 'r4',
    name: 'Chicken Fried Rice',
    description: 'Wok fried rice with chicken and veggies.',
    price: 260,
    prepTime: 14,
    isVeg: false,
  },
  {
    id: 'm11',
    restaurantId: 'r4',
    name: 'Garlic Noodles',
    description: 'Hakka noodles with garlic and spring onions.',
    price: 230,
    prepTime: 13,
    isVeg: true,
  },
  {
    id: 'm12',
    restaurantId: 'r4',
    name: 'Thai Chili Chicken',
    description: 'Sweet and spicy chicken in Thai chili glaze.',
    price: 310,
    prepTime: 16,
    isVeg: false,
    popular: true,
  },
  {
    id: 'm13',
    restaurantId: 'r5',
    name: 'Grilled Chicken Bowl',
    description: 'Brown rice, grilled chicken, and sauteed veggies.',
    price: 320,
    prepTime: 15,
    isVeg: false,
    popular: true,
  },
  {
    id: 'm14',
    restaurantId: 'r5',
    name: 'Paneer Power Salad',
    description: 'Paneer cubes, lettuce, quinoa, and citrus dressing.',
    price: 270,
    prepTime: 10,
    isVeg: true,
  },
  {
    id: 'm15',
    restaurantId: 'r5',
    name: 'Avocado Wrap',
    description: 'Whole wheat wrap with hummus and avocado.',
    price: 250,
    prepTime: 9,
    isVeg: true,
  },
  {
    id: 'm16',
    restaurantId: 'r6',
    name: 'Chocolate Jar Cake',
    description: 'Layered sponge cake with dark chocolate cream.',
    price: 220,
    prepTime: 8,
    isVeg: true,
    popular: true,
  },
  {
    id: 'm17',
    restaurantId: 'r6',
    name: 'Belgian Waffle',
    description: 'Fresh waffle served with maple syrup and cream.',
    price: 260,
    prepTime: 11,
    isVeg: true,
  },
  {
    id: 'm18',
    restaurantId: 'r6',
    name: 'Mango Falooda',
    description: 'Cold mango falooda with basil seeds and ice cream.',
    price: 190,
    prepTime: 6,
    isVeg: true,
  },
]

const promos: Record<string, { type: 'flat' | 'percent'; value: number; minSubtotal: number }> = {
  SAVE60: { type: 'flat', value: 60, minSubtotal: 400 },
  BITE10: { type: 'percent', value: 10, minSubtotal: 600 },
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)

function App() {
  const [searchText, setSearchText] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineTag>('All')
  const [sortBy, setSortBy] = useState<SortBy>('recommended')
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(restaurants[0].id)
  const [cart, setCart] = useState<CartItem[]>([])
  const [promoInput, setPromoInput] = useState('')
  const [activePromoCode, setActivePromoCode] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery')
  const [isOrderPlaced, setIsOrderPlaced] = useState(false)
  const [lastOrderId, setLastOrderId] = useState<number | null>(null)
  const [lastOrderTotal, setLastOrderTotal] = useState(0)
  const [lastOrderEta, setLastOrderEta] = useState(0)

  const visibleRestaurants = useMemo(() => {
    const normalized = searchText.trim().toLowerCase()
    const filtered = restaurants.filter((restaurant) => {
      const matchesCuisine =
        selectedCuisine === 'All' || restaurant.cuisine === selectedCuisine
      const matchesText =
        normalized.length === 0 ||
        restaurant.name.toLowerCase().includes(normalized) ||
        restaurant.cuisine.toLowerCase().includes(normalized) ||
        restaurant.tags.some((tag) => tag.toLowerCase().includes(normalized))
      return matchesCuisine && matchesText
    })

    return filtered.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating
      }
      if (sortBy === 'deliveryTime') {
        return a.deliveryTime - b.deliveryTime
      }
      if (sortBy === 'deliveryFee') {
        return a.deliveryFee - b.deliveryFee
      }
      const scoreA = a.rating * 10 - a.deliveryTime - a.deliveryFee / 10
      const scoreB = b.rating * 10 - b.deliveryTime - b.deliveryFee / 10
      return scoreB - scoreA
    })
  }, [searchText, selectedCuisine, sortBy])

  useEffect(() => {
    if (visibleRestaurants.length === 0) {
      return
    }
    if (!visibleRestaurants.some((restaurant) => restaurant.id === selectedRestaurantId)) {
      setSelectedRestaurantId(visibleRestaurants[0].id)
    }
  }, [visibleRestaurants, selectedRestaurantId])

  const selectedRestaurant = useMemo(
    () => restaurants.find((restaurant) => restaurant.id === selectedRestaurantId) ?? null,
    [selectedRestaurantId],
  )

  const selectedMenu = useMemo(
    () =>
      selectedRestaurant
        ? menuItems.filter((item) => item.restaurantId === selectedRestaurant.id)
        : [],
    [selectedRestaurant],
  )

  const cartRestaurant = useMemo(() => {
    if (cart.length === 0) {
      return null
    }
    return restaurants.find((restaurant) => restaurant.id === cart[0].restaurantId) ?? null
  }, [cart])

  const itemCount = useMemo(
    () => cart.reduce((total, item) => total + item.qty, 0),
    [cart],
  )
  const subtotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.qty, 0),
    [cart],
  )
  const serviceFee = subtotal > 0 ? Math.max(15, Math.round(subtotal * 0.06)) : 0
  const deliveryFee = cartRestaurant ? (subtotal >= 600 ? 0 : cartRestaurant.deliveryFee) : 0

  const activePromo = activePromoCode ? promos[activePromoCode] : undefined
  const discount = activePromo
    ? subtotal >= activePromo.minSubtotal
      ? activePromo.type === 'flat'
        ? activePromo.value
        : Math.round((subtotal * activePromo.value) / 100)
      : 0
    : 0
  const total = Math.max(subtotal + serviceFee + deliveryFee - discount, 0)
  const canCheckout =
    cart.length > 0 &&
    customerName.trim().length >= 2 &&
    address.trim().length >= 8 &&
    phone.trim().length >= 10

  const addToCart = (item: MenuItem) => {
    const cartRestaurantId = cart[0]?.restaurantId
    if (cartRestaurantId && cartRestaurantId !== item.restaurantId) {
      const shouldReplace = window.confirm(
        'Your cart already has items from another restaurant. Start a new cart?',
      )
      if (!shouldReplace) {
        return
      }
      setCart([
        {
          menuItemId: item.id,
          restaurantId: item.restaurantId,
          name: item.name,
          price: item.price,
          qty: 1,
        },
      ])
      return
    }

    setCart((previousCart) => {
      const existing = previousCart.find((cartItem) => cartItem.menuItemId === item.id)
      if (existing) {
        return previousCart.map((cartItem) =>
          cartItem.menuItemId === item.id
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem,
        )
      }
      return [
        ...previousCart,
        {
          menuItemId: item.id,
          restaurantId: item.restaurantId,
          name: item.name,
          price: item.price,
          qty: 1,
        },
      ]
    })
  }

  const updateQty = (menuItemId: string, nextQty: number) => {
    if (nextQty <= 0) {
      setCart((previousCart) =>
        previousCart.filter((item) => item.menuItemId !== menuItemId),
      )
      return
    }

    setCart((previousCart) =>
      previousCart.map((item) =>
        item.menuItemId === menuItemId ? { ...item, qty: nextQty } : item,
      ),
    )
  }

  const applyPromoCode = () => {
    const code = promoInput.trim().toUpperCase()
    if (!code) {
      return
    }
    if (!promos[code]) {
      window.alert('Invalid promo code. Try SAVE60 or BITE10.')
      return
    }
    setActivePromoCode(code)
  }

  const clearPromoCode = () => {
    setActivePromoCode('')
    setPromoInput('')
  }

  const placeOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canCheckout || !cartRestaurant) {
      return
    }
    const generatedOrderId = Math.floor(100000 + Math.random() * 900000)
    setLastOrderId(generatedOrderId)
    setLastOrderTotal(total)
    setLastOrderEta(cartRestaurant.deliveryTime + 10)
    setIsOrderPlaced(true)

    setCart([])
    setPromoInput('')
    setActivePromoCode('')
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Food Delivery MVP</p>
          <h1>QuickBite User Web App</h1>
          <p className="hero-subtitle">
            Discover restaurants, add meals to cart, and place your order in minutes.
          </p>
        </div>
        <div className="hero-meta">
          <span>Location: Dhanmondi, Dhaka</span>
          <span>{itemCount} item(s) in cart</span>
        </div>
      </header>

      <section className="toolbar">
        <input
          type="search"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search by restaurant, cuisine, or tag"
          aria-label="Search restaurants"
        />
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortBy)}>
          <option value="recommended">Sort: Recommended</option>
          <option value="rating">Sort: Rating</option>
          <option value="deliveryTime">Sort: Fastest Delivery</option>
          <option value="deliveryFee">Sort: Lowest Delivery Fee</option>
        </select>
      </section>

      <section className="filters">
        {cuisineFilters.map((cuisine) => (
          <button
            key={cuisine}
            className={selectedCuisine === cuisine ? 'chip active' : 'chip'}
            onClick={() => setSelectedCuisine(cuisine)}
            type="button"
          >
            {cuisine}
          </button>
        ))}
      </section>

      <main className="content-grid">
        <section className="restaurants-panel">
          <div className="panel-title-row">
            <h2>Restaurants</h2>
            <p>{visibleRestaurants.length} found</p>
          </div>

          <div className="restaurant-list">
            {visibleRestaurants.length === 0 ? (
              <div className="empty-card">
                <h3>No restaurants found</h3>
                <p>Try another search keyword or change cuisine filter.</p>
              </div>
            ) : (
              visibleRestaurants.map((restaurant) => (
                <button
                  key={restaurant.id}
                  className={
                    selectedRestaurantId === restaurant.id
                      ? 'restaurant-card selected'
                      : 'restaurant-card'
                  }
                  onClick={() => setSelectedRestaurantId(restaurant.id)}
                  type="button"
                >
                  <div className="restaurant-header">
                    <h3>{restaurant.name}</h3>
                    <span>{restaurant.rating.toFixed(1)} / 5</span>
                  </div>
                  <p>{restaurant.description}</p>
                  <div className="restaurant-meta">
                    <span>{restaurant.cuisine}</span>
                    <span>{restaurant.deliveryTime} min</span>
                    <span>{formatPrice(restaurant.deliveryFee)} delivery</span>
                  </div>
                  <div className="tag-list">
                    {restaurant.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        <section className="menu-panel">
          {selectedRestaurant ? (
            <>
              <div className="panel-title-row">
                <h2>{selectedRestaurant.name} Menu</h2>
                <p>
                  {selectedRestaurant.distanceKm} km · Min order{' '}
                  {formatPrice(selectedRestaurant.minOrder)}
                </p>
              </div>

              <div className="menu-list">
                {selectedMenu.map((item) => (
                  <article key={item.id} className="menu-card">
                    <div>
                      <div className="menu-card-title">
                        <h3>{item.name}</h3>
                        {item.popular ? <span className="badge">Popular</span> : null}
                      </div>
                      <p>{item.description}</p>
                      <div className="menu-card-meta">
                        <span>{item.isVeg ? 'Veg' : 'Non-Veg'}</span>
                        <span>{item.prepTime} min prep</span>
                        <strong>{formatPrice(item.price)}</strong>
                      </div>
                    </div>
                    <button onClick={() => addToCart(item)} type="button">
                      Add
                    </button>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-card">
              <h3>Select a restaurant</h3>
              <p>Choose one from the left panel to view items.</p>
            </div>
          )}
        </section>

        <aside className="cart-panel">
          {isOrderPlaced ? (
            <div className="order-success">
              <h2>Order placed successfully</h2>
              <p>Order ID: #{lastOrderId}</p>
              <p>Estimated delivery: {lastOrderEta} min</p>
              <p>Total paid: {formatPrice(lastOrderTotal)}</p>
              <button type="button" onClick={() => setIsOrderPlaced(false)}>
                Back to ordering
              </button>
            </div>
          ) : (
            <>
              <div className="panel-title-row">
                <h2>Your Cart</h2>
                <button type="button" onClick={() => setCart([])} disabled={cart.length === 0}>
                  Clear
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="empty-card">
                  <h3>Cart is empty</h3>
                  <p>Add items from any restaurant to continue.</p>
                </div>
              ) : (
                <>
                  <ul className="cart-list">
                    {cart.map((item) => (
                      <li key={item.menuItemId}>
                        <div>
                          <h4>{item.name}</h4>
                          <p>{formatPrice(item.price)} each</p>
                        </div>
                        <div className="qty-control">
                          <button
                            type="button"
                            aria-label={`Decrease quantity for ${item.name}`}
                            onClick={() => updateQty(item.menuItemId, item.qty - 1)}
                          >
                            -
                          </button>
                          <span>{item.qty}</span>
                          <button
                            type="button"
                            aria-label={`Increase quantity for ${item.name}`}
                            onClick={() => updateQty(item.menuItemId, item.qty + 1)}
                          >
                            +
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="promo-row">
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoInput}
                      onChange={(event) => setPromoInput(event.target.value)}
                      aria-label="Promo code"
                    />
                    <button type="button" onClick={applyPromoCode}>
                      Apply
                    </button>
                    {activePromoCode ? (
                      <button type="button" onClick={clearPromoCode}>
                        Remove
                      </button>
                    ) : null}
                  </div>
                  {activePromo ? (
                    <p className="promo-note">
                      {activePromoCode} active{' '}
                      {subtotal < activePromo.minSubtotal
                        ? `(add ${formatPrice(activePromo.minSubtotal - subtotal)} more to unlock)`
                        : '(discount applied)'}
                    </p>
                  ) : (
                    <p className="promo-note">Try SAVE60 or BITE10</p>
                  )}

                  <div className="bill">
                    <div>
                      <span>Subtotal</span>
                      <strong>{formatPrice(subtotal)}</strong>
                    </div>
                    <div>
                      <span>Service fee</span>
                      <strong>{formatPrice(serviceFee)}</strong>
                    </div>
                    <div>
                      <span>Delivery fee</span>
                      <strong>{formatPrice(deliveryFee)}</strong>
                    </div>
                    <div>
                      <span>Discount</span>
                      <strong>- {formatPrice(discount)}</strong>
                    </div>
                    <div className="bill-total">
                      <span>Total</span>
                      <strong>{formatPrice(total)}</strong>
                    </div>
                  </div>
                </>
              )}

              <form className="checkout-form" onSubmit={placeOrder}>
                <h3>Checkout</h3>
                <input
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Full name"
                  required
                />
                <input
                  type="text"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Phone number"
                  required
                />
                <textarea
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Delivery address"
                  required
                />
                <select
                  value={paymentMethod}
                  onChange={(event) =>
                    setPaymentMethod(event.target.value as PaymentMethod)
                  }
                >
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="Card">Card</option>
                  <option value="Mobile Banking">Mobile Banking</option>
                </select>
                <button type="submit" disabled={!canCheckout}>
                  Place order with {paymentMethod}
                </button>
              </form>
            </>
          )}
        </aside>
      </main>
    </div>
  )
}

export default App
