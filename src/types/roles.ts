
export const UserRole = {
    ADMIN: 'admin',
    USER: 'user',
} as const;

// Infer the type of the object values
export type UserRole = typeof UserRole[keyof typeof UserRole];

