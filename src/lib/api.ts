import axios from 'axios'
import { BmadError } from './errors'

export const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(BmadError.fromAxios(error))
)
