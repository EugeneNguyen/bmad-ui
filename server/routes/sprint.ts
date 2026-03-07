import { Router } from 'express'
import { getSprintStatus } from '../lib/bmad-reader.js'
import { wrapError, getHttpStatusCode } from '../lib/errors.js'

export function createSprintRouter(projectRoot: string): Router {
  const router = Router()

  router.get('/', async (_req, res) => {
    try {
      const sprint = await getSprintStatus(projectRoot)
      res.json(sprint)
    } catch (error) {
      const bmadError = wrapError(error)
      res.status(getHttpStatusCode(bmadError.code)).json(bmadError.toJSON())
    }
  })

  return router
}

export default createSprintRouter
