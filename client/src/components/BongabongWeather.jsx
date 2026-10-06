import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api.js";

const labels = { 0: "Clear", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast", 45: "Foggy", 48: "Foggy", 51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle", 61: "Light rain", 63: "Rain", 65: "Heavy rain", 80: "Rain showers", 81: "Rain showers", 82: "Heavy showers", 95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with hail" };
const condition = code => labels[code] || "Current conditions";
const metricColors = {
  Condition: "border-emerald-200 bg-emerald-50 text-emerald-950",
  Temperature: "border-orange-200 bg-orange-50 text-orange-950",
  "Feels like": "border-amber-200 bg-amber-50 text-amber-950",
  Humidity: "border-sky-200 bg-sky-50 text-sky-950",
  Wind: "border-violet-200 bg-violet-50 text-violet-950",
  Rain: "border-blue-200 bg-blue-50 text-blue-950",
};
const Metric = ({ label, value }) => <div className={`rounded-md border p-4 ${metricColors[label] || "border-slate-200 bg-white text-slate-900"}`}><p className="text-xs font-medium opacity-70">{label}</p><p className="mt-1 text-lg font-semibold">{value}</p></div>;

export default function BongabongWeather({ token }) {
  const [data, setData] = useState(null), [error, setError] = useState(""), [loading, setLoading] = useState(true);
  const refresh = useCallback(async (background = false) => { if (!background) { setLoading(true); setError(""); } try { setData(await api("/weather/my-location", { token })); setError(""); } catch (err) { setError(err.message || "Live weather is temporarily unavailable."); } finally { if (!background) setLoading(false); } }, [token]);
  useEffect(() => { refresh(); const timer = window.setInterval(() => refresh(true), 10 * 60 * 1000); return () => window.clearInterval(timer); }, [refresh]);
  const weather = data?.weather, today = data?.today;
  const conditionTime = data?.observedAt ? new Date(/(?:Z|[+-]\d{2}:?\d{2})$/i.test(data.observedAt) ? data.observedAt : `${data.observedAt}+08:00`) : null;
  const validConditionTime = conditionTime && !Number.isNaN(conditionTime.getTime());
  return <section className="mx-auto mt-6 w-full max-w-3xl overflow-hidden rounded-lg border border-sky-200 bg-sky-50 p-5 sm:p-6"><div className="flex flex-wrap justify-between gap-3 rounded-md bg-gradient-to-r from-sky-800 to-cyan-700 p-4 text-white"><div><p className="text-xs font-semibold uppercase tracking-wide text-sky-100">Current weather</p><h3 className="mt-1 text-lg font-semibold">{data?.location || "Your registered farm"}</h3><p className="mt-1 text-sm text-sky-100">Based on the coordinates saved for your farm.</p></div><button type="button" onClick={() => refresh()} disabled={loading} className="h-fit rounded-md border border-white/40 bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20 disabled:opacity-60">{loading ? "Updating…" : "Refresh"}</button></div>{error && <div role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-800"><p>{error}</p><button type="button" onClick={() => refresh()} className="mt-2 font-semibold underline">Try again</button></div>}{!weather && !error && <p className="mt-4 rounded-md border border-sky-200 bg-white p-4 text-sm text-slate-600">Loading current conditions…</p>}{weather && <>{data?.notice && <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{data.notice}</p>}<div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">{[["Condition", condition(weather.weather_code)], ["Temperature", `${Math.round(weather.temperature_2m)} °C`], ["Feels like", `${Math.round(weather.apparent_temperature)} °C`], ["Humidity", `${weather.relative_humidity_2m}%`], ["Wind", `${Math.round(weather.wind_speed_10m)} km/h`], ["Rain", `${weather.rain || 0} mm`]].map(([label, value]) => <Metric key={label} label={label} value={value}/>)}</div>{today && <div className="mt-5 rounded-md border border-sky-200 bg-white p-4"><p className="text-xs font-semibold uppercase tracking-wide text-sky-800">Today’s forecast</p><div className="mt-3 grid gap-3 text-sm sm:grid-cols-2"><p><span className="text-slate-500">High / low:</span> <b className="text-slate-900">{Math.round(today.temperatureMax)}° / {Math.round(today.temperatureMin)}°C</b></p><p><span className="text-slate-500">Rain chance:</span> <b className="text-slate-900">{today.rainChance ?? 0}%</b></p></div></div>}<p className="mt-4 text-xs text-slate-500">Updated {validConditionTime ? conditionTime.toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" }) : "time unavailable"}. Refreshes every 10 minutes.</p></>}</section>;
}
