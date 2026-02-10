
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function testLogin(email: string, senha: string) {
    console.log(`Testing login for ${email} with password ${senha}`);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log('User not found in database');
        return;
    }

    console.log('User found:', { id: user.id, email: user.email });

    const isMatch = await bcrypt.compare(senha, user.senha);
    console.log('Password match:', isMatch);
}

async function main() {
    // Test with a known user from the seed
    await testLogin('thiago@exemplo.com', 'senha123');

    // Also try to register a new user and login immediately
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testpassword';

    console.log(`\nRegistering new user: ${testEmail}`);
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    await prisma.user.create({
        data: {
            nome: 'Test User',
            email: testEmail,
            senha: hashedPassword,
        },
    });

    await testLogin(testEmail, testPassword);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
