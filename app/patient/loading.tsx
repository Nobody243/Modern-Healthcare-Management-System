import { TableLoadingSkeleton } from '@/components/ui/portal-loading-skeleton';

export default function PatientLoading() {
  return (
    <TableLoadingSkeleton
      title="Patient Health Portal // Loading Medical Profile..."
      subtitle="Fetching prescriptions, vital signs & diagnostic history"
    />
  );
}
