const Footer = () => (
  <footer className="mt-auto bg-slate-900 py-6 text-sm text-slate-200">
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
      <p>&copy; {new Date().getFullYear()} Funnnny. All rights reserved.</p>
      <p className="text-slate-400">Built with React, Vite, and Tailwind CSS.</p>
    </div>
  </footer>
)

export default Footer
