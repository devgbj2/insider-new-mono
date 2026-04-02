import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PbiLinkService {

    constructor(
        private prisma: PrismaService,
        @Inject('DB') private readonly db: Pool //pakai @inject karena bukan di daftarkan sebagai class atau service
    ) { }

    async findAll(): Promise<any> {
        const result = await this.db.query(`
      SELECT * FROM "PbiLink"
      `)

        return result.rows
    }

    async findByName(name: string) {
        return await this.prisma.pbiLink.findUnique({
            where: { name },
            select: {
                link: true,
            },
        });
    }
}
