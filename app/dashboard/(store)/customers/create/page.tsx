import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreateUserCustomerForm } from './create-customer-form';

const CreateCustomer = () => {
  return (
    <ScrollArea className='h-[83vh]'>
      <Card className='bg-[#0a0a0a]'>
        <CardContent className='mt-4'>
          <CreateUserCustomerForm />
        </CardContent>
      </Card>
    </ScrollArea>
  );
};

export default CreateCustomer;
