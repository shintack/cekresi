import { post, get, put, del, download } from "./HttpHelper";

export function refreshToken(params, requestOptions = {}) {
  // const refreshParams = {
  //   ...params,
  //   grant_type: "refresh_token",
  //   client_id: process.env.CLIENT_ID,
  //   client_secret: process.env.CLIENT_SECRET
  // };
  // return post({
  //   path: "oauth/token",
  //   params: refreshParams,
  //   ...requestOptions
  // });
  return get({
    path: "api/v1/profile",
    bearerTokenOverride: null
  });
}

export function login(params, requestOptions = {}) {
  const loginParams = {
    ...params,
    grant_type: "password",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  };

  return post({
    path: "oauth/token",
    params: loginParams,
    ...requestOptions
  });
}

export function requestOtp(params, requestOptions = {}) {
  const loginParams = {
    ...params,
    grant_type: "password",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  };

  return post({
    path: "api/v1/otp",
    params: loginParams,
    ...requestOptions
  });
}

export function loginOtp(params, requestOptions = {}) {
  const loginParams = {
    ...params,
    grant_type: "password",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  };

  return post({
    path: "api/v1/login",
    params: loginParams,
    ...requestOptions
  });
}

export function register(params, requestOptions = {}) {
  const registerParams = {
    ...params
  };

  return post({
    path: "api/v1/register",
    params: registerParams,
    ...requestOptions
  });
}

export function requestOtpWa(params) {
  return post({
    path: "api/v1/otp",
    params: params
  });
}

export function validateOtpWa(params) {
  return post({
    path: "api/v1/validate-otp",
    params: params
  });
}

/**
 * API PRODUCT
 */

export function productList(params) {
  return get({
    path: "api/v1/product",
    params
  });
}

export function productDetail(id) {
  return get({
    path: `api/v1/product/${id}`
  });
}

/**
 * API CHECKOUT
 */

export function courierList(params) {
  return get({
    path: "api/v1/couriers",
    params
  });
}

export function cityList(params) {
  return get({
    path: "api/v1/shipping/city",
    params
  });
}

export function districtsList(id) {
  return get({
    path: `api/v1/shipping/district/${id}`
  });
}

export function checkOngkir(params) {
  return get({
    path: "api/v1/courier/ongkir",
    params
  });
}

export function checkGuestOngkir(params) {
  return post({
    path: "api/v1/shipping/calculate",
    params
  });
}

/*
export function myCart(params) {
  return get({
    path: "api/v1/cart/me",
    params
  });
}

export function addToCart(params) {
  return post({
    path: "api/v1/cart/addtocart",
    params
  });
}

export function deleteCart(id) {
  return del({
    path: `api/v1/cart/${id}/delete`
  });
}
*/

/**
 * API STORE
 */

export function listStore(params) {
  return get({
    path: "api/v1/store",
    params
  });
}

export function getStore(slug, params) {
  return get({
    path: `api/v1/store/${slug}`,
    params
  });
}

export function getStoreCategory(slug, params) {
  return get({
    path: `api/v1/store/${slug}/catgeories`,
    params
  });
}

export function getStoreProduct(slug, params) {
  return get({
    path: `api/v1/store/${slug}/product`,
    params
  });
}

export function getStoreProductDetail(slug, id, params) {
  return get({
    path: `api/v1/store/${slug}/product/${id}`,
    params
  });
}
/*
export function myStore() {
  return get({
    path: "api/v1/shop/me"
  });
}

export function myStoreUpdate(id, params) {
  return put({
    path: `api/v1/shop/me/${id}`,
    params
  });
}

export function productMyStore(params) {
  return get({
    path: "api/v1/shop/me/products",
    params
  });
}

export function addToMyStore(params) {
  return post({
    path: "api/v1/shop/me",
    params
  });
}

export function removeFromMyStore(id) {
  return del({
    path: `api/v1/shop/me/products/${id}`
  });
}
*/
/**
 * API USERS
 */

export function profile({ bearerTokenOverride = null }) {
  return get({
    path: "api/v1/my-profile",
    bearerTokenOverride
  });
}
/*
export function updateProfile(params) {
  return post({
    path: "api/v1/update-profile",
    params
  });
}

export function userList(params) {
  return get({
    path: "api/v1/user",
    params
  });
}

export function userShow(id) {
  return get({
    path: `api/v1/user/${id}`
  });
}

export function userUpdate(id, params) {
  return put({
    path: `api/v1/user/${id}`,
    params
  });
}
*/
/**
 * ORDER
 */
export function createCustomerOrder(params) {
  return post({
    path: `api/v1/customer-order`,
    params
  });
}

export function myOrder(params) {
  return get({
    path: `api/v1/my-order`,
    params
  });
}

export function createGuestOrder(params) {
  return post({
    path: `api/v1/guest-order`,
    params
  });
}

export function orderDetail(id, params) {
  return get({
    path: `api/v1/shop/order/${id}`,
    params
  });
}

export function orderPay(id, params) {
  return post({
    path: `api/v1/shop/order/${id}/pay`,
    params
  });
}

export function orderPayment(id, params) {
  return post({
    path: `api/v1/shop/order/${id}/payment`,
    params
  });
}

export function orderCancel(id, params) {
  return post({
    path: `api/v1/shop/order/${id}/cancel`,
    params
  });
}

export function createCustomer(params) {
  return post({
    path: "api/v1/shop/customer",
    params
  });
}

export function updateCustomer(id, params) {
  return put({
    path: `api/v1/shop/customer/${id}`,
    params
  });
}

export function addToCart() {}

export function deleteCart() {}

export function downloadInvoice(id, params, filenameOk) {
  return download({
    path: `api/v1/shop/payment/${id}/invoice`,
    params,
    filenameOk
  });
}

export function orderDelivery() {}
export function orderFinish() {}
export function paymentInValid() {}
export function paymentValid() {}
export function trackShipping() {}

/**
 * cek resi app
 */

export function listCouriers() {
  return get({
    path: `api/v1/cekresi/couriers`
  });
}

export function listCouriersWaybill() {
  return get({
    path: `api/v1/cekresi/couriers-waybill`
  });
}

export function tracking(params) {
  return post({
    path: `api/v1/cekresi/track`,
    params
  });
}

export function postage(params) {
  return post({
    path: `api/v1/cekresi/postage`,
    params
  });
}
