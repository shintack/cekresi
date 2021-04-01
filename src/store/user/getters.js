import { chain, find } from 'lodash';

export function isAuthenticated(state) {
  return !!state.accessToken;
}

export function profile(state) {
  return JSON.parse(state.rawProfile);
}

export function point(state) {
  return JSON.parse(state.rawPoint);
}

export function accesses(state, getters) {
  if (getters.profile) {
    return getters.profile.mailbox_akses;
  }
  return [];
}

export function currentAccess(state, getters) {
  if (
    getters.accesses &&
    getters.accesses.length > 0 &&
    state.currentAccessId
  ) {
    return find(getters.accesses, { id: state.currentAccessId });
  }

  return null;
}

export function rolesOf(state, getters) {
  return accessId => {
    const access = find(getters.accesses, { id: accessId });

    if (access.mailbox && access.mailbox.roles) {
      return access.mailbox.roles;
    }

    return [];
  };
}

export function permissionsOf(state, getters) {
  return accessId => {
    const roles = getters.rolesOf(accessId);

    return chain(roles)
      .map(role => role.perms)
      .flatten()
      .uniqBy('id')
      .value();
  };
}

export function currentPermissions(state, getters) {
  return state.currentAccessId
    ? getters.permissionsOf(state.currentAccessId)
    : [];
}

export function currentRoles(state, getters) {
  return state.currentAccessId ? getters.rolesOf(state.currentAccessId) : [];
}

export function currentHasPermission(state, getters) {
  const permissions = getters.currentPermissions;

  return permissionName => {
    const permission = find(permissions, { name: permissionName });

    return !!permission;
  };
}

export function currentHasRole(state, getters) {
  const roles = getters.currentRoles;

  return roleName => {
    const role = find(roles, { name: roleName });

    return !!role;
  };
}

export function hasPermission(state, getters) {
  return (accessId, permissionName) => {
    const permissions = getters.permissionsOf(accessId);

    const permission = find(permissions, { name: permissionName });

    return !!permission;
  };
}
