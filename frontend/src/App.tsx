import { FormEvent, useEffect, useMemo, useState } from 'react'

type User = {
  id: number
  email: string
  passwordHash: string
}

type Project = {
  id: number
  name: string
  ownerId: number
}

type ApiError = {
  message?: string
}

const initialUserForm = {
  email: 'admin@gmail.com',
  password: '12345678'
}

const initialProjectName = 'Demo project'

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    }
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const error = data as ApiError | null
    throw new Error(
      error?.message ?? `Request failed with status ${response.status}`
    )
  }

  return data as T
}

function formatJson(value: unknown) {
  return JSON.stringify(value, null, 2)
}

export default function App() {
  const [userForm, setUserForm] = useState(initialUserForm)
  const [projectName, setProjectName] = useState(initialProjectName)
  const [userIdToFetch, setUserIdToFetch] = useState('1')
  const [createdUser, setCreatedUser] = useState<User | null>(null)
  const [fetchedUser, setFetchedUser] = useState<User | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const hasProjects = useMemo(() => projects.length > 0, [projects])

  useEffect(() => {
    void loadProjects()
  }, [])

  async function loadProjects() {
    try {
      setLoading(true)
      setError('')
      const data = await requestJson<Project[]>('/api/projects')
      setProjects(data)
      setMessage('Projects loaded')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')
      setMessage('')
      const data = await requestJson<User>('/api/users', {
        method: 'POST',
        body: JSON.stringify({
          email: userForm.email,
          password: userForm.password
        })
      })
      setCreatedUser(data)
      setMessage('User created')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  async function handleFetchUser() {
    try {
      const id = Number(userIdToFetch)
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Enter a valid user id')
      }

      setLoading(true)
      setError('')
      setMessage('')
      const data = await requestJson<User>(`/api/users/${id}`)
      setFetchedUser(data)
      setMessage(`User ${id} loaded`)
    } catch (err) {
      setFetchedUser(null)
      setError(err instanceof Error ? err.message : 'Failed to load user')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')
      setMessage('')
      await requestJson<Project>('/api/projects', {
        method: 'POST',
        body: JSON.stringify({ name: projectName })
      })
      setMessage('Project created')
      await loadProjects()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="card flex flex-col gap-3">
          <p className="text-sm uppercase tracking-[0.25em] text-sky-400">
            Backend visualizer
          </p>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              React + Tailwind frontend for your backend
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-300">
              Simple UI for checking users and projects. Requests go through the
              Vite proxy to{' '}
              <code className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-100">
                /api
              </code>
              .
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="rounded-full border border-slate-700 px-3 py-1">
              Users
            </span>
            <span className="rounded-full border border-slate-700 px-3 py-1">
              Projects
            </span>
            <span className="rounded-full border border-slate-700 px-3 py-1">
              Minimal UI
            </span>
          </div>
        </header>

        {(error || message) && (
          <div
            className={`card border ${error ? 'border-rose-500/60' : 'border-emerald-500/60'}`}
          >
            <p className="text-sm font-medium text-slate-200">
              {error || message}
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Create user</h2>
              <p className="text-sm text-slate-400">
                Sends {`{ email, password }`} to <code>/api/users</code>.
              </p>
            </div>

            <form className="space-y-3" onSubmit={handleCreateUser}>
              <label className="block space-y-2 text-sm">
                <span className="text-slate-300">Email</span>
                <input
                  className="input"
                  value={userForm.email}
                  onChange={(event) =>
                    setUserForm((current) => ({
                      ...current,
                      email: event.target.value
                    }))
                  }
                  type="email"
                  placeholder="admin@gmail.com"
                />
              </label>

              <label className="block space-y-2 text-sm">
                <span className="text-slate-300">Password</span>
                <input
                  className="input"
                  value={userForm.password}
                  onChange={(event) =>
                    setUserForm((current) => ({
                      ...current,
                      password: event.target.value
                    }))
                  }
                  type="password"
                  placeholder="12345678"
                />
              </label>

              <button className="button" disabled={loading} type="submit">
                Create user
              </button>
            </form>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                Last created user
              </p>
              <pre className="overflow-auto whitespace-pre-wrap break-words text-xs leading-6 text-slate-200">
                {createdUser ? formatJson(createdUser) : 'No user created yet'}
              </pre>
            </div>
          </section>

          <section className="card space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Find user by id
              </h2>
              <p className="text-sm text-slate-400">
                GET <code>/api/users/:id</code>.
              </p>
            </div>

            <div className="flex gap-3">
              <input
                className="input"
                value={userIdToFetch}
                onChange={(event) => setUserIdToFetch(event.target.value)}
                placeholder="1"
                inputMode="numeric"
              />
              <button
                className="button-secondary whitespace-nowrap"
                disabled={loading}
                onClick={handleFetchUser}
                type="button"
              >
                Load user
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                Fetched user
              </p>
              <pre className="overflow-auto whitespace-pre-wrap break-words text-xs leading-6 text-slate-200">
                {fetchedUser ? formatJson(fetchedUser) : 'Nothing loaded yet'}
              </pre>
            </div>
          </section>
        </div>

        <section className="card space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Create project</h2>
            <p className="text-sm text-slate-400">
              Sends {`{ name }`} to <code>/api/projects</code>. If your backend
              still uses ownerId = 1, create a user with id 1 first.
            </p>
          </div>

          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={handleCreateProject}
          >
            <input
              className="input flex-1"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              placeholder="Demo project"
            />
            <button className="button" disabled={loading} type="submit">
              Create project
            </button>
            <button
              className="button-secondary"
              disabled={loading}
              type="button"
              onClick={loadProjects}
            >
              Refresh projects
            </button>
          </form>
        </section>

        <section className="card space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Projects</h2>
              <p className="text-sm text-slate-400">
                GET <code>/api/projects</code>.
              </p>
            </div>
            <button
              className="button-secondary"
              disabled={loading}
              onClick={loadProjects}
              type="button"
            >
              Reload
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {hasProjects ? (
              projects.map((project) => (
                <article
                  key={project.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Project #{project.id}
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-white">
                    {project.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">
                    ownerId: {project.ownerId}
                  </p>
                </article>
              ))
            ) : (
              <p className="text-sm text-slate-400">No projects yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
