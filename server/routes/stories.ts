import { Router } from 'express'
import { getStories, getStoryById } from '../lib/bmad-reader.js'
import { wrapError, getHttpStatusCode, BmadError } from '../lib/errors.js'
import { validateStoryId } from '../lib/validation.js'

export function createStoriesRouter(projectRoot: string): Router {
  const router = Router()

  router.get('/', async (_req, res) => {
    try {
      const stories = await getStories(projectRoot)
      res.json(stories)
    } catch (error) {
      const bmadError = wrapError(error)
      res.status(getHttpStatusCode(bmadError.code)).json(bmadError.toJSON())
    }
  })

  router.get('/:id', async (req, res) => {
    try {
      validateStoryId(req.params.id)

      const story = await getStoryById(projectRoot, req.params.id)
      if (!story) {
        const notFoundError = new BmadError('NOT_FOUND', `Story not found: ${req.params.id}`)
        return res.status(404).json(notFoundError.toJSON())
      }
      res.json(story)
    } catch (error) {
      const bmadError = wrapError(error)
      res.status(getHttpStatusCode(bmadError.code)).json(bmadError.toJSON())
    }
  })

  return router
}

export default createStoriesRouter
