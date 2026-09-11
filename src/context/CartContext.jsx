import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext({})

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

const CART_STORAGE_KEY = 'medicare_plus_carts'
const WISHLIST_STORAGE_KEY = 'medicare_plus_wishlist'

const getCartKey = (user) => (user?.id ? `user:${user.id}` : 'guest')

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth()
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const loadedKeyRef = useRef(null)
  const skipSaveRef = useRef(false)
  const cartKey = getCartKey(user)

  useEffect(() => {
    if (authLoading) return

    try {
      const savedCarts = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '{}')
      const legacyCart = localStorage.getItem('medicare_plus_cart')
      const savedCart = savedCarts[cartKey] || (cartKey === 'guest' && legacyCart ? JSON.parse(legacyCart) : [])

      skipSaveRef.current = true
      setCart(Array.isArray(savedCart) ? savedCart : [])
      loadedKeyRef.current = cartKey
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      skipSaveRef.current = true
      setCart([])
      loadedKeyRef.current = cartKey
    }
  }, [authLoading, cartKey])

  useEffect(() => {
    if (authLoading || loadedKeyRef.current !== cartKey) return
    if (skipSaveRef.current) {
      skipSaveRef.current = false
      return
    }

    try {
      const savedCarts = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '{}')
      savedCarts[cartKey] = cart
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(savedCarts))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [authLoading, cart, cartKey])

  useEffect(() => {
    try {
      const savedWishlist = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY) || '[]')
      setWishlist(Array.isArray(savedWishlist) ? savedWishlist : [])
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist))
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error)
    }
  }, [wishlist])

  const addToCart = (medicine, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === medicine.id)

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...prevCart, { ...medicine, quantity }]
    })
  }

  const removeFromCart = (medicineId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== medicineId))
  }

  const updateQuantity = (medicineId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(medicineId)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === medicineId ? { ...item, quantity } : item
      )
    )
  }

  const increaseQuantity = (medicineId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === medicineId ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const decreaseQuantity = (medicineId) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === medicineId) {
          const newQuantity = item.quantity - 1
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
        }
        return item
      }).filter((item) => item.quantity > 0)
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const toggleWishlist = (medicine) => {
    setWishlist((previousWishlist) => {
      const exists = previousWishlist.some((item) => item.id === medicine.id)
      return exists
        ? previousWishlist.filter((item) => item.id !== medicine.id)
        : [...previousWishlist, medicine]
    })
  }

  const isWishlisted = (medicineId) => wishlist.some((item) => item.id === medicineId)

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity)
    }, 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    wishlist,
    toggleWishlist,
    isWishlisted,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
