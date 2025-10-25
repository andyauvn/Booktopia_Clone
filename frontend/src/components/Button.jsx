
// --- Reusable Button Component ---
/**
 * A reusable button component with pre-defined color and size variants.
 * It accepts an optional className to add or override default styles.
 *
 * @param {object} props - Component props
 * @param {'red' | 'green' | 'blue' | 'yellow' | 'gray'} props.color - The color scheme (defaults to 'blue').
 * @param {'sm' | 'md' | 'lg'} props.size - The size variant (defaults to 'md')
 * @param {string} [props.className] - Custom Tailwind classes to apply (will override default styles)
 * @param {boolean} [props.disabled] - Standard HTML disabled attribute
 * @param {React.ReactNode} props.children - The button content
 */
const Button = ({ children, color = 'blue', size = 'md', className = '', disabled = false, ...props }) => {
  
  // 1. Color Mapping (Red is now correctly included)
  const colorMap = {
    red: "bg-red-600 hover:bg-red-700 text-white active:bg-red-800",
    green: "bg-green-600 hover:bg-green-700 text-white active:bg-green-800",
    blue: "bg-blue-600 hover:bg-blue-700 text-white active:bg-blue-800",
    yellow: "bg-yellow-500 hover:bg-yellow-600 text-gray-900 active:bg-yellow-700",
    gray: "bg-gray-500 hover:bg-gray-600 text-white active:bg-gray-700",
  };

  // 2. Size Mapping
  const sizeMap = {
    sm: "px-3 py-1.5 text-sm", // Small
    md: "px-5 py-2.5 text-base", // Medium (Default)
    lg: "px-6 py-3 text-lg", // Large
  };

  // 3. Base Styles (Includes disabled state styles)
  // disabled:hover:bg-current prevents the hover effect from changing the disabled button's color
  const baseClasses =
    "cursor-pointer font-medium rounded-xl transition duration-150 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 inline-flex items-center justify-center " +
    "disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-current";

  // Get selected styles. Fallback to 'blue' if an invalid color is passed.
  const selectedColorClasses = colorMap[color] || colorMap['blue'];
  const selectedSizeClasses = sizeMap[size] || sizeMap['md'];
  
  // // Merge focus ring color from the background color
  // let ringColorClass = '';
  // switch (color) {
  //     case 'red': ringColorClass = 'focus:ring-red-300'; break;
  //     case 'green': ringColorClass = 'focus:ring-green-300'; break;
  //     case 'blue': ringColorClass = 'focus:ring-blue-300'; break;
  //     case 'yellow': ringColorClass = 'focus:ring-yellow-300'; break;
  //     case 'gray': ringColorClass = 'focus:ring-gray-300'; break;
  //     default: ringColorClass = 'focus:ring-blue-300'; break;
  // }
  
  // 4. Combine all classes. Custom className is placed LAST to ensure it overrides defaults.
  const finalClasses = `${baseClasses} ${selectedColorClasses} ${selectedSizeClasses}  ${className}`;

  return (
    <button className={finalClasses} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;

