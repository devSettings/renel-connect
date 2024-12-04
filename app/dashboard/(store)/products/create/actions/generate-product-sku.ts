'use server';

import prisma from '@/prisma/client';

const generateProductSku = async () => {
  const generateRandomReference = () => {
    const characters = '0123456789';
    let reference = '';
    for (let i = 0; i < 10; i++) {
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
      const existingReferences = await prisma.product.findMany({
        where: { sku: referenceNumber },
        select: { sku: true },
      });
      isUnique = existingReferences.length === 0;
    } catch (error) {
      console.error('Error fetching sale references:', error);
      throw new Error('Could not verify reference uniqueness');
    }
  }

  return referenceNumber;
};

export default generateProductSku;
