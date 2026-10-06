const workflow = [
  ["01", "Create an account", "Register with your contact and address details."],
  ["02", "Add your farm", "Save your land location, crops, and farm information."],
  ["03", "Track your report", "Send crop damage details and follow MAO updates."],
];

const services = [
  ["Farm records", "Keep land, crop, and farmer details together."],
  ["Damage reports", "Submit photos, crop details, and an incident location."],
  ["Service updates", "Check report status, notices, and farm service reminders."],
];

export function HomePage({ onNavigate }) {
  return <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
    <header className="sticky top-0 z-20 w-full border-b border-emerald-950/10 bg-gradient-to-r from-white via-white to-emerald-50/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-5">
        <a href="#home" className="flex min-w-0 items-center gap-2.5 sm:gap-3" aria-label="AgriSystem home">
          <img src="/icons/agrisystem-icon.svg" alt="" className="h-10 w-10 rounded-lg" />
          <span className="min-w-0"><span className="block truncate text-base font-bold tracking-tight">AgriSystem <span className="font-medium text-emerald-700">MAO</span></span><span className="hidden text-[10px] text-slate-500 sm:block">Bongabong Municipal Agriculture Office</span></span>
        </a>
        <nav className="flex shrink-0 items-center gap-1.5 sm:gap-2" aria-label="Public navigation"><button onClick={() => onNavigate("#login")} className="shrink-0 rounded-md px-2.5 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 sm:px-3">Sign in</button><button onClick={() => onNavigate("#register")} className="shrink-0 rounded-md bg-gradient-to-r from-emerald-800 to-teal-700 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-900 hover:to-teal-800 sm:px-4"><span className="sm:hidden">Register</span><span className="hidden sm:inline">Create account</span></button></nav>
      </div>
    </header>

    <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#eff8e9] via-[#e2f2da] to-[#d4ebc9] text-emerald-950">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_22%,rgba(163,230,53,.16),transparent_28rem),radial-gradient(ellipse_at_8%_95%,rgba(45,212,191,.13),transparent_30rem)]" />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-4 py-12 sm:gap-10 sm:px-5 sm:py-20 lg:grid-cols-[1fr_1fr] lg:py-24">
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-emerald-800">Farmer services · Bongabong, Oriental Mindoro</p>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl xl:text-6xl">Farm support,<br/><span className="inline-block whitespace-nowrap bg-gradient-to-r from-emerald-700 via-green-700 to-lime-700 bg-clip-text text-transparent">within reach.</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-emerald-950/75">Keep your farm records in one place, report crop damage with useful details, and follow updates from the Municipal Agriculture Office.</p>
          <div className="mt-8 flex flex-wrap gap-3"><button onClick={() => onNavigate("#register")} className="rounded-md bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900">Register as a farmer</button><button onClick={() => onNavigate("#login")} className="rounded-md border border-emerald-900/25 px-5 py-3 text-sm font-semibold text-emerald-950 hover:bg-white/50">Sign in</button></div>
          <p className="mt-6 text-sm text-emerald-950/65">Land records <span className="px-2 text-emerald-700">·</span> Damage reports <span className="px-2 text-emerald-700">·</span> MAO updates</p>
        </div>

        <div className="hero-scene mx-auto w-full max-w-[560px] overflow-hidden rounded-2xl border border-white/70 shadow-xl shadow-emerald-950/15">
          <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=85" alt="Sunlit green farmland with rolling fields and distant hills" className="hero-farm-art block aspect-[4/3] h-auto w-full object-cover" />
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-emerald-800">One place for farm services</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">From farm details to follow-up.</h2><p className="mt-4 max-w-md text-sm leading-6 text-slate-600">The portal helps Bongabong farmers share clear information with MAO staff and keep track of what happens next.</p></div>
        <div className="grid gap-3 sm:grid-cols-3">{services.map(([title, description], i) => <article key={title} className="rounded-lg border border-emerald-100 bg-gradient-to-br from-white via-white to-emerald-50/70 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"><p className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-emerald-100 to-lime-100 text-xs font-semibold text-emerald-900">0{i + 1}</p><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></article>)}</div>
      </div>
    </section>

    <section className="border-y border-slate-200 bg-white"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-emerald-800">Getting started</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">Three steps to get going.</h2></div><ol className="divide-y divide-slate-200">{workflow.map(([number, title, description]) => <li key={number} className="flex gap-5 py-4 first:pt-0 last:pb-0"><span className="pt-0.5 text-xs font-semibold text-emerald-800">{number}</span><span><span className="font-semibold">{title}</span><span className="mt-1 block text-sm leading-6 text-slate-600">{description}</span></span></li>)}</ol></div></section>

    <section className="mx-auto max-w-7xl px-5 py-14"><div className="relative isolate flex flex-col justify-between gap-6 overflow-hidden rounded-lg bg-gradient-to-br from-emerald-950 via-[#123c30] to-teal-800 p-6 text-white sm:flex-row sm:items-center sm:p-8"><div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_90%_20%,rgba(190,242,100,.24),transparent_18rem)]"/><div><h2 className="text-xl font-semibold">Ready to organize your farm records?</h2><p className="mt-2 text-sm text-white/75">Create an account to add your farm and access Bongabong MAO services.</p></div><button onClick={() => onNavigate("#register")} className="shrink-0 rounded-md bg-gradient-to-r from-lime-300 to-lime-200 px-5 py-3 text-sm font-semibold text-emerald-950 shadow-sm transition hover:brightness-105">Create farmer account</button></div></section>
    <footer className="border-t border-slate-200 bg-white px-5 py-5 text-center text-xs text-slate-500">AgriSystem · Bongabong Municipal Agriculture Office · 2026</footer>
  </main>;
}
