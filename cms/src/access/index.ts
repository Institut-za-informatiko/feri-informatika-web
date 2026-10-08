import type { Access, FieldAccess } from 'payload';

type Role = 'admin' | 'editor';

const hasRole = (user: unknown, role: Role): boolean =>
  Boolean(user && (user as { role?: Role }).role === role);

export const isAdmin: Access = ({ req }) => hasRole(req.user, 'admin');

export const isAdminField: FieldAccess = ({ req }) =>
  hasRole(req.user, 'admin');

export const isLoggedIn: Access = ({ req }) => Boolean(req.user);

export const anyone: Access = () => true;

/** Admins manage every account; everyone else only their own. */
export const isAdminOrSelf: Access = ({ req }) => {
  if (hasRole(req.user, 'admin')) return true;
  if (req.user) return { id: { equals: req.user.id } };
  return false;
};

/** The public (and the site build) only sees published documents; editors see drafts too. */
export const publishedOrLoggedIn: Access = ({ req }) => {
  if (req.user) return true;
  return { _status: { equals: 'published' } };
};
