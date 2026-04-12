import { createApiClient } from './createClient'
import { env } from '../config/env'

const client = createApiClient(env.paymentService)

export async function pay(payload) {
  const body = {
    orderId: Number(payload.orderId),
    method: String(payload.method ?? '').trim(),
  }
  const { data } = await client.post('payments', body)
  return data
}

export async function fetchPaymentUsage() {
  const { data } = await client.get('payments')
  return data
}
