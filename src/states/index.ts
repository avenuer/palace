import { StoreOptions } from "vuex";
import organization from "./organisation";
import { StoreModules } from "libs/render";

const storeOptions: StoreOptions<any> = {
  modules: {
    [StoreModules.Organization]: organization
  }
};

export default storeOptions;
