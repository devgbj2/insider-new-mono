import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { LoggerService } from 'src/logger/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Pool } from 'pg';
import { CreateWhiteListDto } from './dto/create-whitelist-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject('DB') private readonly db: Pool, //pakai @inject karena bukan di daftarkan sebagai class atau service
  ) { }

  async findById(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        nik: true,
        role: true,
      },
    });
  }

  async findByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: { username },
    });
  }

  // async findAll(): Promise<any> {
  //   const user = await this.prisma.$queryRaw`
  //     SELECT * FROM "User"
  //     `

  //   return user
  // }

  async findAll(): Promise<any> {
    const result = await this.db.query(`
      SELECT id, username, email, nik, role, "createdAt" FROM "User" where rowstatus = true order by "createdAt"
      `);

    return result.rows;
  }

  async create(dto: CreateUserDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    dto.password = hash;

    const user = await this.prisma.user.create({
      data: dto,
      select: {
        id: true,
        email: true,
        username: true,
        nik: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      message: 'user created',
      ...user,
    };
  }

  async delete(username: string) {
    await this.prisma.user.delete({
      where: { username },
    });

    return {
      message: 'user deleted',
    };
  }

  async findAllWhitelist() {
    const result = await this.db.query(`
      SELECT * FROM "WhitelistLdap" order by "createdAt"
      `);

    return result.rows;
  }

  async findWhitelistByNik(nik: string) {
    return await this.prisma.whitelistLdap.findUnique({
      where: { nik },
    });
  }

  async createWhitelist(dto: CreateWhiteListDto) {
    const data = dto.niks.map((nik) => ({
      nik,
      rowstatus: dto.rowstatus ?? true,
    }));

    await this.prisma.whitelistLdap.createMany({
      data,
    });

    return {
      message: 'whitelist created',
    };
  }

  async updateWhitelist(nik: string, rowstatus: boolean) {
    await this.prisma.whitelistLdap.update({
      where: { nik },
      data: { rowstatus: !rowstatus },
    });

    return {
      message: 'whitelist updated',
    };
  }

  async updateUser(oldUsername:string, username: string, role: string) {
    await this.prisma.user.update({
      where: { username: oldUsername },
      data: { 
        username: username,
        role: role 
      },
    });

    return {
      message: 'user updated',
    };
  }

  async deleteWhitelist(nik: string) {
    await this.prisma.whitelistLdap.delete({
      where: { nik: nik },
    });

    return {
      message: 'whitelist deleted',
    };
  }
}
