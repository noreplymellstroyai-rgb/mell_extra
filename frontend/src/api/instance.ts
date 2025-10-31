import axios, { type CreateAxiosDefaults } from 'axios'

const options: CreateAxiosDefaults = {
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true
}

export const api = axios.create(options)

api.interceptors.request.use(config => {
	return config
})

api.interceptors.response.use(
	config => config,
	async error => {
		const originalRequest = error.config

		const requestUrl = originalRequest.url || ''

		if (
			error.response?.status === 401 &&
			originalRequest &&
			!originalRequest._isRetry &&
			!requestUrl.includes('/auth') &&
			!requestUrl.includes('/me')
		) {
			originalRequest._isRetry = true

			try {
				console.log('Токен протух. Пытаюсь обновить...')
				await api.post('/auth/refresh')

				return api.request(originalRequest)
			} catch (refreshError) {
				console.error(
					'Не удалось обновить токен. Выполняю выход из системы.'
				)

				if (typeof window !== 'undefined') {
					window.location.href = '/auth'
				}
				return Promise.reject(refreshError)
			}
		}

		throw error
	}
)
