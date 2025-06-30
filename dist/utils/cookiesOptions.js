"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpOnlyCookieOptionsForRemoveRequest = exports.httpOnlyCookieOptions = void 0;
const isProduction = process.env.NODE_ENV === 'production';
// Options for HTTP-only cookies
exports.httpOnlyCookieOptions = {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 15 * 60 * 1000,
};
// Options for HTTP-only cookies
exports.httpOnlyCookieOptionsForRemoveRequest = {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: isProduction ? 'strict' : 'lax',
};
