"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
/**
* Generates a unique identifier using UUID version 4.
*
* @returns {string} A randomly generated UUID string in the format:
*                   "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
*/
const generateUniqueId = function () {
    // Generate and return a UUID v4 string
    return (0, uuid_1.v4)();
};
exports.default = generateUniqueId;
