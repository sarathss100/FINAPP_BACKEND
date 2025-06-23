import { v4 as uuidv4 } from 'uuid';

/**
* Generates a unique identifier using UUID version 4.
*
* @returns {string} A randomly generated UUID string in the format:
*                   "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
*/
const generateUniqueId = function (): string {
    // Generate and return a UUID v4 string
    return uuidv4();
};

export default generateUniqueId;
