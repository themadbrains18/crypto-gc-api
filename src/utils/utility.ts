// utility.ts

/**
 * Generates a random integer within a specified range, inclusive.
 * 
 * @param min - The minimum integer value.
 * @param max - The maximum integer value.
 * @returns A random integer between min and max, inclusive.
 */

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Capitalizes the first letter of a string.
 * 
 * @param str - The input string.
 * @returns The input string with the first letter capitalized.
 */
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Checks if a value is an array.
 * 
 * @param value - The value to check.
 * @returns True if the value is an array, otherwise false.
 */
export function isArray(value: any): boolean {
  return Array.isArray(value);
}

/**
 * Determines if a string is in valid JSON format.
 * 
 * @param str - The input string to check.
 * @returns True if the string is valid JSON, otherwise false.
 */
export function isJson(str: any) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * Checks if an object is empty.
 * 
 * @param objectName - The object to check.
 * @returns True if the object has no properties, otherwise false.
 */
export function isObjectEmpty(objectName: object) {
  return (
    objectName &&
    Object.keys(objectName).length === 0 &&
    objectName.constructor === Object
  )
}

/**
 * Debounces a function, limiting the rate at which it can be called.
 * 
 * @param func - The function to debounce.
 * @param wait - The time to wait (in milliseconds) before invoking the function.
 * @returns A debounced version of the provided function.
 */
export function debounce(
  func: Function,
  wait: number
): (...args: any[]) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// export function truncateNumber(num: number, decimals: number) {
//   const factor = Math.pow(10, decimals);
//   return (num >= 0 ? Math.floor(num * factor) : Math.ceil(num * factor)) / factor;
// }


/**
 * Truncates a number to a specified number of decimal places.
 * 
 * @param num - The number to truncate.
 * @param decimals - The number of decimal places to keep.
 * @returns The truncated number.
 */
export function truncateNumber(num: number, decimals: number): number {

  // const value = num.toString();
  // console.log(Number(num),'=======num');
  const regex = new RegExp(`^-?\\d+(?:\\.\\d{0,${decimals}})?`);
  const match = num.toString().match(regex);
  // console.log(match,'=======match');

  return match ? parseFloat(match[0]) : num;
  // const valueString = num.toString();
  // const decimalIndex = valueString.indexOf('.');

  // if (decimalIndex === -1) {
  //   // No decimal point found, so return the value as is
  //   return parseFloat(valueString);
  // }

  // // Slice the string to include only up to 6 digits after the decimal point
  // const truncatedString = valueString.slice(0, decimalIndex + (decimals + 1));
  // return parseFloat(truncatedString); // Convert the truncated string back to a number


}

/**
 * Subtracts two numbers with precision, rounding to a specified decimal precision.
 * 
 * @param a - The first number.
 * @param b - The second number to subtract from the first.
 * @param precision - The number of decimal places to round to.
 * @returns The result of a - b, rounded to the specified precision.
 */

export function preciseSubtraction(a: number, b: number, precision: number = 6) {
  const factor = Math.pow(10, precision);
  return Math.round((a - b) * factor) / factor;
}

/**
 * Adds two numbers with precision, rounding to a specified decimal precision.
 * 
 * @param a - The first number.
 * @param b - The second number to add.
 * @param precision - The number of decimal places to round to.
 * @returns The result of a + b, rounded to the specified precision.
 */
export function preciseAddition(a: number, b: number, precision: number = 6) {
  const factor = Math.pow(10, precision);
  return Math.round((a + b) * factor) / factor;
}
