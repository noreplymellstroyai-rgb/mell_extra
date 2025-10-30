export interface AuthRequest {
	email: string
	password: string
	username: string
}

export interface ConfirmEmailRequest {
	email: string
	code: string
}

export interface IUser {
	username?: string
	email: string
	password?: string
	picture?: string
}
