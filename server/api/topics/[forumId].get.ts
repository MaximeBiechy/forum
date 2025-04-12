import {defineWrappedResponseHandler} from "~/server/utils/mysql";

export default defineWrappedResponseHandler(async (event) => {
    const db = event.context.mysql;
    const forumId = event.context.params?.forumId;

    if (!forumId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Forum ID requis',
        });
    }

    const query = getQuery(event);
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 20;
    const offset = (page - 1) * limit;

    try {
        const [rows] = await db.query(`
            SELECT topics.*,
                   users.email                                                                         AS author_email,
                   users.avatar_image_name                                                             AS author_avatar,
                   (SELECT MAX(messages.created_at)
                    FROM messages
                    WHERE messages.topic_id = topics.id)                                               AS last_message_date,
                   (SELECT users.email
                    FROM messages
                             JOIN users ON messages.user_id = users.id
                    WHERE messages.topic_id = topics.id
                    ORDER BY messages.created_at DESC                                                     LIMIT 1) AS last_message_author
            FROM topics
                JOIN users
            ON topics.user_id = users.id
            WHERE topics.forum_id = ?
            ORDER BY last_message_date DESC
                LIMIT ?
            OFFSET ?
        `, [forumId, limit, offset]);

        const totalRows = await db.query('SELECT COUNT(*) as total FROM topics WHERE forum_id = ?', [forumId]);
        const total = totalRows[0][0].total;

        return {
            success: true,
            topics: rows,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la récupération des sujets',
            data: error.message,
        });
    }
});