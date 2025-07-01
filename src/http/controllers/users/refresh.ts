import { FastifyRequest, FastifyReply } from 'fastify'

type Payload = {
  role: 'ADMIN' | 'MEMBER'
}

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true }) // verify only the cookie

  const token = await reply.jwtSign(
    {
      role: request.user.role,
    },
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  const newRefreshToken = await reply.jwtSign(
    {
      role: request.user.role,
    },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d',
      },
    },
  )

  return reply
    .setCookie('refreshToken', newRefreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({
      token,
    })
}
