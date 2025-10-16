import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

async function main() {
  const email = "builder@test.com";
  const password = "Test12345!";
  const passwordHash = await hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { role: "BUILDER", passwordHash },
    create: { email, name: "Test Builder", role: "BUILDER", passwordHash },
  });

  await prisma.builderProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      companyName: "Test Builder Ltd",
      postcode: "ME14",
      radiusMiles: 15,
      trades: ["Plumbing", "Electrical"],
      completeness: 60,
      status: "ACTIVE",
    },
  });

  console.log("✅ BUILDER ready:");
  console.log("  Email:    ", email);
  console.log("  Password: ", password);
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => process.exit(0));
