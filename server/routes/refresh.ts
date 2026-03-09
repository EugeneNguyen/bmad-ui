import { Router } from 'express'
import { get } from '../lib/cache.js'
import { refreshCache } from '../lib/bmad-reader.js'
import { wrapError, getHttpStatusCode } from '../lib/errors.js'
import type { Story, Epic, SprintStatus } from '../lib/types.js'

interface BmadData {
  stories: Story[]
  epics: Epic[]
  sprint: SprintStatus
}

interface ChangeCounts {
  added: number
  updated: number
  removed: number
}

interface ChangeIds {
  addedIds: string[]
  updatedIds: string[]
  removedIds: string[]
}

const CACHE_KEY = 'bmad-data'

function computeChanges(
  oldData: BmadData | null,
  newData: BmadData
): { changes: ChangeCounts; changeIds: ChangeIds } {
  const oldStories = oldData?.stories ?? []
  const oldStoriesMap = new Map(oldStories.map((s) => [s.id, s]))

  const addedIds: string[] = []
  const updatedIds: string[] = []
  const removedIds: string[] = []

  for (const story of newData.stories) {
    const oldStory = oldStoriesMap.get(story.id)
    if (!oldStory) {
      addedIds.push(story.id)
    } else if (
      oldStory.status !== story.status ||
      oldStory.title !== story.title ||
      oldStory.description !== story.description
    ) {
      updatedIds.push(story.id)
    }
  }

  const newStoriesIds = new Set(newData.stories.map((s) => s.id))
  for (const oldStory of oldStories) {
    if (!newStoriesIds.has(oldStory.id)) {
      removedIds.push(oldStory.id)
    }
  }

  return {
    changes: {
      added: addedIds.length,
      updated: updatedIds.length,
      removed: removedIds.length,
    },
    changeIds: {
      addedIds,
      updatedIds,
      removedIds,
    },
  }
}

export function createRefreshRouter(projectRoot: string): Router {
  const router = Router()

  router.post('/', async (_req, res) => {
    try {
      const oldData = get<BmadData>(CACHE_KEY) ?? null
      const newData = await refreshCache(projectRoot)
      const { changes, changeIds } = computeChanges(oldData, newData)

      res.json({
        stories: newData.stories,
        epics: newData.epics,
        sprint: newData.sprint,
        changes,
        changeIds,
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
