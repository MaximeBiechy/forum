import bcrypt from 'bcrypt';
import {defineWrappedResponseHandler} from "~/server/utils/mysql";

const getUserByEmail = async (db: any, email: string) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

const createUser = async (db: any, email: string, hashedPassword: string) => {
    const [result] = await db.execute(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword]
    );
    return result.insertId;
};

export default defineWrappedResponseHandler(async (event: any) => {
    const db = event.context.mysql;
    const body = await readBody(event);
    const {email, password} = body;

    if (!email || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Email et mot de passe requis'
        });
    }

    try {
        const existingUser = await getUserByEmail(db, email);

        if (existingUser) {
            throw createError({
                statusCode: 409,
                statusMessage: 'Cette email est déjà pris'
            });
        }

        const hashedPassword = await hashPassword(password);
        const userId = await createUser(db, email, hashedPassword);

        return {success: true, userId};
    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Erreur lors de la création du compte'
        });
    }
});