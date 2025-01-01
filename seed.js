// seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Add experience records
  const experiences = [
    {
      student: 'John Doe',
      company: 'Amazon',
      location: 'Seattle, WA',
      pdfUrl: './experiences/amazon.pdf',
    },
    {
      student: 'Jane Smith',
      company: 'TCS',
      location: 'Mumbai, India',
      pdfUrl: './experiences/tcs.pdf',
    },
    {
      student: 'Alice Brown',
      company: 'Walmart',
      location: 'Bentonville, AR',
      pdfUrl: './experiences/walmart.pdf',
    },
    {
      student: 'Bob Johnson',
      company: 'Wells Fargo',
      location: 'San Francisco, CA',
      pdfUrl: './experiences/wells.pdf',
    },
  ];

  for (const experience of experiences) {
    await prisma.experience.create({
      data: experience,
    });
  }

  console.log('Seeding complete.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
