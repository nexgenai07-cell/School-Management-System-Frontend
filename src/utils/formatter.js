export function formatCNIC(value) {
  // Sirf digits rakhein
  const digits = value.replace(/\D/g, '');
  // Limit to 13 digits
  const trimmed = digits.slice(0, 13);
  
  // Dashes insert karein
  let formatted = trimmed;
  if (trimmed.length > 4) {
    formatted = trimmed.slice(0, 5) + '-' + trimmed.slice(5);
  }
  if (trimmed.length > 12) {
    formatted = formatted.slice(0, 13) + '-' + formatted.slice(13);
  }
  return formatted;
}