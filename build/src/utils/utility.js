"use strict";
// utility.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = exports.isObjectEmpty = exports.isJson = exports.isArray = exports.capitalizeFirstLetter = exports.getRandomInt = void 0;
// Function to generate a random integer within a specified range
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.getRandomInt = getRandomInt;
// Function to capitalize the first letter of a string
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;
// Function to check if a value is an array
function isArray(value) {
    return Array.isArray(value);
}
exports.isArray = isArray;
function isJson(str) {
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    return true;
}
exports.isJson = isJson;
function isObjectEmpty(objectName) {
    return (objectName &&
        Object.keys(objectName).length === 0 &&
        objectName.constructor === Object);
}
exports.isObjectEmpty = isObjectEmpty;
// Function to debounce a function call
function debounce(func, wait) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, wait);
    };
}
exports.debounce = debounce;
