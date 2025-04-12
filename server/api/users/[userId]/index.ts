import {defineWrappedResponseHandler} from "~/server/utils/mysql";

export default defineWrappedResponseHandler(async (event) => {
    const db = event.context.mysql

    const user_id = event.context.params?.userId;

    if (!user_id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'L\'ID de l\'utilisateur est requis',
        })
    }

    try {
        const rows = await db.query(`
            SELECT *
            FROM users
            WHERE id = ?`, [user_id]);

        if (rows[0].length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Utilisateur non trouvé',
            })
        }

        return {success: true, user: rows[0][0]};

    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la récupération de l\'utilisateur',
            data: error.message,
        })
    }
})