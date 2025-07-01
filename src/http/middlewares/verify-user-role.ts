import { FastifyRequest, FastifyReply } from 'fastify'

export function verifyUserRole(roleToVerify: 'ADMIN' | 'MEMBER') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    request.jwtVerify()

    const { role } = request.user

    if (role !== roleToVerify) {
      return reply.status(401).send({ message: 'Unauthorized' })
    }
  }
}
