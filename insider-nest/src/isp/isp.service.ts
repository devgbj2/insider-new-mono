import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateIspDto } from './dto/create-isp-dto';
import { QueryIspDto } from './dto/query-isp.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';
import { Prisma } from '@prisma/client';


@Injectable()
export class IspService {
    constructor(
        private prisma: PrismaService,
        @Inject('DB') private readonly db: Pool //pakai @inject karena bukan di daftarkan sebagai class atau service
    ) {
    }

    async findByName(name: string) {
        return await this.prisma.internetServiceProvider.findUnique({
            where: { name },
            //ambil semua field
        });
    }

    async findAll(query: QueryIspDto): Promise<PaginatedResponseDto<any>> {
        const { page, limit, name, size, risk, scale, area, quality, isJartup, isJartaplok, isCustomer } = query;
        const skip = (page - 1) * limit;

        // Bangun where clause secara type-safe
        const where = {
            ...(name && {
                name: { contains: name, mode: 'insensitive' },
            }),
            ...(isJartup !== undefined && { isJartup }),
            ...(isJartaplok !== undefined && { isJartaplok }),
            ...(isCustomer !== undefined && { isCustomer }),

            ...(size?.length && { size: { in: size } }),
            ...(risk?.length && { risk: { in: risk } }),
            ...(scale?.length && { scale: { in: scale } }),
            ...(area?.length && { headquarter: { in: area } }),
            ...(quality?.length && { quality: { in: quality } }),
        };

        const [data, total] = await Promise.all([
            this.prisma.internetServiceProvider.findMany({
                where,
                skip,
                take: limit,      // ✅ pakai limit yang sudah divalidasi DTO
                orderBy: { id: 'asc' },
            }),
            this.prisma.internetServiceProvider.count({ where }),
        ]);

        return PaginatedResponseDto.of(data, total, page, limit);
    }

    async create(dto: CreateIspDto) {
        const user = await this.prisma.internetServiceProvider.create({
            data: dto
        })

        return user;
    }


    async findById(id: number) {
        return await this.prisma.internetServiceProvider.findUnique({
            where: { id },
        });
    }
}
