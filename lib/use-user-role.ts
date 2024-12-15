import getUserById from '@/app/dashboard/action/get-user-by-id';
import { Role } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function useUserRole() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [role, setRole] = useState<Role>('CUSTOMER');

  useEffect(() => {
    if (!user) return;

    const id = user.id;

    const fetchUserRole = async () => {
      const response = await getUserById(id);
      if (response.success && response.data) {
        setRole(response.data.Role);
      } else {
        setRole('CUSTOMER');
      }
    };

    if (id) {
      fetchUserRole();
    }
  }, [user]);

  return role;
}
