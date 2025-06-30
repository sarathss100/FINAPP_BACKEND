"use strict";
// import LoggerService from 'services/logger/LoggerService';
// import logger from 'config/logger/logger';
// import { expect, it } from '@jest/globals';
// import { describe } from 'node:test';
// describe('LoggerService', () => {
//     // Test for info method
//     it('should call logger .info with the correct message', () => {
//         const message = 'Test info message';
//         LoggerService.info(message);
//         // Assert that logger .info was called with the correct messages
//         expect(logger.info).toHaveBeenCalledWith(message);
//     });
//     // Test for error method without an error object
//     it('should call logger .error with the correct message and error details when an error is provided', () => {
//         const message = 'Test error message';
//         const error = new Error(`Something went wrong`);
//         LoggerService.error(message, error);
//         // Assert that logger .error was called with the correct formatted message
//         expect(logger.error).toHaveBeenCalledWith(`${message} - ${error.message}`)
//     });
//     // Test for warn method 
//     it('should call logger .warn with the correct message', () => {
//         const message = 'Test warn message';
//         LoggerService.warn(message);
//         // Assert that logger .warn was called with the correct message
//         expect(logger.warn).toHaveBeenCalledWith(message);
//     });
//     // Test for debug method 
//     it('shoudl call logger .debug with the correct message', () => {
//         const message = 'Test debug message';
//         LoggerService.debug(message);
//         // Assert that logger .debug was called with the correct message
//         expect(logger.debug).toHaveBeenCalledWith(message);
//     });
// });
// function expect(debug: LeveledLogMethod) {
//     throw new Error('Function not implemented.');
// }
