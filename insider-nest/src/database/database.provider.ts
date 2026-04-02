import { Global, Provider } from '@nestjs/common';
import { Pool } from 'pg';

export const DatabaseProvider: Provider = {
    provide: 'DB',
    useFactory: async () => {
        const pool = new Pool({
            host: 'localhost',
            port: 5432,
            user: 'postgres',
            password: 'admin123',
            database: 'insider-nest',
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