export default function PageHeader({ eyebrow, title, description, action }) {
  const maoText = value => ({ "System administration": "MAO Staff workspace", "Admin control center": "MAO Staff control center", "Administrator access required": "MAO Staff access required", Administration: "MAO Staff" }[value] || value);
  return <header className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end">
    <div>
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[.12em] text-emerald-800">{maoText(eyebrow)}</p>}
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{maoText(title)}</h1>
      {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description.replaceAll("administrator", "authorized MAO Staff").replaceAll("Administrator", "MAO Staff")}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </header>;
}
