import axios from "axios";
import { getSession } from "next-auth/react";
// import { useCookies } from "next-client-cookies";
// import { getCookies } from 'next-client-cookies/server';
// import {  } from "cooki"

const AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
})

export function setAuthToken(token) {
    AxiosInstance.defaults.headers.common["Authorization"] = `Token ${token}`
}

AxiosInstance.interceptors.request.use(
  async (config) => {
    // const cookies = await getCookies()
    // console.log("Axios Cookies", cookies.get("test"))
    // const cookies = getCookie
    if (typeof window != "undefined") {
      const session = await getSession()
      if (session?.user?.token) {
        config.headers.Authorization = `Token ${session.user.token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

AxiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return error
  }
)

export default AxiosInstance