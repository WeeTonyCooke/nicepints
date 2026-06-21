type PintSilhouetteIconProps = {
  className?: string;
};

const PintSilhouetteIcon = ({ className = 'w-6 h-[38px]' }: PintSilhouetteIconProps) => (
  <img
    src="/brand/pint-silhouette.svg"
    alt=""
    aria-hidden="true"
    className={`shrink-0 object-contain ${className}`.trim()}
  />
);

export default PintSilhouetteIcon;
