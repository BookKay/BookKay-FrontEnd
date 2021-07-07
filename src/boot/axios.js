import Vue from "vue";
import axios from "axios";

import { Cookies, LocalStorage } from "quasar";
import store from "src/store/index";

Vue.prototype.$axios = axios;

//const api = axios.create({ baseURL: "http://localhost:5000/api/v1.0/" });
const api = axios.create({ baseURL: "/api/v1.0/" });
Vue.prototype.$api = api;

export default ({ router }) => {
  api.interceptors.request.use(request => {
    console.log("request", request);

    return request;
  });

  api.interceptors.response.use(
    response => {
      return response;
    },
    function(error) {
      const originalRequest = error.config;

      console.log("error request", originalRequest);
      console.log("error", error);
      console.log("error response", error.response);

      if (error.response.status === 401 && originalRequest.url == "refresh") {
        error.response.data.message = "Please login again";
        router.push({ name: "home-sign-in" });
        return Promise.reject(error);
      }

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        api.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get(
          "refreshToken"
        )}`;

        return api.post("refresh").then(res => {
          if (res.status === 200) {
            const user = res.data.user;
            const accessToken = res.data.access_token;
            Cookies.set("accessToken", accessToken, { expires: "60d" });
            LocalStorage.set("user", user);

            api.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${accessToken}`;

            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

            return api(originalRequest);
          }
        });
      }
      return Promise.reject(error);
    }
  );
};

export { axios, api };
