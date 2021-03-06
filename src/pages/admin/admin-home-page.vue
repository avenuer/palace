<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>

<div>
<router-view></router-view>
    <v-container fluid>
      <v-data-table
    :headers="headers"
    :items="members"
    :total-items="total"
    :rows-per-page-items="[15]"
    :pagination.sync="pagination"
    class="elevation-1"
  >
    <template slot="items" slot-scope="props">
      <td >{{ props.item.name }}</td>
      <td class="text-xs-right">{{ props.item.gender }}</td>
      <td class="text-xs-right">{{ props.item.phoneNo }}</td>
      <td class="text-xs-right">{{ props.item.churchNo }}</td>
      <td class="justify-center layout px-0">
          <v-icon
            small
            class="mr-2"
            @click="memberProfile(props.item)"
          >
            edit
          </v-icon>
        </td>
    </template>
  </v-data-table>

    </v-container>

</div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ElizerMemberBiodata from "../../shared/member/member-profile.vue";
import { findApiFactory, AdminRoutesNames } from "libs/render";
import { EntityModelNames, Member, FindQueryParams } from "@elizer/shared";
import { TableHeader, TablePagination } from "@elizer/members";

@Component({
  components: {
    ElizerMemberBiodata
  }
})
export default class AdminHomePage extends Vue {
  /** table headers */
  headers: TableHeader<Member>[] = [
    {
      text: "Full Name",
      value: "name",
      align: "center"
    },
    { text: "Gender", value: "gender", align: "center" },
    { text: "Phone No", value: "phoneNo", align: "center" },
    { text: "Church No", value: "churchNo", align: "center" }
  ];

  /** total numbers of memebers */
  total: number = 0;
  /** the amount of members of memebers recieved during request */
  limit: number = 0;

  /** members to be displayed */
  members: Member[] = [];

  /** current query state */
  query: Partial<Member> = {};

  /** gets the members stored in the database */
  async getMembers(
    query: Partial<Member> = {},
    custom: Partial<FindQueryParams> = {}
  ) {
    const response = await findApiFactory<Member, Partial<Member>>(
      EntityModelNames.Member,
      query,
      custom
    );
    if (response.error) {
      // handle error
      this.$notify({
        title: "Error Querying Members",
        text: response.error,
        type: "error"
      });
      return;
    }

    this.members = response.data || [];
    this.total = response.total;
    this.limit = response.limit;
    this.$notify({
      title: "Success Querying Members",
      text: `Retrieved members successfull`,
      type: "success"
    });
  }

  memberProfile(member: Member) {
    // navigate route to profile
    console.log(member.id);
    this.$router.push({
      name: AdminRoutesNames.MemberProfile,
      params: { id: member.id as string }
    });
  }

  mounted() {}

  get pagination() {
    return {} as any;
  }

  set pagination(v: TablePagination<Member>) {
    const miply = v.page < 2 ? 0 : 1;
    this.getMembers(this.query, { skip: this.limit * miply });
  }
}
</script>

