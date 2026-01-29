import mysql, {PoolOptions} from 'mysql2/promise';

export const dbConfig: PoolOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    port: Number(process.env.PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}