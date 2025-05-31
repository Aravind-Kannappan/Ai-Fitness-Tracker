import { DumbbellIcon } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo = ({ className = 'h-8 w-8' }: LogoProps) => {
  return (
    <div className={`text-primary-400 ${className}`}>
      <DumbbellIcon />
    </div>
  );
};

export default Logo;