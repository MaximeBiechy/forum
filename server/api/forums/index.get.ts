import {defineWrappedResponseHandler} from "~/server/utils/mysql";

export default defineWrappedResponseHandler(async (event) => {
    const db = event.context.mysql

    const query = getQuery(event);
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const order = query.order === 'desc' ? 'DESC' : 'ASC';

    try {
        const [rows] = await db.query(`
            SELECT forums.*,
                   (SELECT COUNT(*) FROM topics WHERE topics.forum_id = forums.id) AS topic_count
            FROM forums
            ORDER BY created_at ${order}
            LIMIT ?
            OFFSET ?
        `, [limit, offset]);
        const totalRows = await db.query('SELECT COUNT(*) as total FROM forums');
        const total = totalRows[0][0].total;

        return {
            success: true,
            forums: rows,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la récupération des forums',
            data: error.message,
        })
    }

})