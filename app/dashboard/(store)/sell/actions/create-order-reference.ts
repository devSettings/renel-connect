'use server';

import prisma from '@/prisma/client';

const SaleReference = async () => {
  const generateRandomReference = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let reference = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      reference += characters[randomIndex];
    }
    return reference;
  };

  let referenceNumber;
  let isUnique = false;

  while (!isUnique) {
    referenceNumber = generateRandomReference();
    try {
      const existingReferences = await prisma.sale.findMany({
        where: { reference: referenceNumber },
        select: { reference: true },
      });
      isUnique = existingReferences.length === 0; // Check if the reference is unique
    } catch (error) {
      console.error('Error fetching sale references:', error);
      throw new Error('Could not verify reference uniqueness');
    }
  }

  return referenceNumber;
};

export default SaleReference;
