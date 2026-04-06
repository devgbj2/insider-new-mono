import { Global, Provider } from '@nestjs/common';
import { Pool } from 'pg';

export const DatabaseProvider: Provider = {
    provide: 'DB',
    useFactory: async () => {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            // Jika database luar Anda mewajibkan SSL (sering terjadi di cloud/korporat):
            // ssl: { rejectUnauthorized: false } 
        });

        // test connection
        try {
            await pool.query('SELECT 1');
        } catch (error) {
            console.error(error);
        }
        return pool;
    },
};