import { Metadata } from 'next';
import AccountsClient from '@/components/admin/accounts-client';

export const metadata: Metadata = {
  title: 'Accounts Management',
  description: 'Manage hospital financial accounts',
};

export default function AccountsPage() {
  return <AccountsClient />;
}
