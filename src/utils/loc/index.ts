import en from './en';

/**
 * Get localized string
 * @param {string} key
 * @param {Object.<string, string>} args
 * @returns {string}
 */
export function t(key: string, args: Record<string, string> = {}) {
  let result = en[key] ?? key;
  if (args) {
    Object.entries(args).forEach(([argKey, argValue]) => {
      result = result.replaceAll(`{{${argKey}}}`, argValue);
    });
  }

  return result;
}
