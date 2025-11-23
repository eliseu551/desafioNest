import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetsService } from './pets.service';
export declare class PetsController {
    private readonly petsService;
    constructor(petsService: PetsService);
    create(user: any, dto: CreatePetDto): Promise<{
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
    findAll(user: any): import(".prisma/client").Prisma.PrismaPromise<{
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
    findOne(user: any, id: number): Promise<{
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
    update(user: any, id: number, dto: UpdatePetDto): Promise<{
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
    remove(user: any, id: number): Promise<{
        deleted: boolean;
    }>;
}
