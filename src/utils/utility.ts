// utility.ts

// Function to generate a random integer within a specified range
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to capitalize the first letter of a string
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Function to check if a value is an array
export function isArray(value: any): boolean {
  return Array.isArray(value);
}

export function isJson(str: any) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function isObjectEmpty(objectName: object) {
  return (
    objectName &&
    Object.keys(objectName).length === 0 &&
    objectName.constructor === Object
  )
}

// Function to debounce a function call
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

export function preciseSubtraction(a: number, b: number, precision: number = 6) {
  const factor = Math.pow(10, precision);
  return Math.round((a - b) * factor) / factor;
}

export function preciseAddition(a: number, b: number, precision: number = 6) {
  const factor = Math.pow(10, precision);
  return Math.round((a + b) * factor) / factor;
}
