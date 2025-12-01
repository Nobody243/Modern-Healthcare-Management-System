import { TableLoadingSkeleton } from '@/components/ui/portal-loading-skeleton';

export default function AdminLoading() {
  return (
    <TableLoadingSkeleton
      title="HMS Admin // System Directory Loading..."
      subtitle="Streaming Oracle 19c Enterprise relational records"
    />
  );
}
