import * as fs from 'fs'
import * as path from 'path'
import { parseYaml } from './parsers/yaml.js'
import { parseMarkdown } from './parsers/markdown.js'
import { get, set, clear } from './cache.js'
import { BmadFileNotFoundError, BmadValidationError } from './errors.js'
import type { Story, Epic, SprintStatus } from './types.js'

interface BmadData {
  stories: Story[]
  epics: Epic[]
  sprint: SprintStatus
}

const BMAD_OUTPUT_DIR = '_bmad-output'
const CACHE_KEY = 'bmad-data'

function validateStoryData(story: Partial<Story>, filePath: string): asserts story is Story {
  const errors: string[] = []

  if (!story.id || typeof story.id !== 'string' || story.id.trim() === '') {
    errors.push('Story ID is required and must be a non-empty string')
  }

  if (!story.title || typeof story.title !== 'string' || story.title.trim() === '') {
    errors.push('Story title is required and must be a non-empty string')
  }

  if (!story.status || !['ready', 'in-dev', 'ready-for-review', 'done'].includes(story.status)) {
    errors.push(`Story status must be one of: ready, in-dev, ready-for-review, done (got: ${story.status})`)
  }

  if (!story.epicId || typeof story.epicId !== 'string') {
    errors.push('Story epicId is required')
  }

  if (errors.length > 0) {
    throw new BmadValidationError(
      `Invalid story data in ${filePath}`,
      filePath,
      errors
    )
  }
}

function verifyEpicExists(epicId: string, epics: Epic[], filePath: string): void {
  const epicExists = epics.some(e => e.id === epicId)
  if (!epicExists) {
    console.warn(
      `[bmad-reader] Warning: Story in ${filePath} references non-existent epic: ${epicId}`
    )
  }
}

async function readBmadFiles(projectRoot: string): Promise<BmadData> {
  const cached = get<BmadData>(CACHE_KEY)
  if (cached) {
    return cached
  }

  const bmadOutputPath = path.join(projectRoot, BMAD_OUTPUT_DIR)

  if (!fs.existsSync(bmadOutputPath)) {
    throw new BmadFileNotFoundError(bmadOutputPath)
  }

  const data: BmadData = {
    stories: [],
    epics: [],
    sprint: {
      sprintId: 'default',
      name: 'Sprint 1',
      stories: [],
      lastUpdated: new Date().toISOString(),
    },
  }

  const planningPath = path.join(bmadOutputPath, 'planning-artifacts')
  if (!fs.existsSync(planningPath)) {
    console.warn(`[bmad-reader] Warning: ${planningPath} does not exist`)
  } else {
    data.epics = readEpics(planningPath)
  }

  const implementationPath = path.join(bmadOutputPath, 'implementation-artifacts')
  if (!fs.existsSync(implementationPath)) {
    console.warn(`[bmad-reader] Warning: ${implementationPath} does not exist`)
  } else {
    data.stories = readStories(implementationPath, data.epics)
    data.sprint = readSprintStatus(implementationPath)
  }

  set(CACHE_KEY, data)
  return data
}

function readEpics(planningPath: string): Epic[] {
  const epics: Epic[] = []
  const epicsFile = path.join(planningPath, 'epics.md')

  if (fs.existsSync(epicsFile)) {
    const content = fs.readFileSync(epicsFile, 'utf-8')
    const parsed = parseMarkdown(content)
    const frontmatter = parsed.frontmatter as Record<string, unknown>

    // Extract epics from frontmatter or parse from body
    if (frontmatter.epics && Array.isArray(frontmatter.epics)) {
      return frontmatter.epics as Epic[]
    }

    // Parse epics from markdown body
    const epicMatches = parsed.body.matchAll(
      /##\s+Epic\s+(\d+):\s+(.+?)(?:\n|$)([\s\S]*?)(?=\n##\s+Epic|\n*$)/g
    )

    for (const match of epicMatches) {
      const epicId = `epic-${match[1]}`
      const title = match[2].trim()
      const body = match[3].trim()

      // Extract story IDs from the body
      const storyIdMatches = body.matchAll(/-\s+(?:\*\*Story\s+)?(\d+-\d+-[^:]+)/g)
      const storyIds: string[] = []
      for (const storyMatch of storyIdMatches) {
        storyIds.push(storyMatch[1])
      }

      epics.push({
        id: epicId,
        title,
        description: body.split('\n')[0] || '',
        storyIds,
      })
    }
  }

  return epics
}

