import express from 'express'
import projectRoutes from './routes/project.router.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

async function main() {
  app.use(express.json())

  app.use('/api/projects', projectRoutes)

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' })
  })

  app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`)
  })
}

main()
