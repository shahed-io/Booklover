interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | undefined;

  className?: string | undefined;

}

const BrandLogo = ({ size = 'md', className = '' }: BrandLogoProps) => {
  const dimensions = size === 'sm'
    ? 'h-12 w-[55px]'
    : size === 'lg'
      ? 'h-24 w-[109px]'
      : 'h-14 w-[64px]';

  return (
    <div className={`flex items-center flex-shrink-0 ${className}`}>
      <img
        src="/logo.png"
        alt="Booklover"
        className={`${dimensions} object-contain select-none`}
      />
    </div>
  );
};

export default BrandLogo;
