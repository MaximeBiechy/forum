import {defineWrappedResponseHandler} from "~/server/utils/mysql";

export default defineWrappedResponseHandler(async (event) => {
    const db = event.context.mysql

    const {title, created_by} = await readBody(event)

    if (!title) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Le titre est requis',
        })
    }

    try {
        const results = await db.query('INSERT INTO forums (title, created_by) VALUES (?, ?)', [title, created_by]);
        const insertId = results[0].insertId;
        const newForum = await db.query('SELECT * FROM forums WHERE id = ?', [insertId]);
        return newForum[0][0];
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de l\'insertion dans la base de données',
            data: error.message,
        })
    }
})