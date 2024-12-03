import Search from '@/components/search';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Suspense } from 'react';
import MobileFilterDrawer from '../../components/mobile-filter-drawer';
import getCustomerGenderMetrics from './actions/get-customer-gender-metrics';
import getCustomerMembershipMetrics from './actions/get-customer-membership-metrics';
import getCustomerStatusMetrics from './actions/get-customer-status-metrics';
import getCustomers from './actions/get-customers';
import CreateCustomer from './components/create-customer';
import { CustomerGenderMetrics } from './components/customer-gender-metrics';
import CustomerList from './components/customer-list';
import { CustomerMembershipMetrics } from './components/customer-membership-metrics';
import { CustomerStatusMetrics } from './components/customer-status-metrics';
import CustomersTable from './components/customers-table';

const CustomersPage = async () => {
  const response = await getCustomers();
  if (!response.success) return null;
  const customers = response.data;

  const statusResponse = await getCustomerStatusMetrics();
  if (!statusResponse.success) return null;

  const genderResponse = await getCustomerGenderMetrics();

  if (!genderResponse.success) return null;

  const membershipResponse = await getCustomerMembershipMetrics();

  if (!membershipResponse.success) return null;

  console.log(membershipResponse.data);

  return (
    <div className='space-y-8'>
      <div className='grid grid-cols-3 gap-6'>
        <CustomerStatusMetrics
          active={statusResponse.data.active}
          inactive={statusResponse.data.inactive}
          suspended={statusResponse.data.suspended}
          banned={statusResponse.data.banned}
        />
        <CustomerGenderMetrics
          male={genderResponse.data.male}
          female={genderResponse.data.female}
          other={genderResponse.data.other}
        />
        <CustomerMembershipMetrics
          bronze={membershipResponse.data.bronze}
          silver={membershipResponse.data.silver}
          gold={membershipResponse.data.gold}
          platinum={membershipResponse.data.platinum}
        />
      </div>
      <Card className='shadow-none  flex-1 overflow-hidden border-[0.1px] '>
        <CardHeader>
          <div className='flex items-center gap-2 justify-between'>
            <div className='flex items-center gap-4'>
              <Suspense fallback={<div>Loading search...</div>}>
                <Search />
              </Suspense>
              <MobileFilterDrawer />
            </div>
            <CreateCustomer />
          </div>
        </CardHeader>
        <CardContent>
          <div className='block lg:hidden'>
            <CustomerList />
          </div>
          <div className='hidden lg:block'>
            <CustomersTable
              customers={customers}
              totalPages={1}
              currentPage={1}
              itemsPerPage={1}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersPage;
