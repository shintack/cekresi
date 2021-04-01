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

export function myActiveAccount() {
  const profile = store.getters["user/profile"];
  const accounts = profile.accounts;
  if (accounts.length > 0) {
    return accounts.filter(a => {
      return a.status === "active";
    });
  }
  return [];
}

export function isLoggedIn() {
  const profile = store.getters["user/profile"];
  return profile;
}

export function myShopData() {
  const profile = store.getters["user/profile"];
  console.log(profile);
  if (profile && profile.shop) {
    return profile.shop;
  }
  return null;
}

export function isAllowRegistration() {
  const regsitration = process.env.ALLOW_REGISTRATION;
  return regsitration;
}

export function isAllowCart() {
  const regsitration = process.env.ALLOW_SHOPPING_CART;
  return regsitration;
}

export function hasPermission(perms) {
  const profile = store.getters["user/profile"];
  if (profile) {
    const permissions = profile.permissions;
    return permissions.includes(perms);
  }
  return false;
}

export function hitungLuas(p, l) {
  return p * l;
}

export function copy(data) {
  this.$clipboard(striptags(data));
  Notify.create({
    message: "Berhasil di copy",
    timeout: 1000,
    type: "positive",
    color: "positive",
    icon: "done"
  });
  return true;
}

export function setStore(slug, data) {
  return LocalStorage.set(`currentStore_${slug}`, data);
}

export function getStoreData(slug) {
  return LocalStorage.getItem(`currentStore_${slug}`);
}

export function addToCart(slug, data) {
  const oldCart = LocalStorage.getItem(`carts_${slug}`);
  let dataCart = [];
  if (oldCart && oldCart.length) {
    const filter = oldCart.filter(c => {
      return c.id === data.id;
    });
    if (filter && filter.length > 0) {
      let i = 0;
      oldCart.forEach(oc => {
        if (oc.id === data.id) {
          oldCart[i] = { ...data };
        }
        ++i;
      });
      dataCart = oldCart;
    } else {
      dataCart = oldCart;
      dataCart.push(data);
    }
  } else {
    dataCart.push(data);
  }
  // dataCart.push(data);
  // if (!oldCart) {
  //   LocalStorage.set(`carts_${slug}`, dataCart);
  // } else {
  //   LocalStorage.set(`carts_${slug}`, [...oldCart, ...dataCart]);
  // }
  // const carts = LocalStorage.getItem(`carts_${slug}`);
  // const removeDuplicate = multiDimensionalUnique(carts);
  LocalStorage.set(`carts_${slug}`, dataCart);
}

export function getCart(slug) {
  return LocalStorage.getItem(`carts_${slug}`);
}

export function getSegment(segment) {
  const pathArray = window.location.pathname.split("/");
  return pathArray[segment];
}

export function removeItemCart(slug, product) {
  const oldCarts = LocalStorage.getItem(`carts_${slug}`);
  const newCarts = oldCarts.filter(v => {
    return v.id !== product.id;
  });
  LocalStorage.set(`carts_${slug}`, newCarts);
}

export function clearCart(slug) {
  LocalStorage.remove(`carts_${slug}`);
}

function multiDimensionalUnique(arr) {
  var uniques = [];
  var itemsFound = {};
  for (var i = 0, l = arr.length; i < l; i++) {
    var stringified = JSON.stringify(arr[i]);
    if (itemsFound[stringified]) {
      continue;
    }
    uniques.push(arr[i]);
    itemsFound[stringified] = true;
  }
  return uniques;
}

export function inCart(slug, product) {
  const carts = getCart(slug);
  if (carts !== null && carts.length > 0) {
    const filter = carts.filter(c => {
      return c.id === product.id;
    });
    if (filter && filter.length > 0) {
      return filter[0];
    }
  }
  return null;
}

export function setPriceProduct(product) {
  let basePrice = product.price;
  if (product.variant) {
    basePrice = product.variant.price;
  }
  // if (product.shops && product.shops.length > 0) {
  //   const comission = product.shops[0].pivot.custom_comission;
  //   return parseFloat(basePrice) + parseFloat(comission);
  // }
  return basePrice;
}

export function rebuildVariant(options) {
  const variantFromDb = options;
  // ----- handle variant -----
  const variant1 = variantFromDb[0].option.variant;
  const variant2 = variantFromDb[0].option2
    ? variantFromDb[0].option2.variant
    : {};
  // remap variant
  let variantSelectedUnique = [];
  variantSelectedUnique.push(variant1);
  if (variant2 && variant2.id) {
    variantSelectedUnique.push(variant2);
  }
  const varianSelectedRebuild = variantSelectedUnique.map(v => {
    return {
      label: v.name,
      key: v.id
    };
  });
  // ----- handle variant -----

  // ----- handle options -----
  let tempOptions = [];
  const options1 = variantFromDb.map(o => {
    return o.option;
  });
  const options2 = variantFromDb.map(o => {
    return o.option2;
  });
  tempOptions = [...options1, ...options2];
  const allOptions = tempOptions.filter(v => {
    return v != null;
  });
  const uniqAllOptions = uniqBy(allOptions, "name");

  let variantRebuild = [];
  varianSelectedRebuild.forEach(e => {
    const optionSelectedRebuild = uniqAllOptions
      .filter(f => {
        return parseInt(f.variant_id) === parseInt(e.key);
      })
      .map(v => {
        return {
          value: v.id,
          label: v.name
        };
      });
    variantRebuild.push({
      variant: e,
      variansOptions: optionSelectedRebuild
    });
  });
  return variantRebuild;
}

export function inPromotion(product) {
  const slug = getSegment(1);
  const currentStore = getStoreData(slug);
  const productPromotion = currentStore.promotions;
  let idProductInPromotion = [];
  let promotionSelected = null;
  productPromotion.forEach(promotion => {
    promotion.products.forEach(p => {
      idProductInPromotion.push(parseInt(p.product_id));
    });
  });

  if (idProductInPromotion.includes(parseInt(product.id))) {
    promotionSelected = productPromotion.filter(pro => {
      return pro.products.filter(p => {
        return parseInt(p.product_id) === parseInt(product.id);
      });
    });
    return promotionSelected[0];
  }
  return null;
  // return idProductInPromotion.includes(parseInt(product.id));
}

export function extractComission() {}
export function setPriceCart() {}
