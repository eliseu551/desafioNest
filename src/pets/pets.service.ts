import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Pet } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(private readonly prisma: PrismaService) {}

  create(ownerId: number, dto: CreatePetDto): Promise<Pet> {
    return this.prisma.pet.create({
      data: {
        ...dto,
        ownerId,
      },
    });
  }

  findAll(ownerId: number) {
    return this.prisma.pet.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(ownerId: number, id: number) {
    const pet = await this.prisma.pet.findFirst({
      where: { id, ownerId },
    });
    if (!pet) throw new NotFoundException('Pet não encontrado.');
    return pet;
  }

  async update(ownerId: number, id: number, dto: UpdatePetDto) {
    await this.ensureOwnership(ownerId, id);
    return this.prisma.pet.update({
      where: { id },
      data: dto,
    });
  }

  async remove(ownerId: number, id: number) {
    await this.ensureOwnership(ownerId, id);
    await this.prisma.pet.delete({ where: { id } });
    return { deleted: true };
  }

  private async ensureOwnership(ownerId: number, petId: number) {
    const pet = await this.prisma.pet.findUnique({ where: { id: petId } });
    if (!pet) throw new NotFoundException('Pet não encontrado.');
    if (pet.ownerId !== ownerId) {
      throw new ForbiddenException('Você não tem acesso a este pet.');
    }
  }
}
