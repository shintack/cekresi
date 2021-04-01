import {
  setCredential,
  setRawProfile,
  setCurrentAccessId,
  removeLocalStorage,
  setMyPoint
} from '../../lib/storage';

export function login(context, payload) {
  setCredential(payload.accessToken, payload.refreshToken);
  context.commit('login', payload);
}

export function updateRawProfile(context, payload) {
  setRawProfile(payload);
  context.commit('updateRawProfile', payload);
}

export function updateAccessId(context, payload) {
  setCurrentAccessId(payload);
  context.commit('updateAccessId', payload);
}

export function updateMyPoint(context, payload) {
  setMyPoint(payload);
  context.commit('updateMyPoint', payload);
}


export function logout(context) {
  removeLocalStorage();

  context.commit('logout');
}
