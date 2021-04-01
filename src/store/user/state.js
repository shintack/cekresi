import { getCredential } from '../../lib/storage';

const savedData = getCredential();

// Return initial state taken from LocalStorage/previous session
export default {
  accessToken: savedData.accessToken,
  refreshToken: savedData.refreshToken,
  rawProfile: savedData.rawProfile,
  currentAccessId: savedData.currentAccessId,
  rawPoint: savedData.rawPoint
};
