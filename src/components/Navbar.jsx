import { NavLink } from 'react-router-dom'

const navigation = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/login', label: 'Login' },
]

const Navbar = () => (
  <header className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
    <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
      <NavLink className="text-lg font-semibold tracking-tight text-slate-900" to="/">
        Funnnny
      </NavLink>
      <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `transition hover:text-slate-900 ${
                isActive ? 'text-slate-900 underline decoration-sky-500 decoration-2 underline-offset-4' : ''
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  </header>
)

export default Navbar
