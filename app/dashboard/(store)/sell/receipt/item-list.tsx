export type Item = {
  name: string;
  quantity: number;
  sellingPrice: number;
  totalCost: number;
};

interface Props {
  data: Item[];
}

const ItemsList = ({ data }: Props) => {
  return (
    <div className='space-y-2 mb-4'>
      <div className='flex justify-between text-xs font-medium'>
        <span className='w-1/4'>Product</span>
        <span className='w-1/4 text-right'>Price</span>
        <span className='w-1/4 text-center'>Qty</span>
        <span className='w-1/4 text-right'>Total</span>
      </div>
      {data.map((product, index) => (
        <div key={index} className='flex justify-between text-xs'>
          <span className='w-1/4'>{product.name}</span>
          <span className='w-1/4 text-right'>
            {product.sellingPrice.toLocaleString('fr-FR')}
          </span>
          <span className='w-1/4 text-center'>{product.quantity}</span>
          <span className='w-1/4 text-right'>
            {product.totalCost.toLocaleString('fr-FR')}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ItemsList;
