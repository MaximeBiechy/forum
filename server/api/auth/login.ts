import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {defineWrappedResponseHandler} from "~/server/utils/mysql";

const getUserByEmail = async (db: any, email: string) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows || rows.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Utilisateur introuvable'
        });
    }
    return rows[0];
};

const validatePassword = async (password: string, hashedPassword: string) => {
    const isValid = await bcrypt.compare(password, hashedPassword);
    if (!isValid) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Mot de passe incorrect'
        });
    }
};

const generateToken = (user: any) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw createError({
            statusCode: 500,
            statusMessage: 'JWT secret pas défini'
        });
    }
    return jwt.sign(
        {userId: user.id, email: user.email},
        jwtSecret,
        {expiresIn: '1h'}
    );
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
        const user = await getUserByEmail(db, email);
        await validatePassword(password, user.password);
        const token = generateToken(user);

        return {
            success: true,
            token,
            user: {id: user.id, email: user.email, avatar_image_name: user.avatar_image_name}
        };
    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || `Erreur lors de la connexion ${error}`,
        });
    }
});