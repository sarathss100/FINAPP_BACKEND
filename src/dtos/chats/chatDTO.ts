import { z } from 'zod';

export const chatDTOSchema = z.object({
    _id: z.string().optional(),
    userId: z.string().min(1, { message: 'User ID is required' }),
    role: z.union(
        [z.literal('user'), z.literal('bot')],
        { message: "Role must be either 'user' or 'bot'" }
    ),
    message: z.string().min(1, { message: 'Message content is required' }),
    timestamp: z.string()
        .refine(dateStr => {
            const date = new Date(dateStr);
            return !isNaN(date.getTime());
        }, {
            message: 'Invalid timestamp format',
        })
        .transform(dateStr => new Date(dateStr)),
});

export type ChatDTO = z.infer<typeof chatDTOSchema>;
