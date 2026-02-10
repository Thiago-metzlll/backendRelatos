
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'Thiago@exemplo.com'; // Note the uppercase T
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log(`User NOT found for email: ${email}`);
        const allUsers = await prisma.user.findMany();
        console.log('Available emails:', allUsers.map(u => u.email));
    } else {
        console.log(`User found for email: ${email}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
