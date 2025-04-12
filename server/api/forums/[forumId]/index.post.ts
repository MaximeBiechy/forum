import {defineWrappedResponseHandler} from "~/server/utils/mysql";

export default defineWrappedResponseHandler(async (event) => {
    const db = event.context.mysql;
    const forum_id = event.context.params?.forumId;
    const {title, message, user_id} = await readBody(event);

    if (!title || !message) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Le titre et le message sont requis',
        });
    }

    try {
        const [topicResult] = await db.query('INSERT INTO topics (forum_id, user_id, title) VALUES (?, ?, ?)', [forum_id, user_id, title]);
        const topicId = topicResult.insertId;

        await db.query('INSERT INTO messages (topic_id, user_id, content) VALUES (?, ?, ?)', [topicId, user_id, message]);

        return {success: true, topicId};
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la création du sujet',
            data: error.message,
        });
    }
});