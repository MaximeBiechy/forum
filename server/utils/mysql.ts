import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';

export async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    });

    console.log("Connexion MySQL réussie");

    const sql = await fs.readFile(path.join(process.cwd(), 'server/sql/schema.sql'), 'utf-8');

    for (const query of sql.split(';')) {
      if (query.trim()) {
        await connection.query(query);
      }
    }

    console.log("Schéma MySQL initialisé");

    await connection.end();
  } catch (err) {
    console.error("Erreur lors de l'initialisation de la base de données", err);
  }
}
