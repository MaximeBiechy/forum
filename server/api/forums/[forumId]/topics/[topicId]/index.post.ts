import {defineWrappedResponseHandler} from "~/server/utils/mysql";

export default defineWrappedResponseHandler(async (event) => {
    const db = event.context.mysql;
    const topicId = event.context.params?.topicId;
    const body = await readBody(event);

    if (!topicId || !body.content || !body.user_id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Données invalides',
        });
    }

    try {
        await db.query(
            `INSERT INTO messages (topic_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())`,
            [topicId, body.user_id, body.content]
        );

        return {success: true};
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la création du message',
            data: error.message,
        });
    }
});