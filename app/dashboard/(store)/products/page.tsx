import Search from '@/components/search';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Suspense } from 'react';
import getProductDepartmentMetrics from './actions/get-product-department-metrics';
import getProductStatusMetrics from './actions/get-product-status-metrics';
import getProductTypeMetrics from './actions/get-product-type-metrics';
import getProducts from './actions/get-products';
import ProductCategoryFilter from './components/product-category-filter';
import { ProductDepartmentMetrics } from './components/product-department-metrics';
import ProductStatusFilter from './components/product-status-filter';
import { ProductStatusMetrics } from './components/product-status-matrix';
import ProductTypeFilter from './components/product-type-filter';
import { ProductTypeMetrics } from './components/product-type-matrics';
import ProductsTable from './components/products-table';
import CreateProductFormDialog from './create/components/create-product-form-dialog';

const ProductPage = async () => {
  const [products, types, statues, departments] = await Promise.all([
    getProducts(),
    getProductTypeMetrics(),
    getProductStatusMetrics(),
    getProductDepartmentMetrics(),
  ]);

  if (!products.success) return null;
  if (!types.success) return null;
  if (!statues.success) return null;
  if (!departments.success) return null;

  return (
    <div className='space-y-8'>
      <div className='grid grid-cols-3 gap-4'>
        <ProductStatusMetrics
          draft={statues.data.draft}
          active={statues.data.active}
          inactive={statues.data.inactive}
          archived={statues.data.archived}
        />
        <ProductTypeMetrics
          inventory={types.data.inventory}
          service={types.data.service}
          nonInventory={types.data.non_inventory}
          digital={types.data.digital}
        />
        {/* <ProductDepartmentMetrics
          room={departments.data.room}
          drink={departments.data.drink}
          food={departments.data.food}
          other={departments.data.other}
        /> */}
      </div>

      <Card className='shadow-none  flex-1 overflow-hidden border-[0.1px]'>
        <CardHeader>
          <div className='flex items-center gap-2 justify-between'>
            <div className='flex items-center gap-4'>
              <Suspense fallback={<div>Loading search...</div>}>
                <Search className='bg-black' />
              </Suspense>
              <Suspense fallback={'Matrics Loading....'}>
                <ProductCategoryFilter />
                <ProductStatusFilter />
                <ProductTypeFilter />
              </Suspense>
            </div>
            <CreateProductFormDialog />
          </div>
        </CardHeader>
        <CardContent>
          <div className='hidden lg:block'>
            <Suspense fallback='Table Loading...'>
              <ProductsTable
                products={products.data}
                totalPages={1}
                currentPage={1}
                itemsPerPage={1}
              />
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductPage;
