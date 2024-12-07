interface Props {
  transactionId: string;
}

const BarCode = ({ transactionId }: Props) => {
  return (
    <div className='flex flex-col items-center mt-4'>
      <div className='bg-white'>
        <svg className='h-8' viewBox='0 0 100 30'>
          {[...Array(20)].map((_, i) => (
            <rect
              key={i}
              x={i * 5}
              y='0'
              width={(Math.random() * 2 + 1).toFixed(2)}
              height='30'
              fill='#000'
            />
          ))}
        </svg>
      </div>
      <p className='text-center text-[10px] text-gray-400 mt-1'>
        {transactionId}
      </p>
    </div>
  );
};

export default BarCode;
