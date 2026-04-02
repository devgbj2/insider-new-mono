import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PaginatedResponseDto } from 'src/isp/dto/paginated-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryActivityLogDto } from './dto/query-activity-log.dto';

@Injectable()
export class LogService {
  constructor(
    @Inject('DB') private readonly db: Pool,
    private prisma: PrismaService

  ) { }

  async saveLog(data: any) {
    try {
      await this.prisma.activityLog.create({
        data: {
          level: data.level ?? 'info',
          message: data.message ?? 'no message',
          ip: data.ip ?? '0.0.0.0',
          userId: data.userId ?? null,
          meta: data.meta ?? null,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async findByIp(ip: string) {
    const result = await this.db.query(`
          SELECT * FROM "ActivityLog" WHERE ip = $1
          `, [ip])

    return result.rows
  }

  async findAll(query: QueryActivityLogDto): Promise<PaginatedResponseDto<any>> {
    const { page, limit } = query;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        skip,
        take: limit,      // ✅ pakai limit yang sudah divalidasi DTO
        orderBy: { id: 'asc' },
      }),
      this.prisma.activityLog.count(),
    ]);

    return PaginatedResponseDto.of(data, total, page, limit);
  }
}