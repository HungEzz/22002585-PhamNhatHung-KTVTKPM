import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

function foodKey(item) {
  return String(item.id ?? item.foodId)
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState([])

  const addToCart = useCallback((food, qty = 1) => {
    const id = food.id ?? food.foodId
    const name = food.name ?? food.title ?? 'Món'
    const price = Number(food.price ?? 0)
    setLines((prev) => {
      const key = String(id)
      const idx = prev.findIndex((l) => foodKey(l) === key)
      if (idx === -1) {
        return [...prev, { id, name, price, quantity: qty }]
      }
      const next = [...prev]
      next[idx] = { ...next[idx], quantity: next[idx].quantity + qty }
      return next
    })
  }, [])

  const setQuantity = useCallback((id, quantity) => {
    const q = Math.max(0, Number(quantity) || 0)
    setLines((prev) => {
      if (q === 0) return prev.filter((l) => String(l.id) !== String(id))
      return prev.map((l) => (String(l.id) === String(id) ? { ...l, quantity: q } : l))
    })
  }, [])

  const removeLine = useCallback((id) => {
    setLines((prev) => prev.filter((l) => String(l.id) !== String(id)))
  }, [])

  const clearCart = useCallback(() => setLines([]), [])

  const total = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [lines]
  )

  const value = useMemo(
    () => ({
      lines,
      addToCart,
      setQuantity,
      removeLine,
      clearCart,
      total,
      itemCount: lines.reduce((n, l) => n + l.quantity, 0),
    }),
    [lines, addToCart, setQuantity, removeLine, clearCart, total]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
