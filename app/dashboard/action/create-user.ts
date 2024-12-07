'use server';

import prisma from '@/prisma/client';
import { currentUser } from '@clerk/nextjs/server';

const createUser = async () => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        fullNameSlug: `${user.firstName}-${user.lastName}`.toLowerCase(),
      },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: user.id,
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          fullNameSlug:
            `${user.firstName}-${user.lastName}`.toLowerCase() ?? '',
          gender: 'MALE',
          Role: 'UNKNOWN',
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export default createUser;