function readStories(implementationPath: string, epics: Epic[]): Story[] {
  const stories: Story[] = []
  const files = fs.readdirSync(implementationPath)

  for (const file of files) {
    if (file.endsWith('.md') && file.match(/^\d+-\d+-/)) {
      const filePath = path.join(implementationPath, file)
      
      try {
        const content = fs.readFileSync(filePath, 'utf-8')
        const parsed = parseMarkdown(content)
        const frontmatter = parsed.frontmatter as Record<string, unknown>

        const idMatch = file.match(/^(\d+-\d+-[^.]+)/)
        const id = idMatch ? idMatch[1] : file.replace('.md', '')

        const headerMatch = parsed.body.match(/^#\s+(?:Story\s+\d+\.\d+:\s*)?(.+?)$/m)
        const title = headerMatch
          ? headerMatch[1].trim()
          : (frontmatter.title as string) || id

        const epicMatch = id.match(/^(\d+)-/)
        const epicId = (frontmatter.epicId as string) || 
                       (epicMatch ? `epic-${epicMatch[1]}` : 'unknown')

        const acMatches = parsed.body.matchAll(
          /#{1,3}\s+(?:AC|Acceptance\s+Criteria)\s*[-:]?\s*(\d+[:\s]+.+?)(?:\n|$)/gi
        )
        const acceptanceCriteria: string[] = []
        for (const acMatch of acMatches) {
          acceptanceCriteria.push(acMatch[1].trim())
        }

        const storyData: Partial<Story> = {
          id,
          title: title.trim(),
          description: (frontmatter.description as string) || '',
          status: mapStatus(frontmatter.Status as string || 'backlog'),
          epicId,
          acceptanceCriteria,
        }

        validateStoryData(storyData, filePath)
        verifyEpicExists(storyData.epicId, epics, filePath)

        stories.push(storyData)
      } catch (error) {
        if (error instanceof BmadValidationError) {
          console.error(`[bmad-reader] Validation error in ${filePath}:`, error.message)
          if (error.details) {
            error.details.forEach(detail => console.error(`  - ${detail}`))
          }
        } else {
          throw error
        }
      }
    }
  }

  return stories.sort((a, b) => a.id.localeCompare(b.id))
}

function mapStatus(status: string): Story['status'] {
  const statusMap: Record<string, Story['status']> = {
    'ready-for-dev': 'ready',
    'in-progress': 'in-dev',
    'in-dev': 'in-dev',
    review: 'ready-for-review',
    'ready-for-review': 'ready-for-review',
    done: 'done',
    backlog: 'ready',
  }
  return statusMap[status.toLowerCase()] || 'ready'
}

function readSprintStatus(implementationPath: string): SprintStatus {
  const sprintFile = path.join(implementationPath, 'sprint-status.yaml')

  if (fs.existsSync(sprintFile)) {
    try {
      const content = fs.readFileSync(sprintFile, 'utf-8')
      const parsed = parseYaml(content) as Record<string, unknown>

      if (!parsed || typeof parsed !== 'object') {
        throw new BmadValidationError(
          'Invalid sprint-status.yaml: must be an object',
          sprintFile
        )
      }

      return {
        sprintId: 'current',
        name: typeof parsed.name === 'string' ? parsed.name : 'Current Sprint',
        project: typeof parsed.project === 'string' ? parsed.project : undefined,
        stories: [],
        lastUpdated: typeof parsed.generated === 'string' 
          ? parsed.generated 
          : new Date().toISOString(),
        developmentStatus: typeof parsed.development_status === 'object' 
          ? parsed.development_status as Record<string, string>
          : {},
      }
    } catch (error) {
      if (error instanceof BmadValidationError) {
        throw error
      }
      throw new BmadValidationError(
        `Failed to parse sprint-status.yaml: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sprintFile
      )
    }
  }

  return {
    sprintId: 'default',
    name: 'Default Sprint',
    stories: [],
    lastUpdated: new Date().toISOString(),
  }
}

async function getStories(projectRoot: string): Promise<Story[]> {
  const data = await readBmadFiles(projectRoot)
  return data.stories
}

async function getStoryById(projectRoot: string, id: string): Promise<Story | undefined> {
  const stories = await getStories(projectRoot)
  return stories.find((s) => s.id === id)
}

async function getEpics(projectRoot: string): Promise<Epic[]> {
  const data = await readBmadFiles(projectRoot)
  return data.epics
}

async function getEpicById(projectRoot: string, id: string): Promise<Epic | undefined> {
  const epics = await getEpics(projectRoot)
  return epics.find((e) => e.id === id)
}

async function getSprintStatus(projectRoot: string): Promise<SprintStatus> {
  const data = await readBmadFiles(projectRoot)
  return data.sprint
}

async function refreshCache(projectRoot: string): Promise<BmadData> {
  clear()
  return readBmadFiles(projectRoot)
}

export {
  readBmadFiles,
  getStories,
  getEpics,
  getSprintStatus,
  getStoryById,
  getEpicById,
  refreshCache,
}
