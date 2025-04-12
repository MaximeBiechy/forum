import {defineWrappedResponseHandler} from "~/server/utils/mysql";

export default defineWrappedResponseHandler(async (event) => {
    const db = event.context.mysql;
    const forumId = event.context.params?.forumId;

    if (!forumId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Forum ID requis.',
        });
    }

    try {
        await db.query(`
            DELETE
            messages
            FROM messages
            JOIN topics ON messages.topic_id = topics.id
            WHERE topics.forum_id = ?
        `, [forumId]);

        await db.query('DELETE FROM topics WHERE forum_id = ?', [forumId]);

        await db.query('DELETE FROM forums WHERE id = ?', [forumId]);

        return {success: true, message: 'Forum et ses contenus supprimés avec succès.'};
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la suppression du forum.',
            data: error.message,
        });
    }
});