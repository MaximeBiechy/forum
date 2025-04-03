import {defineWrappedResponseHandler} from "~/server/utils/mysql";

export default defineWrappedResponseHandler(async (event) => {
    const db = event.context.mysql

    try {
        const rows = await db.query('SELECT * FROM forums');
        return rows[0];
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la récupération des forums',
            data: error.message,
        })
    }

})