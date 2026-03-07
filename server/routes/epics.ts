import { Router } from 'express'
import { getEpics, getEpicById } from '../lib/bmad-reader.js'
import { wrapError, getHttpStatusCode, BmadError } from '../lib/errors.js'
import { validateEpicId } from '../lib/validation.js'

export function createEpicsRouter(projectRoot: string): Router {
  const router = Router()

  router.get('/', async (_req, res) => {
    try {
      const epics = await getEpics(projectRoot)
      res.json(epics)
    } catch (error) {
      const bmadError = wrapError(error)
      res.status(getHttpStatusCode(bmadError.code)).json(bmadError.toJSON())
    }
  })

  router.get('/:id', async (req, res) => {
    try {
      validateEpicId(req.params.id)

      const epic = await getEpicById(projectRoot, req.params.id)
      if (!epic) {
        const notFoundError = new BmadError('NOT_FOUND', `Epic not found: ${req.params.id}`)
        return res.status(404).json(notFoundError.toJSON())
      }
      res.json(epic)
    } catch (error) {
      const bmadError = wrapError(error)
      res.status(getHttpStatusCode(bmadError.code)).json(bmadError.toJSON())
    }
  })

  return router
}

export default createEpicsRouter
