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

export function truncateNumber(num: number, decimals: number) {
  const factor = Math.pow(10, decimals);
  return (num >= 0 ? Math.floor(num * factor) : Math.ceil(num * factor)) / factor;
}