export function login(state, { accessToken, refreshToken }) {
  state.accessToken = accessToken;
  state.refreshToken = refreshToken;
}

export function updateRawProfile(state, data) {
  state.rawProfile = data;
}

export function updateAccessId(state, accessId) {
  state.currentAccessId = accessId;
}

export function updateMyPoint(state, point) {
  state.currentMyPoint = point;
}

export function logout(state) {
  state.accessToken = null;
  state.refreshToken = null;
  state.rawProfile = null;
  state.currentAccessId = null;
  state.currentMyPoint = null;
}
