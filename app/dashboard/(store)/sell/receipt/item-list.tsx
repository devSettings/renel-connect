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
      <div className='flex justify-between text-xs font-medium text-gray-900'>
        <span className='w-2/3'>Service/Produit</span>
        <span className='w-1/3 text-right'>Prix</span>
      </div>
      {data.map((product, index) => (
        <div key={index} className='flex justify-between text-xs text-gray-900'>
          <span className='w-2/3'>
            {product.name} x{product.quantity}
          </span>
          <span className='w-1/3 text-right'>
            {(product.sellingPrice * product.quantity).toLocaleString('fr-FR')}{' '}
            G
          </span>
        </div>
      ))}
    </div>
  );
};

export default ItemsList;
