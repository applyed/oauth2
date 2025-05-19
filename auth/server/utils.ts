import { Request } from 'express';
import { ADMIN_ROLE } from './roles';
import { User } from '../models/user';

const DESTINATION_HEADERS = {
  host: 'X-Forwarded-Host',
  uri: 'X-Forwarded-Uri',
  method: 'X-Forwarded-Method',
};

export function parseDestination(req: Request) {
  return Object.entries(DESTINATION_HEADERS)
    .map(([key, headerName]): [string, URL | undefined] => {
      const headerValue = req.header(headerName);
      return [key, headerValue ? new URL(headerValue) : undefined];
    })
    .reduce<{ [key in keyof typeof DESTINATION_HEADERS]: URL | undefined }>(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value,
      }),
      {
        host: undefined,
        uri: undefined,
        method: undefined,
      }
    );
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
