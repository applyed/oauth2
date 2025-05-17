import { readFileSync } from 'node:fs';
import { URL } from 'node:url';
import { User } from '../models/user';

type RolePermissions = {
  [k: string]: {
    allowList: string[];
    denyList: string[];
  };
};

export const ADMIN_ROLE = 'admin';

const RolePermissionsMap: RolePermissions = (() => {
  try {
    return JSON.parse(readFileSync(process.env.PERMISSIONS_FILE ?? '', 'utf8'));
  } catch (e) {
    console.error(
      'Unable to parse the permissions file: ' + process.env.PERMISSIONS_FILE,
      e
    );
  }
})();

export function isAllowed(url: URL, user: User) {
  const { roles } = user;

  if (!RolePermissionsMap) {
    return true;
  }
  return roles.some((role) => isAllowedForRole(url, RolePermissionsMap[role]));
}

function isAllowedForRole(url: URL, role: RolePermissions[string]) {
  const allowedByRules = role.allowList.some((allowedPath) =>
    url.pathname.startsWith(allowedPath)
  );
  const disallowedByRules = role.denyList.some((deniedPath) =>
    url.pathname.startsWith(deniedPath)
  );
  return allowedByRules && !disallowedByRules;
}
