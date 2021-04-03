import { LocalStorage, Notify } from "quasar";
import moment from "moment";
import striptags from "striptags";
import { removeLocalStorage } from "./storage";
import store from "../store";
import Compress from "compress.js";
import { uniqBy } from "lodash";

moment.locale("id");

export function base64ToFile(data, filename) {
  const BASE64_MARKER = ";base64,";
  let blob = null;

  if (data.indexOf(BASE64_MARKER) === -1) {
    const parts = data.split(",");
    const contentType = parts[0].split(":")[1];
    const raw = decodeURIComponent(parts[1]);
    blob = new Blob([raw], {
      type: contentType
    });
  } else {
    const parts = data.split(BASE64_MARKER);
    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; i++) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    blob = new Blob([uInt8Array], {
      type: contentType
    });
  }

  blob.name = filename;

  return blob;
}

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // reader.onloadend = (e) => resolve(imageToDataUri(e, 400, 400))
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export function compresBase64(files) {
  const compress = new Compress();

  return compress
    .compress(files, {
      size: 0.05, // the max size in MB, defaults to 2MB
      quality: 0.6, // the quality of the image, max is 1,
      resize: true // defaults to true, set false if you do not want to resize the image width and height
    })
    .then(data => {
      return data;
    });
}

function clearLocalStorageAndRedirectLogin(context, onEnd) {
  if (onEnd) {
    onEnd();
  }
  removeLocalStorage();
  context.$store.dispatch("user/logout");

  context.$router.push("/");

  context.$router.push("/login", () => {
    window.location.reload();
  });
}

function logout(context, onStart, onEnd) {
  if (onStart) {
    onStart();
  }

  clearLocalStorageAndRedirectLogin(context, onEnd);
}

export function executeLogout(context, onStart, onEnd) {
  logout(context, onStart, onEnd);
}

let privateContext;

export function setContext(newContext) {
  privateContext = newContext;
}

export function handleTokenError() {
  Notify.create({
    message: "Token Expired",
    timeout: 500,
    type: "warning",
    color: "warning",
    icon: "warning",
    detail: "Please login"
  });

  executeLogout(privateContext);
}

function getChildren(list, parent) {
  if (!parent || !list || list.length < 1) {
    return null;
  }

  const children = list.filter(el => el.parent_id === parent.id);
  const others = list.filter(el => el.parent_id !== parent.id);

  if (children.length < 1) {
    return null;
  }

  for (let i = 0; i < children.length; i++) {
    const grandChildren = getChildren(others, children[i]);

    if (grandChildren && grandChildren.length > 0) {
      children[i].children = grandChildren;
    }
  }

  return children;
}
export function transformToTree(list) {
  if (!list || list.length < 1) {
    return null;
  }

  list = uniqBy(list, "id");

  const roots = list.filter(el => !el.parent_id);
  const others = list.filter(el => !!el.parent_id);

  if (roots.length < 1) {
    return null;
  }

  const result = roots.map(r => {
    const children = getChildren(others, r);
    if (children && children.length > 0) {
      r.children = children;
    }

    return r;
  });

  return result;
}

export function dateFormat(value, format = "DD MMM YYYY") {
  return moment(value).format(format);
}

export function timestampFormat(value) {
  // return moment(value).format("LLLL");
  return moment(value).format("dddd, Do MMM YYYY, HH:mm:ss");
}

export function timeFromNow(value) {
  return moment(value).fromNow(true);
}

export function rupiah(nominal, decimal = 2) {
  // return nominal
  //   .toString()
  //   .split("")
  //   .reverse()
  //   .join("")
  //   .match(/\d{1,3}/g)
  //   .join(".")
  //   .split("")
  //   .reverse()
  //   .join("");
  let val = (nominal / 1).toFixed(decimal).replace(".", ",");
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function getSegment() {
  return null; // LocalStorage.getItem(`histroryTracking`);
}

export function setHistoryTracking(awb, courier) {
  const old = getHistoryTracking();
  const newData = { awb: awb, courier: courier };
  let data = [];
  if (old) {
    old.push(newData);
    data = old;
  } else {
    data.push(newData);
  }
  return LocalStorage.set(`histroryTracking`, data);
}

export function getHistoryTracking() {
  return LocalStorage.getItem(`histroryTracking`);
}
