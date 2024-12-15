'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { Role } from '@prisma/client';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  Role: Role;
}

const getUserById = async (id: string): Promise<ActionResponse<User>> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        Role: true,
      },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error as string };
  }
};

export default getUserById;
