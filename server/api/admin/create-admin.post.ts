import {defineWrappedResponseHandler} from "~/server/utils/mysql";
import bcrypt from 'bcrypt';

export default defineWrappedResponseHandler(async (event) => {
    const db = event.context.mysql;
    const body = await readBody(event);
    const {email, password} = body;

    if (!email || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Email et mot de passe requis.',
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, 'admin']);

        return {success: true, message: 'Compte administrateur créé avec succès.'};
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la création du compte administrateur.',
            data: error.message,
        });
    }
});