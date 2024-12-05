'use server';

import prisma from '@/prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { revalidatePath } from 'next/cache';
import {
  CreateProductSupplierFormData,
  createProductSupplierFormSchema,
} from '../schema/create-product-supplier';

// Utility function to create a slug
const generateSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

const createSupplier = async (supplierData: CreateProductSupplierFormData) => {
  // Validate the form data
  const result = createProductSupplierFormSchema.safeParse(supplierData);
  if (!result.success) {
    // Collect all error messages
    const errors = result.error.errors.map((err) => err.message).join(', ');
    return { success: false, message: errors };
  }

  try {
    // Check for existing supplier by name, email, or phone
    const existingSupplier = await prisma.supplier.findFirst({
      where: {
        OR: [
          { slug: generateSlug(supplierData.name) },
          { email: supplierData.email },
          { phone: supplierData.phone },
        ],
      },
      select: { email: true, phone: true, slug: true },
    });

    if (existingSupplier) {
      let errorField = '';
      if (existingSupplier.slug === generateSlug(supplierData.name)) {
        errorField = 'nom';
      } else if (existingSupplier.email === supplierData.email) {
        errorField = 'email';
      } else if (existingSupplier.phone === supplierData.phone) {
        errorField = 'Numéro de téléphone';
      }
      return {
        success: false,
        message: `Le ${errorField} du fournisseur existe déjà.`,
      };
    }

    // Create new supplier
    const newSupplier = await prisma.supplier.create({
      data: {
        name: supplierData.name,
        email: supplierData.email,
        phone: supplierData.phone,
        address: supplierData.address,
        slug: generateSlug(supplierData.name),
        product_supplied: supplierData.products,
      },
    });
    revalidatePath('/suppliers');
    return { success: true, data: newSupplier };
  } catch (error: unknown) {
    return {
      success: false,
      message: `Failed to create supplier: ${
        (error as PrismaClientKnownRequestError).message
      }`,
    };
  }
};

export default createSupplier;
