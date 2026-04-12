import { createApiClient } from './createClient'
import { env } from '../config/env'

const client = createApiClient(env.foodService)

export async function fetchFoods() {
  const { data } = await client.get('foods')
  return Array.isArray(data) ? data : data?.content ?? data?.items ?? []
}

export async function createFood(payload) {
  const { data } = await client.post('foods', payload)
  return data
}

export async function updateFood(id, payload) {
  const { data } = await client.put(`foods/${id}`, payload)
  return data
}

export async function deleteFood(id) {
  await client.delete(`foods/${id}`)
}
