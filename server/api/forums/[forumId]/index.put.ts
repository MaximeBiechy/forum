import {defineWrappedResponseHandler} from "~/server/utils/mysql";

export default defineWrappedResponseHandler(async (event) => {
    const db = event.context.mysql;
    const forumId = event.context.params?.forumId;
    const body = await readBody(event);
    const {title} = body;

    if (!forumId || !title) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Forum ID et nouveau titre requis.',
        });
    }

    try {
        await db.query('UPDATE forums SET title = ? WHERE id = ?', [title, forumId]);

        return {success: true, message: 'Forum renommé avec succès.'};
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors du renommage du forum.',
            data: error.message,
        });
    }
});