import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CircleHelp } from 'lucide-react';

const BarCodeTooltip = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <CircleHelp className='w-3.5 h-3.5 cursor-pointer text-blue-600' />
        </TooltipTrigger>
        <TooltipContent className='bg-black w-[20rem] border'>
          <p className='text-xs text-white font-medium'>
            Le code à barres est facultatif, par conséquent, un code à barres
            sera généré si le champ est laissé vide
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BarCodeTooltip;
