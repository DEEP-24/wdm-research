import { hashPassword } from "@/lib/server/misc";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      firstName: "Admin",
      lastName: "User",
      email: "admin@app.com",
      password: await hashPassword("password"),
      role: UserRole.ADMIN,
      researchInterests: "System Administration, Security",
      expertise: "IT Administration",
      phone: "1234567890",
      streetNo: "123 Admin Street",
      aptNo: "A1",
      city: "San Francisco",
      state: "CA",
      zipcode: "94105",
      dob: new Date("1980-01-01"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await prisma.user.create({
    data: {
      firstName: "Event",
      lastName: "Organizer",
      email: "organizer@app.com",
      password: await hashPassword("password"),
      role: UserRole.ORGANIZER,
      researchInterests: "Event Management, Community Building",
      expertise: "Event Planning",
      phone: "0987654321",
      streetNo: "456 Event Ave",
      aptNo: "B2",
      city: "Los Angeles",
      state: "CA",
      zipcode: "90001",
      dob: new Date("1985-02-15"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await prisma.user.create({
    data: {
      firstName: "John",
      lastName: "Investor",
      email: "investor@app.com",
      password: await hashPassword("password"),
      role: UserRole.INVESTOR,
      researchInterests: "Startups, Technology",
      expertise: "Angel Investment",
      phone: "1234509876",
      streetNo: "789 Investor Blvd",
      aptNo: "PH3",
      city: "New York",
      state: "NY",
      zipcode: "10001",
      dob: new Date("1975-03-20"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await prisma.user.create({
    data: {
      firstName: "Regular",
      lastName: "User",
      email: "user@app.com",
      password: await hashPassword("password"),
      role: UserRole.USER,
      researchInterests: "Technology, Innovation",
      expertise: "Software Development",
      phone: "1092837465",
      streetNo: "321 User Lane",
      aptNo: "C4",
      city: "Seattle",
      state: "WA",
      zipcode: "98101",
      dob: new Date("1990-04-10"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
