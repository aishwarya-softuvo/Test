const Contact = () => (
  <section className="mx-auto w-full max-w-4xl flex-1 px-4 py-16">
    <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-black/5">
      <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
        Contact
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-600">
        Have questions or feedback? Reach out to us at{' '}
        <a className="font-medium text-sky-600 hover:text-sky-500" href="mailto:hello@example.com">
          hello@example.com
        </a>{' '}
        and we&apos;ll get back to you soon.
      </p>
    </div>
  </section>
)

export default Contact
