export type Item = {
  name: string;
  quantity: number;
  price: number;
  total: number;
};

interface Props {
  data: Item[];
}

const ItemsList = ({ data }: Props) => {
  return (
    <div className='space-y-2 mb-4'>
      <div className='flex justify-between text-xs font-medium'>
        <span className='w-2/4'>Product</span>
        <span className='w-1/6 text-center'>Qty</span>
        <span className='w-1/6 text-right'>Price</span>
        <span className='w-1/6 text-right'>Total</span>
      </div>
      {data.map((product, index) => (
        <div className='flex justify-between text-xs'>
          <span className='w-2/4'>{product.name}</span>
          <span className='w-1/6 text-center'>{product.quantity}</span>
          <span className='w-1/6 text-right'>
            {product.price.toLocaleString('fr-FR')}
          </span>
          <span className='w-1/6 text-right'>
            {product.total.toLocaleString('fr-FR')}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ItemsList;
