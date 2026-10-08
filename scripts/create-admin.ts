/**
 * Adds (or re-activates) an administrator. They sign in with an emailed link.
 *
 *   ADMIN_EMAIL=… [ADMIN_NAME=…] pnpm create:admin
 */
import { getPayload } from 'payload';
import config from '../src/payload.config';

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
if (!email) throw new Error('ADMIN_EMAIL is required');

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
    data: { role: 'admin', active: true },
  });
  console.log(`updated admin ${email}`);
} else {
  await payload.create({
    collection: 'users',
    data: { email, role: 'admin', active: true, name: process.env.ADMIN_NAME },
  });
  console.log(`created admin ${email}`);
}
process.exit(0);
