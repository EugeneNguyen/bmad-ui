import { Router } from 'express'
import { refreshCache } from '../lib/bmad-reader.js'
import { wrapError, getHttpStatusCode } from '../lib/errors.js'

export function createRefreshRouter(projectRoot: string): Router {
  const router = Router()

  router.post('/', async (_req, res) => {
    try {
      await refreshCache(projectRoot)
      res.json({
        message: 'Cache cleared and files re-parsed',
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      const bmadError = wrapError(error)
      res.status(getHttpStatusCode(bmadError.code)).json(bmadError.toJSON())
    }
  })

  return router
}

export default createRefreshRouter
