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

    const query = getQuery(event);
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 20;
    const offset = (page - 1) * limit;

    try {
        const [topicExists] = await db.query('SELECT id FROM topics WHERE id = ?', [topicId]);
        if (topicExists.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Topic introuvable',
            });
        }

        const [rows] = await db.query(`
            SELECT messages.*, users.email AS author_email, users.avatar_image_name AS author_avatar
            FROM messages
                     JOIN users ON messages.user_id = users.id
            WHERE messages.topic_id = ?
            ORDER BY messages.created_at ASC LIMIT ?
            OFFSET ?
        `, [topicId, limit, offset]);

        const totalRows = await db.query('SELECT COUNT(*) as total FROM messages WHERE topic_id = ?', [topicId]);
        const total = totalRows[0][0].total;

        return {
            success: true,
            messages: rows,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la récupération des messages',
            data: error.message,
        });
    }
});