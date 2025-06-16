import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, 'data', 'flights.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const flights = JSON.parse(rawData);

  for (const flight of flights) {
    const createdFlight = await prisma.flight.create({
      data: {
        airline: flight.airline,
        airline_code: flight.airlineCode,
        flight_number: flight.flightNumber,
        origin: flight.origin,
        destination: flight.destination,
        available_seats: flight.availableSeats,
        price: flight.price,
        departure: new Date(flight.departure),
        arrival: new Date(flight.arrival),
        duration: flight.duration,
        operationalDays: {
          create: flight.operationalDays.map((day: number) => ({
            day: day
          }))
        }
      }
    });

    console.log(`✅ Seeded flight ${createdFlight.airline} ${createdFlight.flight_number}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('🌱 Seeding complete!');
  })
  .catch(async (e) => {
    console.error('❌ Seeding error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });