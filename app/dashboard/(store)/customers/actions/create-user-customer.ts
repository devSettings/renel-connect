'use server';

import formatPhoneNumber from '@/lib/phone-number-formater';
import prisma from '@/prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import createUserCustomerSchema from '../schema/create-user-customer';
import { ActionResponse } from '@/app/types/action-reponse';
import { format } from 'date-fns';

const currentDate = format(new Date(), 'yyyy-MM-dd');

type FormData = z.infer<typeof createUserCustomerSchema>;
async function createUserCustomer(data: FormData): Promise<ActionResponse> {
  const result = createUserCustomerSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.flatten().fieldErrors };
  }

  const {
    firstName,
    lastName,
    email,
    gender,
    birthDate,
    preferredLanguage,
    status,
    membership,
    phoneNumber,
    typeOfId,
    idNumber,
  } = result.data;

  const fullNameSlug = `${firstName.toLowerCase().replace(/ /g, '-')}-${lastName
    .toLowerCase()
    .replace(/ /g, '-')}`;
  const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

  try {
    const [existingUser, existingPhoneNumber, existingId] = await Promise.all([
      prisma.user.findUnique({ where: { fullNameSlug } }),
      prisma.customer.findUnique({
        where: { phoneNumber: formattedPhoneNumber },
      }),
      typeOfId && idNumber
        ? prisma.user.findFirst({
            where: { idProvided: typeOfId },
          })
        : null,
    ]);

    if (existingUser) {
      return {
        success: false,
        error: 'Customer with this name already exists',
      };
    }

    if (existingPhoneNumber) {
      return {
        success: false,
        error: 'Customer with this phone number already exists',
      };
    }

    if (existingId) {
      return { success: false, error: 'Customer with this ID already exists' };
    }

    const userWithCustomer = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: email ? email : null,
        fullNameSlug,
        gender,
        birthDate,
        preferredLanguage,
        idNumber: idNumber,
        idProvided: typeOfId,
        Role: 'CUSTOMER',
        status,
        customer: {
          create: {
            membership,
            phoneNumber: formattedPhoneNumber,
            createdDate: currentDate,
          },
        },
      },
      include: { customer: true },
    });

    revalidatePath('/dashboard/customers');
    return { success: true, data: userWithCustomer };
  } catch (error) {
    console.error('Failed to create user customer:', error);
    return { success: false, error: 'Failed to create user customer' };
  }
}

export default createUserCustomer;
