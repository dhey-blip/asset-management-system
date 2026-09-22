import api from './api'

export async function getAssets() {
  const response = await api.get('/assets')
  return response.data
}

export async function getAsset(id) {
  const response = await api.get(`/assets/${id}`)
  return response.data
}

export async function createAsset(asset) {
  const response = await api.post('/assets', asset)
  return response.data
}

export async function updateAsset(id, asset) {
  const response = await api.put(`/assets/${id}`, asset)
  return response.data
}

export async function deleteAsset(id) {
  const response = await api.delete(`/assets/${id}`)
  return response.data
}