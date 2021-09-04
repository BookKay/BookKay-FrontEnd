import Vue from "vue";
import axios from "axios";

import { Cookies, LocalStorage, Notify } from "quasar";
import store from "src/store/index";

let baseURL = "";
if (process.env.DEV) {
  baseURL = "http://localhost:8000/api/v1.0/";
} else {
  baseURL = "api.bookkay.com/api/v1.0/";
}

Vue.prototype.$axios = axios;

//const api = axios.create({ baseURL: "http://localhost:5000/api/v1.0/" });
const api = axios.create({ baseURL: baseURL });
Vue.prototype.$api = api;

export default ({ router }) => {
  api.interceptors.request.use(request => {
    return request;
  });

  api.interceptors.response.use(
    response => {
      return response;
    },
    function(error) {
      const originalRequest = error.config;

      //Logging out the errors
      console.log("error request", originalRequest);
      console.log("error", error);
      console.log("error response", error.response);

      /*
      //Notifying the user about the error(s) based on the reply from the server
      const responseData = error.response.data;

      let msg = "";
      if (responseData) {
        if (Array.isArray(responseData)) {
          for (const val of responseData) {
            let detail = val.charAt(0).toUpperCase() + val.slice(1);

            msg = msg + "<div>" + detail.replaceAll("_", " ") + "</div>";
          }
        }
        if (responseData.constructor == Object) {
          for (const key in responseData) {
            if (Array.isArray(responseData[key])) {
              for (const val of responseData[key]) {
                let cause = key.charAt(0).toUpperCase() + key.slice(1);
                let detail = val.charAt(0).toUpperCase() + val.slice(1);

                msg =
                  msg +
                  "<div>" +
                  cause.replaceAll("_", " ") +
                  " - " +
                  detail.replaceAll("_", " ") +
                  "</div>";
              }
            }
          }
        }
        Notify.create({
          message: msg,
          html: true,
          color: "negative",
          icon: "error",
          process: true,
          position: "top",
          multiLine: true
        });
      }*/

      //When error status is unauthenticated and requested url is refresh,
      //it shows that the refresh token is expired.
      //So, we redirect the user to login page.
      if (
        error.response.status === 401 &&
        originalRequest.url == "token/refresh"
      ) {
        error.response.data.message = "Please login again";
        router.push({ name: "home-sign-in" });
        return Promise.reject(error);
      }

      //If status is unauthenticated and is not retried yet, send a
      //post request to ask for new access token and save it.
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        return api
          .post("token/refresh", {
            refresh: Cookies.get("refreshToken")
          })
          .then(res => {
            if (res.status === 200) {
              const accessToken = res.data.access;
              Cookies.set("accessToken", accessToken, { expires: "60d" });

              api.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${accessToken}`;

              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${accessToken}`;

              return api(originalRequest);
            }
          });
      }
      return Promise.reject(error);
    }
  );
};

export { axios, api };
