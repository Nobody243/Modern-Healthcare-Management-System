import { TableLoadingSkeleton } from '@/components/ui/portal-loading-skeleton';

export default function DoctorLoading() {
  return (
    <TableLoadingSkeleton
      title="Physician Clinical Workspace // Loading Telemetry..."
      subtitle="Synchronizing electronic health records, prescriptions & lab panels"
    />
  );
}
