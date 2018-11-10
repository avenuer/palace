import { Module, ActionContext } from "vuex";
import { Organization } from "@elizer/shared";
import {
  retrieveLiensce,
  deleteLiensce,
  OrgModuleActions,
  OrgModuleMutations,
  OrgModuleGetters
} from "libs/render";

interface OrganizationState {
  organization: Partial<Organization>;
  error?: string;
}

type rootState = any;

type organizationState = ActionContext<Partial<OrganizationState>, rootState>;

const { DeleteLiensce, RetrieveLiensce } = OrgModuleActions;
const { SetOrg } = OrgModuleMutations;

const organization: Module<Partial<OrganizationState>, any> = {
  state: {},
  actions: {
    [RetrieveLiensce]: async ({ state }: organizationState) => {
      const { data, error } = await retrieveLiensce();
      state.error = error;
      state.organization = data;
    },

    [DeleteLiensce]: async (ctx: organizationState) => {
      const { data, error } = await deleteLiensce();
      ctx.state.error = error;
      ctx.commit(`[${SetOrg}]`, organization);
      ctx.state.organization = data ? {} : ctx.state.organization;
    }
  },
  mutations: {
    [SetOrg]: (ctx, org: Partial<Organization>) => {
      ctx.organization = org;
    }
  },
  getters: {
    [OrgModuleGetters.organization]: ctx => {
      return ctx.organization;
    },
    [OrgModuleGetters.orgId]: ({ organization }) => {
      return organization ? organization.id : organization;
    }
  }
};

export default organization;
