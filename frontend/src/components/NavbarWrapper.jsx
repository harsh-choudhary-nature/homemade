// app/components/NavbarWrapper.jsx (Server Component)
import delay from '@/lib/delay';
import Navbar from './Navbar';
import { getUserFromRequest } from '@/lib/auth';

export default async function NavbarWrapper() {
  await delay(1500);
  const user = await getUserFromRequest();
  return <Navbar user={user} />;
}
