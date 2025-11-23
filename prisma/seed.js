const { PrismaClient, AppointmentStatus } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@pets.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@pets.com',
      passwordHash: passwordHash,
    },
  });

  const [bella, max] = await prisma.$transaction([
    prisma.pet.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Bella',
        species: 'Dog',
        age: 3,
        weight: 15.2,
        observations: 'Loves treats',
        ownerId: user.id,
      },
    }),
    prisma.pet.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Max',
        species: 'Cat',
        age: 2,
        weight: 5.5,
        observations: 'Shy with strangers',
        ownerId: user.id,
      },
    }),
  ]);

  await prisma.$transaction([
    prisma.appointment.upsert({
      where: { id: 1 },
      update: {},
      create: {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        service: 'Vaccination',
        observations: 'Rabies shot',
        status: AppointmentStatus.SCHEDULED,
        petId: bella.id,
      },
    }),
    prisma.appointment.upsert({
      where: { id: 2 },
      update: {},
      create: {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        service: 'Grooming',
        observations: 'Full grooming',
        status: AppointmentStatus.CONFIRMED,
        petId: max.id,
      },
    }),
  ]);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });