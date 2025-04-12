import {defineWrappedResponseHandler} from "~/server/utils/mysql";

export default defineWrappedResponseHandler(async (event) => {
    const db = event.context.mysql;
    const messageId = event.context.params?.messageId;
    const {content} = await readBody(event);

    if (!content) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Le contenu du message est requis',
        });
    }

    try {
        await db.query('UPDATE messages SET content = ? WHERE id = ?', [content, messageId]);
        return {success: true};
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la modification du message',
            data: error.message,
        });
    }
});