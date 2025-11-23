export const executiveDashboardMock = {
  welcomeName: "Pedro Heilbron",
  title: "Chief Executive Officer",
  airline: "Copa Airlines",
  stats: [
    { label: "Total Employees", value: "18,245", trend: "+2.3% MoM" },
    { label: "Departments", value: "126", trend: "+4 new" },
    { label: "Open Positions", value: "32", trend: "11 in flight ops" },
    { label: "Recent Hires (30d)", value: "48", trend: "+6 exec" },
  ],
  orgHealth: [
    { label: "Average Tenure", value: "7.4 yrs" },
    { label: "Turnover (12m)", value: "6.1%", variant: "warning" },
    { label: "Upcoming Anniversaries", value: "18 this week" },
  ],
  quickActions: [
    { label: "View Org Chart", description: "Visualize reporting chains", href: "/org-chart" },
    { label: "Pending Approvals", description: "12 awaiting your review", href: "/hr/time-off" },
    { label: "Strategic Reports", description: "Fleet & financial KPIs", href: "/dashboard/executive/strategic-metrics" },
  ],
  activity: [
    { title: "Promotion", description: "Julio Gutiérrez promoted CIO → Group CIO", timestamp: "2h ago" },
    { title: "New Hire", description: "Mariana Ruiz joined as VP Ground Ops", timestamp: "6h ago" },
    { title: "Dept Change", description: "Cabin Services reorganized under COO", timestamp: "1d ago" },
  ],
};

export const operationsDashboardMock = {
  welcomeName: "Ana Castillo",
  title: "VP Flight Operations",
  crewOnDuty: 482,
  crewAvailable: 126,
  schedules: [
    { label: "Next 6h", flights: 58, coverage: 96 },
    { label: "6h-12h", flights: 73, coverage: 92 },
    { label: "12h-24h", flights: 141, coverage: 89 },
  ],
  quickActions: [
    { label: "Crew Scheduler", description: "Realtime rostering view", href: "/dashboard/operations/crew-scheduling" },
    { label: "Manage Time Off", description: "Approve 8 pending PTO", href: "/hr/time-off" },
    { label: "Operations Reports", description: "IRROPS & OTP trends", href: "/dashboard/operations/fleet-status" },
  ],
  teamSpotlight: [
    { name: "Base PTY", status: "Crewed", percentage: 98 },
    { name: "Base MIA", status: "Crewed", percentage: 93 },
    { name: "Base LAX", status: "Alert", percentage: 87 },
  ],
};

export const crewDashboardMock = {
  welcomeName: "Captain Valeria Gómez",
  base: "PTY",
  role: "B737 Captain",
  nextFlight: {
    route: "CM305 PTY → LAX",
    departure: "Today · 16:10",
    gate: "A18",
  },
  ptoBalance: "11.5 days",
  training: {
    name: "Recurrent SIM",
    dueDate: "Jan 12",
  },
  quickActions: [
    { label: "View My Schedule", href: "/dashboard/crew/my-schedule" },
    { label: "Request Time Off", href: "/dashboard/crew/time-off" },
    { label: "Update Profile", href: "/employees/me" },
    { label: "View Pay Stubs", href: "/dashboard/crew/pay-stubs" },
  ],
  news: [
    { title: "New PTY crew lounge", date: "Dec 12" },
    { title: "Bid period opens Jan 2", date: "Dec 10" },
    { title: "Wellness stipend update", date: "Dec 8" },
  ],
};

export const adminDashboardMock = {
  systemHealth: [
    { label: "Active Users", value: "4,812", change: "+3.2%" },
    { label: "Failed Logins (24h)", value: "18", change: "-5 vs avg", variant: "warning" },
    { label: "API Usage", value: "62.4k req", change: "+8%" },
  ],
  quickActions: [
    { label: "Manage Users", href: "/admin/roles", description: "Invite, deactivate, assign RBAC" },
    { label: "Audit Logs", href: "/admin/audit", description: "Review 220 events in last hour" },
    { label: "Configure Airlines", href: "/admin/airlines", description: "Branding + domain controls" },
    { label: "API Keys", href: "/admin/settings", description: "Rotate integrations" },
  ],
  alerts: [
    { title: "Sentry", description: "No critical errors detected", severity: "info" },
    { title: "Rate Limiting", description: "Crew OS at 72% of quota", severity: "warning" },
  ],
};
