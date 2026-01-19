import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  icon: Icon,
}) => {
  const baseClasses =
    'relative font-display font-medium rounded-full transition-all duration-300 flex items-center justify-center gap-2 tracking-wide overflow-hidden group';

  const variants = {
    primary:
      'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 border border-transparent',
    secondary:
      'bg-olive-600 hover:bg-olive-700 text-white shadow-lg shadow-olive-600/20 hover:shadow-olive-600/40 border border-transparent',
    outline:
      'bg-transparent border-2 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-white',
    ghost:
      'text-gray-600 dark:text-gray-300 hover:text-gold-500 hover:bg-gold-50 dark:hover:bg-gold-900/10',
    luxury:
      'bg-black text-gold-500 border border-gold-500/30 hover:border-gold-500 hover:bg-gold-500 hover:text-white shadow-xl shadow-gold-900/20',
    danger:
      'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-xs uppercase tracking-wider',
    md: 'px-6 py-2.5 text-sm uppercase tracking-wider',
    lg: 'px-8 py-3.5 text-base uppercase tracking-widest',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02, translateY: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
    >
      {/* Shine effect overlay */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          <span className="relative z-10">{children}</span>
        </>
      )}
    </motion.button>
  );
};

export default Button;
