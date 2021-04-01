import axios from "axios";
import { Notify } from "quasar";
import { getCredential, getApiCache, setApiCache } from "./storage";
import { handleTokenError } from "./helper";

// ***********************************************
// * PLEASE CHANGE FOLLOWING CONFIG in .env file *
// ***********************************************
export const baseApiUrl = process.env.BASE_API_URL;
export const baseWebUrl = process.env.BASE_WEB_URL;
const GET_TIMEOUT = 360000;
const POST_TIMEOUT = 120000;
const DOWNLOAD_TIMEOUT = 120000;

function isRedirectLogin(errorCode) {
  if (
    errorCode === 469 ||
    errorCode === 467 ||
    errorCode === 471 ||
    errorCode === 472
  ) {
    return true;
  }
  return false;
}

function UnexpectedError(message, details) {
  this.message = message;
  this.details = details;
}

export async function commonHttpErrorHandler(error, showErrorNotification) {
  let errorTitle = `Error: ${error.name} - ${error.message}`;
  let errorMessage = "";
  if (error.response) {
    // The request was made and the server responded with a status code that falls
    // out of the range of 2xx
    errorTitle = `Error ${error.response.status}`;

    if (isRedirectLogin(error.response.status)) {
      return handleTokenError();
    }

    let responseData = null;
    if (error.response.data) {
      if (error.response.data instanceof Blob) {
        responseData = await error.response.data.text();
        let parsedJsonData = null;
        try {
          parsedJsonData = JSON.parse(responseData);
        } catch (e) {
          parsedJsonData = null;
        }

        if (parsedJsonData) {
          responseData = parsedJsonData;
        }
      } else {
        responseData = error.response.data;
      }
    }

    if (responseData && responseData.message) {
      errorMessage = responseData.message;
    }

    if (responseData && responseData.errors) {
      const errorData = responseData.errors;
      const errorKeys = Object.keys(errorData);
      for (let i = 0; i < errorKeys.length; i++) {
        let temp = "";
        const details = errorData[errorKeys[i]];

        for (let j = 0; j < details.length; j++) {
          temp += `${details[j]}. `;
        }
        errorMessage += `${errorKeys[i]}: ${temp}`;
      }
    }

    if (!errorMessage && responseData) {
      errorMessage = JSON.stringify(responseData);
      errorMessage = errorMessage.substring(
        0,
        Math.min(errorMessage.length, 100)
      );
    }
  } else if (/^timeout of .*ms exceeded$/.test(error.message)) {
    errorTitle = "Error: Timeout";
    errorMessage = `Gagal memperoleh response setelah ${GET_TIMEOUT} ms`;
  } else {
    // Something happened in setting up the request that triggered an Error
    errorMessage = JSON.stringify(error);
    errorMessage = errorMessage.substring(
      0,
      Math.min(errorMessage.length, 100)
    );
  }

  if (showErrorNotification) {
    Notify.create({
      message: errorMessage,
      timeout: 5000,
      type: "negative",
      color: "negative",
      icon: "warning",
      detail: errorTitle
    });
  }

  throw error;
}
export function commonHttpSuccessHandler(start, { data }) {
  if (data && !data.errors) {
    return data;
  }
  throw new UnexpectedError("Server Error", data);
}

export function getHeader(
  isMultipartForm,
  useAuthHeader,
  bearerTokenOverride = null
) {
  let obj;
  if (isMultipartForm) {
    obj = {
      "Content-Type": "multipart/form-data"
    };
  } else {
    obj = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };
  }

  if (bearerTokenOverride) {
    obj.Authorization = `Bearer ${bearerTokenOverride}`;
  } else if (useAuthHeader && getCredential().accessToken != null) {
    obj.Authorization = `Bearer ${getCredential().accessToken}`;
    obj["x-access-id"] = getCredential().currentAccessId;
  }

  obj["Access-Control-Allow-Origin"] = "*";

  return obj;
}

