import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api.js";
import useRealtimeRefresh from "../hooks/useRealtimeRefresh.js";

const farmerLinks = [
  { group: "Workspace", label: "Overview", href: "#farmer", tag: "Home" },
  { label: "My Profile & Land", href: "#profile", tag: "Land" },
  { group: "Reports", label: "Report Damage", href: "#report", tag: "Report" },
  { label: "My Reports", href: "#my-reports", tag: "Reports" },
  { group: "Updates", label: "Weather Condition", href: "#weather", tag: "Weather" },
  { label: "Notifications", href: "#notifications", tag: "Alerts" },
];

const staffLinks = [
  { group: "Operations", label: "Operations Overview", href: "#staff", tag: "Home" },
  { label: "Review Reports", href: "#review", tag: "Review" },
  { label: "Farmer Registrations", href: "#registrations", tag: "Farmers" },
  { label: "Accepted Farmers", href: "#farmers", tag: "Directory" },
  { group: "Communication", label: "Send Notification", href: "#send-notification", tag: "Notify" },
  { group: "MAO Staff", label: "Farmer Accounts", href: "#users", tag: "Users" },
  { label: "MAO Staff Center", href: "#admin", tag: "MAO", adminOnly: true },
];

export default function AppShell({ role = "farmer", children, onLogout }) {
  const isFarmer = role === "farmer";
  const isAdmin = JSON.parse(localStorage.getItem("agrisystem-session") || "null")?.user?.role === "admin";
  const links = (isFarmer ? farmerLinks : staffLinks).filter(link => !link.adminOnly || isAdmin);
  const home = isFarmer ? "#farmer" : "#staff";
  const activeHash = window.location.hash || home;
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [staffReviewCounts, setStaffReviewCounts] = useState({ reports: 0, registrations: 0 });
  const token = JSON.parse(localStorage.getItem("agrisystem-session") || "null")?.token;
  const loadUnreadNotifications = useCallback(() => {
    if (!isFarmer || !token) return Promise.resolve();
    return api("/notifications/mine", { token }).then(data => setUnreadNotifications(data.notifications.filter(item => !item.read_at).length)).catch(() => setUnreadNotifications(0));
  }, [isFarmer, token]);
  const loadStaffReviewCounts = useCallback(() => {
    if (isFarmer || !token) return Promise.resolve();
    return api("/admin/review-indicators", { token }).then(counts => setStaffReviewCounts({ reports: counts.reports || 0, registrations: counts.registrations || 0 })).catch(() => setStaffReviewCounts({ reports: 0, registrations: 0 }));
  }, [isFarmer, token]);
  const refreshIndicators = isFarmer ? loadUnreadNotifications : loadStaffReviewCounts;
  useEffect(() => {
    let active = true;
    refreshIndicators().catch(() => { if (active) setUnreadNotifications(0); });
    return () => { active = false; };
  }, [refreshIndicators]);
  useRealtimeRefresh(token, refreshIndicators);
  useEffect(() => {
    window.addEventListener("agrisystem-review-items-seen", loadStaffReviewCounts);
    return () => window.removeEventListener("agrisystem-review-items-seen", loadStaffReviewCounts);
  }, [loadStaffReviewCounts]);

  return <div className="min-h-screen bg-[#f7f8f5] text-slate-800">
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-[#102b23] text-white">
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-7">
        <a href={home} className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white"><img src="/icons/agrisystem-icon.svg" alt="AgriSystem MAO logo" className="h-full w-full"/></span>
          <span className="min-w-0"><span className="flex items-center gap-2"><span className="block truncate text-lg font-extrabold tracking-tight">AgriSystem</span><span className="hidden rounded-full border border-lime-200/40 bg-lime-300/15 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[.12em] text-lime-100 sm:inline">MAO Services</span></span><span className="block truncate text-[10px] font-bold uppercase tracking-[.16em] text-emerald-100">Bongabong Municipal Agriculture Office</span></span>
        </a>
        <button onClick={onLogout} className="shrink-0 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-bold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-lime-300">Sign out</button>
      </div>
    </header>

    <div className="mx-auto grid w-full max-w-[1600px] lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="border-b border-slate-200/80 bg-white/85 shadow-sm backdrop-blur lg:sticky lg:top-[72px] lg:self-start lg:border-b-0 lg:border-r lg:border-slate-200/80 lg:shadow-none">
        <nav aria-label={isFarmer ? "Farmer portal navigation" : "MAO Staff navigation"} className="p-3 lg:p-4">
          <div className="hidden border-b border-slate-200 px-3 py-4 lg:block">
            <p className="text-[10px] font-bold uppercase tracking-[.12em] text-emerald-800">{isFarmer ? "Farmer portal" : "MAO Staff workspace"}</p>
            <p className="mt-2 text-xs leading-5 text-slate-600">{isFarmer ? "Manage land records, crop reports, weather, and service updates." : isAdmin ? "Keep people, records, and MAO operations organized and secure." : "Review reports, registrations, and farmer communication."}</p>
          </div>

          <div className="flex flex-wrap gap-1.5 lg:mt-3 lg:flex-col">
            {links.map((link, index) => <div key={link.href} className={`shrink-0 ${link.group ? "lg:mt-3" : ""}`}>
              {link.group && <p className={`hidden px-3 pb-1 text-[10px] font-extrabold uppercase tracking-[.14em] text-slate-400 lg:block ${index === 0 ? "lg:mt-0" : ""}`}>{link.group}</p>}
              {(() => { const reviewCount = link.href === "#review" ? staffReviewCounts.reports : link.href === "#registrations" ? staffReviewCounts.registrations : 0; const badgeCount = link.href === "#notifications" ? unreadNotifications : reviewCount; const badgeLabel = link.href === "#review" ? "reports awaiting MAO review" : link.href === "#registrations" ? "farmer registrations awaiting MAO review" : "unread notifications"; return <a href={link.href} className={`group flex items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${activeHash === link.href ? "bg-emerald-800 text-white" : "border border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-emerald-900"}`}>
                <span className={`flex w-11 justify-center rounded-md px-1 py-1 text-[9px] font-extrabold uppercase tracking-wide ${activeHash === link.href ? "bg-white/15" : "bg-slate-100 text-slate-400 group-hover:bg-white"}`}>{link.tag}</span>
                <span>{link.label}</span>{badgeCount > 0 && <span aria-label={`${badgeCount} ${badgeLabel}`} className={`ml-auto flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${activeHash === link.href ? "bg-lime-300 text-emerald-950" : "bg-red-500 text-white"}`}>{badgeCount > 99 ? "99+" : badgeCount}</span>}
              </a>; })()}
            </div>)}
          </div>

        </nav>
      </aside>

      <main className="min-w-0 px-4 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
        <div className={`mx-auto w-full ${isFarmer ? "max-w-[1120px]" : "max-w-[1320px]"}`}>{children}</div>
      </main>
    </div>
  </div>;
}
