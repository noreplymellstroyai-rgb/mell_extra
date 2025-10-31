import axios, { type CreateAxiosDefaults } from 'axios'

const options: CreateAxiosDefaults = {
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json'
	}
}

export const api = axios.create(options)

api.interceptors.response.use(
	config => config,

	async error => {
		const originalRequest = error.config

		if (
			error.response?.status === 401 &&
			originalRequest &&
			!originalRequest._isRetry
		) {
			originalRequest._isRetry = true

			try {
				if (originalRequest.url === '/auth/refresh') {
					console.error(
						'Refresh Токен недействителен или истёк. Выход из системы'
					)
					if (typeof window !== 'undefined') {
						window.location.href = '/auth'
					}
					return Promise.reject(error)
				}

				console.log('Токен протух. Пытаюсь обновить...')
				await api.post('/auth/refresh')

				console.log('Токен обновлен. Делаю запрос')
				return api.request(originalRequest)
			} catch (refreshError) {
				console.error(
					'Не удалось обновить токен. Выполняю выход из системы'
				)

				if (typeof window !== 'undefined') {
					window.location.href = '/auth'
				}
				return Promise.reject(refreshError)
			}
		}

		return Promise.reject(error)
	}
)
