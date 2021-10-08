import { SessionStorage, LocalStorage, Cookies } from "quasar";

export default function () {
  return {
    loading: false,

    manuscript: SessionStorage.getItem("currentManuscript"),
  };
}
