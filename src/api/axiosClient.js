import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error)
    return Promise.reject(error)
  },
)

export default axiosClient
