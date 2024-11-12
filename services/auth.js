// services/auth.js
export const loginUser = async (credentials) => {
	const response = await fetch('/api/auth/callback/credentials', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(credentials)
	})

	if (!response.ok) {
		throw new Error('Giriş işlemi başarısız oldu')
	}

	return response.json()
}

export const registerUser = async (userData) => {
	const response = await fetch('/api/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(userData)
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Kayıt işlemi başarısız oldu')
	}

	return response.json()
}
