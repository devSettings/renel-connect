'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import createSupplier from '../actions/create-supplier';
import {
  CreateProductSupplierFormData,
  createProductSupplierFormSchema,
} from '../schema/create-product-supplier';

interface Props {
  upOnSubmitting: () => void;
}

export default function CreateProductSupplierForm({ upOnSubmitting }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<CreateProductSupplierFormData>({
    resolver: zodResolver(createProductSupplierFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      products: '',
    },
  });

  async function onSubmit(values: CreateProductSupplierFormData) {
    setIsSubmitting(true);

    const result = await createSupplier(values);
    if (!result.success) {
      toast.error(result.message);
      setIsSubmitting(false);
    }

    if (result.success) {
      toast.success('Supplier created successfully');
      setIsSubmitting(false);
      upOnSubmitting();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 p-4'>
        <div className='grid grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du fournisseur</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Entrez le nom du fournisseur'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder={`Entrez l'adresse e-mail`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='grid  grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de téléphone</FormLabel>
                <FormControl>
                  <Input
                    type='tel'
                    placeholder='Entrez le numéro de téléphone'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='address'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse du fournisseur</FormLabel>
                <FormControl>
                  <Input
                    placeholder={`Entrez l'adresse du fournisseur`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='products'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Produits fournis</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Entrez les produits (séparés par des virgules)'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Veuillez indiquer les produits fournis, séparés par des
                virgules.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          size={'lg'}
          type='submit'
          className='w-full h-10 font-normal bg-blue-700 text-white hover:bg-blue-800'
        >
          {isSubmitting ? (
            <span className='flex items-center gap-1'>
              <Loader className='animate-spin' />
              Soumission des informations sur le fournisseur
            </span>
          ) : (
            'Soumettre les informations du fournisseur'
          )}
        </Button>
      </form>
    </Form>
  );
}
