#!/usr/bin/env node
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { createStoriesRouter } from './routes/stories.js'
import { createEpicsRouter } from './routes/epics.js'
import { createSprintRouter } from './routes/sprint.js'
import { createRefreshRouter } from './routes/refresh.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000
const projectRoot = process.cwd()

app.use(express.json())

// Disable caching for API responses (single-user app, always want fresh data)
app.use('/api', (_req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '0')
  res.set('Surrogate-Control', 'no-store')
  next()
})

// API routes
app.use('/api/stories', createStoriesRouter(projectRoot))
app.use('/api/epics', createEpicsRouter(projectRoot))
app.use('/api/sprint', createSprintRouter(projectRoot))
app.use('/api/refresh', createRefreshRouter(projectRoot))

// Serve static files in production
app.use(express.static(path.join(__dirname, '../dist/client')))

// SPA fallback - serve index.html for all other routes
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, '../dist/client/index.html'))
})

app.listen(PORT, () => {
  console.log(`bmad-ui running at http://localhost:${PORT}`)
})
