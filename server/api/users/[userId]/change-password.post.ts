import {defineWrappedResponseHandler} from "~/server/utils/mysql";
import bcrypt from 'bcrypt';

const getUserById = async (db: any, id: string) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Utilisateur introuvable'
        });
    }
    return rows[0];
};

export default defineWrappedResponseHandler(async (event) => {
    const db = event.context.mysql;
    const body = await readBody(event);
    const userId = event.context.params?.userId;
    const {oldPassword, newPassword} = body;


    if (!userId || !oldPassword || !newPassword) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Tous les champs sont requis.',
        });
    }

    try {
        const user = await getUserById(db, userId);

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw createError({statusCode: 401, statusMessage: 'Ancien mot de passe incorrect.'});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

        return {success: true, message: 'Mot de passe modifié avec succès.'};
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la modification du mot de passe.',
            data: error.message
        });
    }
});