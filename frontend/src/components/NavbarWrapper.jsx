// app/components/NavbarWrapper.jsx (Server Component)
import Navbar from './Navbar';
import { getUserFromRequest } from '@/lib/auth';

export default async function NavbarWrapper() {
  const user = await getUserFromRequest();
  return <Navbar user={user} />;
}
