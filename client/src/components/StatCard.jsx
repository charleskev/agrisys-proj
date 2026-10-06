export default function StatCard({ label, value, tone = "green" }) {
  const tones = { green: "border-l-emerald-700", amber: "border-l-amber-600", red: "border-l-red-600", blue: "border-l-sky-700" };
  return <div className={`rounded-md border border-slate-200 border-l-[3px] bg-white p-4 ${tones[tone]}`}><p className="text-sm font-medium text-slate-600">{label}</p><p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{value}</p></div>;
}
