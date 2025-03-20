import mysql from 'mysql2/promise';
import bluebird from 'bluebird'
import type {EventHandler, EventHandlerRequest} from 'h3'
import fs from 'fs/promises';
import path from 'path';

export async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'root',
      database: process.env.MYSQL_DATABASE || 'forum',
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

export const defineWrappedResponseHandler = <T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>
): EventHandler<T, D> =>
  defineEventHandler<T>(async event => {
    try {
      event.context.mysql = await mysql.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || 'root',
        database: process.env.MYSQL_DATABASE || 'forum',
        Promise: bluebird,
      })
      const response = await handler(event)
      event.context.mysql.end()
      return response
    } catch (err) {
      return {err}
    }
  })
