/**
 * Creates (or resets the password of) an admin account.
 *
 *   ADMIN_EMAIL=… ADMIN_PASSWORD=… [ADMIN_NAME=…] pnpm create:admin
 */
import { getPayload } from 'payload';
import config from '../src/payload.config';

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
if (!email || !password)
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: 'users',
  where: { email: { equals: email } },
  limit: 1,
});

if (docs[0]) {
  await payload.update({
    collection: 'users',
    id: docs[0].id,
    data: { password, role: 'admin' },
  });
  console.log(`updated admin ${email}`);
} else {
  await payload.create({
    collection: 'users',
    data: { email, password, role: 'admin', name: process.env.ADMIN_NAME },
  });
  console.log(`created admin ${email}`);
}
process.exit(0);
