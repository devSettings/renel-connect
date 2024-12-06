interface Props {
  heading: string;
  description: string;
}

const EmptyTable = ({ heading, description }: Props) => {
  return (
    <div className='border border-dashed bg-card h-[21rem] flex flex-col gap-8 items-center justify-center rounded-lg'>
      <div className='flex flex-col items-center justify-center text-center gap-y-3'>
        <h2 className='font-black text-4xl text-destructive'>{heading}</h2>
        <p className='text-muted-foreground'>{description}</p>
      </div>
    </div>
  );
};

export default EmptyTable;
