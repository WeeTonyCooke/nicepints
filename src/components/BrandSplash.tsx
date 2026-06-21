import BrandWordmark from './BrandWordmark';
import PintSilhouetteIcon from './PintSilhouetteIcon';

type BrandSplashProps = {
  message?: string;
  className?: string;
  iconClassName?: string;
};

const BrandSplash = ({
  message,
  className = '',
  iconClassName = 'w-[72px] h-[115px]',
}: BrandSplashProps) => (
  <div className={`flex flex-col items-center text-center ${className}`.trim()}>
    <PintSilhouetteIcon className={`${iconClassName} mb-4`} />
    <BrandWordmark size="display" showIcon={false} className="justify-center" />
    {message && <p className="text-muted text-base mt-4">{message}</p>}
  </div>
);

export default BrandSplash;
