import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(name: string, email: string, password: string) {
        return this.prisma.user.create({
        data: {
            name,
            email,
            password,
        },
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
        where: {
            email,
        },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
        where: {
            id,
        },
        });
    }
}
