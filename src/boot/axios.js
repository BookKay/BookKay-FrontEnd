import { boot } from "quasar/wrappers";
import axios from "axios";
import { Cookies, LocalStorage, Notify } from "quasar";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
let baseURL = "";
if (process.env.DEV) {
  //baseURL = "http://localhost:8000/api/v1.0/";
  baseURL = " https://bookkay-backend-dev.herokuapp.com/api/v1.0/";
} else {
  //baseURL = "api.bookkay.com/api/v1.0/";
  baseURL = " https://bookkay-backend.herokuapp.com/api/v1.0/";
}
const api = axios.create({ baseURL: baseURL });

export default boot(({ app, router }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API

  api.interceptors.request.use((request) => {
    return request;
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    function (error) {
      const originalRequest = error.config;

      //Logging out the errors
      console.log("error request", originalRequest);
      console.log("error", error);
      console.log("error response", error.response);

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
            refresh: Cookies.get("refreshToken"),
          })
          .then((res) => {
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
});

export { api };
