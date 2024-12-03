import { Fragment } from 'react';

import { Product } from '../types/product';
import ProductCard from './product-card';

interface Props {
  products: Product[];
}

const ProductGrid = ({ products }: Props) => {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-4 gap-4'>
      {products.map((product) => (
        <Fragment key={product.id}>
          <ProductCard product={product} />
        </Fragment>
      ))}
    </div>
  );
};

export default ProductGrid;
