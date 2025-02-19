'use client';

import requestReturn from '@/app/dashboard/(management)/returns/action';
import {
  returnFormData,
  returnschema,
} from '@/app/dashboard/(management)/returns/schema';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, LoaderPinwheel, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
interface Props {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderReturnRequest({ isOpen, onClose, id }: Props) {
  const form = useForm<returnFormData>({
    resolver: zodResolver(returnschema),
    defaultValues: {
      reference: id,
    },
  });

  const handleRequest = async (data: returnFormData) => {
    const reponse = await requestReturn({
      reference: data.reference,
      reason: data.reason,
    });

    if (!reponse.success) {
      toast.error(reponse.error as string);
      return;
    }

    onClose();
    toast.success(reponse.message);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className='sm:max-w-[400px] p-2 bg-muted/20'>
        <Card>
          <CardHeader>
            <CardTitle>Demander un remboursement</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleRequest)}>
                <div className='grid w-full items-center gap-4'>
                  <FormField
                    control={form.control}
                    name='reason'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder=''
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='mt-6 justify-end flex items-center gap-2'>
                  <Button
                    variant='secondary'
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={form.formState.isSubmitting}
                    className='bg-blue-700 hover:bg-blue-800 text-white'
                  >
                    {form.formState.isSubmitting ? (
                      <Loader2Icon className='animate-spin' />
                    ) : (
                      <Send />
                    )}
                    Request
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
