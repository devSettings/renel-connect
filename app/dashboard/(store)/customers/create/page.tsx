import { Card, CardContent } from '@/components/ui/card';
import { CreateUserCustomerForm } from './create-customer-form';

const CreateCustomer = () => {
  return (
    <Card className='border-[0.1px] bg-[#0a0a0a] max-w-[60rem] mx-auto px-8'>
      <CardContent className='mt  mt-10  rounded-md'>
        <CreateUserCustomerForm />
      </CardContent>
    </Card>
  );
};

export default CreateCustomer;
