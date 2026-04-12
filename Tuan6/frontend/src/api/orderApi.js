import { createApiClient } from './createClient'
import { env } from '../config/env'

const client = createApiClient(env.orderService)

export async function createOrder(payload) {
  const body = {
    userId: payload.userId != null ? Number(payload.userId) : undefined,
    items: (payload.items || []).map((i) => ({
      foodId: Number(i.foodId),
      quantity: Number(i.quantity),
    })),
  }
  const { data } = await client.post('orders', body)
  return data
}

export async function fetchOrders(params = {}) {
  const { data } = await client.get('orders', { params })
  return Array.isArray(data) ? data : data?.content ?? data?.orders ?? []
}
