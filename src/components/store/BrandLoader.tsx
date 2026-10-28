const BrandLoader = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | undefined; className?: string | undefined }) => {
  const w = { sm: 90, md: 150, lg: 190 }[size];
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img src="/logo-loader.png" alt="Booklover" width={w} style={{ width: w, height: 'auto', animation: 'bl-breathe 1.4s ease-in-out infinite' }} />
      <style>{`@keyframes bl-breathe{0%,100%{opacity:.75;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}`}</style>
    </div>
  );
};

export default BrandLoader;
