import { Loader2 } from "lucide-react";

/**
 * Reusable Loading Spinner with admin theme color.
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
 * @param {string} color - CSS color value (default: admin primary)
 * @param {string} className - additional classes
 */
export default function LoadingSpinner({ 
  size = "md", 
  color = "var(--color-admin-primary)", 
  className = "" 
}) {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };
  const pixelSize = sizeMap[size] || 24;

  return (
     <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-admin-primary)]" />
      </div>
  );
}