import axios from 'axios'

const API_ROOT = 'http://localhost:9090'

const agent = axios.create({
  baseURL: API_ROOT,
  // withCredentials: true
})

export default agent
