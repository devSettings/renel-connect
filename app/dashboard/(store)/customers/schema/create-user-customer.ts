import {
  AcceptedTypeOfID,
  Gender,
  Language,
  Membership,
  UserStatus,
} from '@prisma/client';
import { z } from 'zod';

const phoneNumberRegex = /^(?:\d{10}|\d{11})$/;

const createUserCustomerSchema = z
  .object({
    firstName: z
      .string({ required_error: 'First name is required' })
      .min(3, { message: 'First name must be at least 3 characters' })
      .max(50, { message: 'First name cannot be more than 50 characters' }),
    lastName: z
      .string({ required_error: 'Last name is required' })
      .min(3, { message: 'Last name must be at least 3 characters' })
      .max(50, { message: 'Last name cannot be more than 50 characters' }),
    email: z
      .string()
      .email('Invalid email address')
      .optional()
      .or(z.literal('')),
    birthDate: z
      .date({ invalid_type_error: 'Please provide a proper date' })
      .refine(
        (date) => {
          const today = new Date();
          const eighteenYearsAgo = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate()
          );
          return date <= eighteenYearsAgo;
        },
        { message: 'User must be at least 18 years old' }
      )
      .optional(),
    gender: z.nativeEnum(Gender, {
      errorMap: () => ({
        message: 'Please select a valid gender',
      }),
    }),
    preferredLanguage: z
      .nativeEnum(Language, {
        errorMap: () => ({
          message: 'Please select a valid language',
        }),
      })
      .optional(),
    typeOfId: z.nativeEnum(AcceptedTypeOfID).optional(),
    idNumber: z.string().optional(),
    status: z
      .nativeEnum(UserStatus, {
        errorMap: () => ({
          message: 'Status must be one of ACTIVE, INACTIVE, SUSPENDED, BANNED',
        }),
      })
      .optional(),
    phoneNumber: z.string().regex(phoneNumberRegex, {
      message: 'Invalid phone number. Enter 10 or 11 digits only.',
    }),
    membership: z
      .nativeEnum(Membership, {
        errorMap: () => ({
          message: 'Please select a valid membership',
        }),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.typeOfId && !data.idNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ID number is required when ID type is selected',
        path: ['idNumber'],
      });
    }
    if (data.idNumber && !data.typeOfId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ID type is required when ID number is provided',
        path: ['typeOfId'],
      });
    }
  });

export default createUserCustomerSchema;
