import { useState } from 'react'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('Login form submitted:', formData)
  }

  return (
    <section className="mx-auto flex w-full max-w-lg flex-1 items-center px-4 py-16">
      <div className="w-full rounded-3xl bg-white p-8 shadow-lg ring-1 ring-black/5">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
          Login
        </h2>
        <p className="mt-4 text-sm text-slate-600">
          Enter your credentials to access your account.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-sky-600 px-4 py-2 text-base font-semibold text-white shadow-sm transition hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-slate-600">
            Don&apos;t have an account yet?{' '}
            <a className="font-medium text-sky-600 hover:text-sky-500" href="#">
              Create Account
            </a>
          </p>
        </form>
      </div>
    </section>
  )
}

export default Login
