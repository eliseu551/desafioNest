import { Pet } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
export declare class PetsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(ownerId: number, dto: CreatePetDto): Promise<Pet>;
    findAll(ownerId: number): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        species: string;
        age: number | null;
        weight: number | null;
        observations: string | null;
        ownerId: number;
    }[]>;
    findOne(ownerId: number, id: number): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        species: string;
        age: number | null;
        weight: number | null;
        observations: string | null;
        ownerId: number;
    }>;
    update(ownerId: number, id: number, dto: UpdatePetDto): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        species: string;
        age: number | null;
        weight: number | null;
        observations: string | null;
        ownerId: number;
    }>;
    remove(ownerId: number, id: number): Promise<{
        deleted: boolean;
    }>;
    private ensureOwnership;
}
