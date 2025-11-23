import { adminDashboardMock } from "@/lib/data/mockDashboardData";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AdminSystemHealth } from "@/components/dashboard/AdminSystemHealth";

export default function AdminDashboardPage() {
  const data = adminDashboardMock;

  return (
    <div className="space-y-8">
      <AdminSystemHealth metrics={data.systemHealth} alerts={data.alerts} />
      <QuickActions title="Control center" actions={data.quickActions} />
    </div>
  );
}
