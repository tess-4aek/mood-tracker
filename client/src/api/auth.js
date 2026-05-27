import { api } from './client'

export function requestOtp(email) {
  return api('/auth/request-otp', {
    method: 'POST',
    body: { email }
  })
}

export function verifyOtp(email, otp) {
  return api('/auth/verify-otp', {
    method: 'POST',
    body: { email, otp }
  })
}

export function logout() {
  return api('/auth/logout', {
    method: 'POST'
  })
}

export function getMe() {
  return api('/auth/me')
}
