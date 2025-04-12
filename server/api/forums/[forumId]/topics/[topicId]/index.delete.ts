import {defineWrappedResponseHandler} from "~/server/utils/mysql";

export default defineWrappedResponseHandler(async (event) => {
    const db = event.context.mysql;
    const topicId = event.context.params?.topicId;

    if (!topicId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Topic ID requis',
        });
    }

    try {
        const [topicExists] = await db.query('SELECT id FROM topics WHERE id = ?', [topicId]);
        if (topicExists.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Topic introuvable',
            });
        }

        await db.query('DELETE FROM topics WHERE id = ?', [topicId]);

        return {success: true, message: 'Topic supprimé avec succès.'};
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la suppression du topic',
            data: error.message,
        });
    }
});