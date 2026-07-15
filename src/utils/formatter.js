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
// src/utils/formatter.js

/**
 * Format a number as PKR currency
 * @param {number|string} amount - The amount to format
 * @param {string} currency - Currency code (default 'PKR')
 * @param {string} locale - Locale string (default 'en-PK')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'PKR', locale = 'en-PK') => {
  if (amount === null || amount === undefined || isNaN(amount)) return '—';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Format a number with commas
 * @param {number} num - The number to format
 * @returns {string} Formatted number with commas
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '—';
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format a date to a readable string
 * @param {string|Date} date - The date to format
 * @param {string} locale - Locale string (default 'en-US')
 * @returns {string} Formatted date string
*/
export const formatDate = (date, locale = 'en-US') => {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};