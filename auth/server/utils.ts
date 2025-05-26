import { Request } from 'express';
import { ADMIN_ROLE } from './roles';
import { User } from '../models/user';
import { URL } from 'node:url';

const DESTINATION_HEADERS = {
  proto: 'X-Forwarded-Proto',
  host: 'X-Forwarded-Host',
  uri: 'X-Forwarded-Uri',
  method: 'X-Forwarded-Method',
};

export function parseDestination(req: Request) {
  const proto = req.header(DESTINATION_HEADERS.proto);
  const host = req.header(DESTINATION_HEADERS.host);
  const uri = req.header(DESTINATION_HEADERS.uri);
  const method = req.header(DESTINATION_HEADERS.method);

  const url = new URL(`${proto}://${host}${uri}`);
  return { url, method };
}

export async function allowSignup(req: Request) {
  if (req.user && req.user.roles.includes(ADMIN_ROLE)) {
    return true;
  }
  const firstUser = await User.findOne();
  if (firstUser === null) {
    return true;
  }
  return false;
}