export function get({
  path,
  params = {},
  cacheConfig = null,
  useAuthHeader = true,
  acceptHeader = "application/json",
  bearerTokenOverride = null,
  showErrorNotification = true
}) {
  return axios({
    baseURL: baseApiUrl,
    url: path,
    method: "GET",
    params,
    headers: {
      ...getHeader(false, useAuthHeader, bearerTokenOverride),
      Accept: acceptHeader
    },
    timeout: GET_TIMEOUT
  })
    .then(({ data }) => {
      if (data.data && !data.errors) {
        if (cacheConfig != null) {
          setApiCache(path, data, cacheConfig);
        }
        return data;
      }

      throw new UnexpectedError("Server Error", data);
    })
    .catch(error => {
      if (error.message === "Network Error") {
        const data = getApiCache(path);
        console.log(`>>> Get From Cache : ${JSON.stringify(data)}`);
        if (data != null) {
          return data;
        }
      }

      return commonHttpErrorHandler(error, showErrorNotification);
    });
}

export function post({
  path,
  params = {},
  useAuthHeader = true,
  isMultipartForm = false,
  showErrorNotification = true
}) {
  const start = Date.now();
  return axios
    .post(baseApiUrl + path, params, {
      headers: getHeader(isMultipartForm, useAuthHeader),
      timeout: POST_TIMEOUT
    })
    .then(response => commonHttpSuccessHandler(start, response))
    .catch(error => commonHttpErrorHandler(error, showErrorNotification));
}

export function put({
  path,
  params = {},
  useAuthHeader = true,
  isMultipartForm = false,
  showErrorNotification = true
}) {
  const start = Date.now();
  return axios
    .put(baseApiUrl + path, params, {
      headers: getHeader(isMultipartForm, useAuthHeader),
      timeout: POST_TIMEOUT
    })
    .then(response => commonHttpSuccessHandler(start, response))
    .catch(error => commonHttpErrorHandler(error, showErrorNotification));
}

export function del({
  path,
  params = {},
  useAuthHeader = true,
  isMultipartForm = false,
  showErrorNotification = true
}) {
  const start = Date.now();
  return axios({
    url: baseApiUrl + path,
    method: "delete",
    params,
    headers: getHeader(isMultipartForm, useAuthHeader),
    timeout: POST_TIMEOUT
  })
    .then(response => commonHttpSuccessHandler(start, response))
    .catch(error => commonHttpErrorHandler(error, showErrorNotification));
}

export function freeDownload(url, showErrorNotification = true) {
  const start = Date.now();
  return axios({
    url: url,
    method: "GET",
    responseType: "blob"
  })
    .then(response => commonHttpSuccessHandler(start, response))
    .catch(error => commonHttpErrorHandler(error, showErrorNotification));
}


export function download({
  method = "GET",
  path,
  params = {},
  data = null,
  useAuthHeader = true,
  isMultipartForm = false,
  showErrorNotification = true,
  filenameOk
}) {
  // const start = Date.now();
  return axios({
    baseURL: baseApiUrl + path,
    path,
    method,
    params,
    data,
    headers: getHeader(isMultipartForm, useAuthHeader),
    timeout: DOWNLOAD_TIMEOUT,
    responseType: "blob"
  })
    .then(response => {
      // reportTrackTiming(start, response);
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;

      const header = response.headers["content-disposition"];
      let filename = "file";

      if (header) {
        const startIndex = header.indexOf("filename=") + 9;
        const endIndex = header.length;
        if (startIndex > -1) {
          filename = header.substring(startIndex, endIndex);
          if (filename[0] === '"') {
            filename = filename.substring(1);
          }
          if (filename[filename.length - 1] === '"') {
            filename = filename.substring(0, filename.length - 1);
          }
        }
      }
      console.log(filenameOk);

      if (filenameOk) {
        filename = filenameOk;
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return response;
    })
    .catch(error => commonHttpErrorHandler(error, showErrorNotification));
}
