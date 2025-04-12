import {defineWrappedResponseHandler} from "~/server/utils/mysql";

export default defineWrappedResponseHandler(async (event) => {
    const db = event.context.mysql;
    const messageId = event.context.params?.messageId;

    if (!messageId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Message ID requis',
        });
    }

    try {
        await db.query(`DELETE FROM messages WHERE id = ?`, [messageId]);

        return {success: true};
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la suppression du message',
            data: error.message,
        });
    }
});