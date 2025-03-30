
const isProduction = process.env.NODE_ENV === 'production';

// Options for HTTP-only cookies
export const httpOnlyCookieOptions = {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 15 * 60 * 1000,
} as const;
