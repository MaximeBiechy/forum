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
        const [message] = await db.query('SELECT topic_id FROM messages WHERE id = ?', [messageId]);
        if (message.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Message introuvable',
            });
        }

        const topicId = message[0].topic_id;

        await db.query('DELETE FROM messages WHERE id = ?', [messageId]);

        const [remainingMessages] = await db.query('SELECT COUNT(*) as count FROM messages WHERE topic_id = ?', [topicId]);
        if (remainingMessages[0].count === 0) {
            await db.query('DELETE FROM topics WHERE id = ?', [topicId]);
        }

        return {success: true, message: 'Message supprimé avec succès.'};
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la suppression du message',
            data: error.message,
        });
    }
});