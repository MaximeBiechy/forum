import {defineWrappedResponseHandler} from "~/server/utils/mysql";

export default defineWrappedResponseHandler(async (event) => {
    const db = event.context.mysql;
    const topicId = event.context.params?.topicId;
    const body = await readBody(event);
    const {title} = body;

    if (!topicId || !title) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Topic ID et titre requis',
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

        await db.query('UPDATE topics SET title = ? WHERE id = ?', [title, topicId]);

        return {success: true, message: 'Sujet modifié avec succès.'};
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la modification du sujet',
            data: error.message,
        });
    }
});