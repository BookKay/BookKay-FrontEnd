import { SessionStorage, LocalStorage, Cookies } from "quasar";

export default function() {
  return {
    status: "",
    refreshToken: Cookies.get("refreshToken"),
    accessToken: Cookies.get("accessToken"),
    user: LocalStorage.getItem("user")
  };
}
