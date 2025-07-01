import { app } from '@/app'
import { expect } from 'vitest'
import request from 'supertest'

export async function createAndAuthenticateUser() {
  const response = await request(app.server).post('/users').send({
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: '123456',
  })

  expect(response.status).toBe(201)

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'john.doe@example.com',
    password: '123456',
  })

  expect(authResponse.status).toBe(200)

  return {
    token: authResponse.body.token,
  }
}
