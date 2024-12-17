import Search from '@/components/search';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Suspense } from 'react';
import getCustomerGenderMetrics from './actions/get-customer-gender-metrics';
import getCustomerMembershipMetrics from './actions/get-customer-membership-metrics';
import getCustomerStatusMetrics from './actions/get-customer-status-metrics';
import getCustomers from './actions/get-customers';
import CreateCustomerDialog from './components/create-customer-dialog';
import { CustomerGenderMetrics } from './components/customer-gender-metrics';
import CustomerList from './components/customer-list';
import ProductMemberFilter from './components/customer-membership-filter';
import { CustomerMembershipMetrics } from './components/customer-membership-metrics';
import CustomerStatusFilter from './components/customer-status-filter';
import { CustomerStatusMetrics } from './components/customer-status-metrics';
import CustomersTable from './components/customers-table';
import { Membership, UserStatus } from '@prisma/client';

interface Props {
  searchParams: Promise<{
    status: UserStatus;
    membership: Membership;
    searchQuery: string;
    page: string;
  }>;
}

const CustomersPage = async ({ searchParams }: Props) => {
  const search = (await searchParams).searchQuery;

  let selectedStatus: UserStatus[] = [];
  const status = (await searchParams).status;
  if (status && Object.values(UserStatus).includes(status)) {
    selectedStatus = [status];
  }
  let selectedMembership: Membership[] = [];

  const membership = (await searchParams).membership;
  if (membership && Object.values(Membership).includes(membership)) {
    selectedMembership = [membership];
  }

  let currentPage = 1;
  const page = (await searchParams).page;

  if (page) {
    const parsedPage = parseInt(page);
    if (!isNaN(parsedPage) && parsedPage > 0) {
      currentPage = parsedPage;
    }
  }

  const response = await getCustomers({ search: search });
  if (!response.success) return null;
  const customers = response.data;
  const statusResponse = await getCustomerStatusMetrics();
  if (!statusResponse.success) return null;

  const genderResponse = await getCustomerGenderMetrics();

  if (!genderResponse.success) return null;

  const membershipResponse = await getCustomerMembershipMetrics();

  if (!membershipResponse.success) return null;

  return (
    <div className='space-y-8'>
      <div className='grid grid-cols-3 gap-4'>
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
                <Search className='bg-black' />
              </Suspense>

              <Suspense fallback={'loading..'}>
                <CustomerStatusFilter />
              </Suspense>

              <Suspense fallback={'loading...'}>
                <ProductMemberFilter />
              </Suspense>
            </div>
            <CreateCustomerDialog />
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
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersPage;
