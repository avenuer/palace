<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>

<div>

    <v-container fluid>

      <v-layout row wrap>
        <v-flex xs12>
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="picker"
            persistent
            lazy
            full-width
            width="290px"
          >
            <v-text-field
              slot="activator"
              v-model="picker"
              label="Picker in dialog"
              prepend-icon="event"
              readonly
            ></v-text-field>
            <v-date-picker color="green lighten-1" v-model="picker" scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.dialog.save(picker)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-flex>

        <v-flex xs12>
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
              <td class="text-xs-right">{{ props.item.day }}</td>
              <td class="text-xs-right">{{ props.item.department }}</td>
              <td class="justify-center layout px-0">
                  <v-icon
                    large
                    class="mr-2"
                    @click="memberProfile(props.item)"
                  >
                    more_vert
                  </v-icon>
                </td>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>

    </v-container>

</div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { format, getMonth } from "date-fns";
import { findApiFactory, AdminRoutesNames } from "libs/render";
import {
  EntityModelNames,
  Member,
  ApiStatus,
  DateFormat
} from "@elizer/shared";
import { TableHeader, TablePagination } from "@elizer/members";

@Component({
  components: {}
})
export default class BirthDayPage extends Vue {
  // open calender modal
  modal = false;

  // currently selected date
  selectedDate = Number(format(format(Date.now(), DateFormat), "x"));

  headers: TableHeader<Member>[] = [
  {
    text: "Full Name",
    value: "name",
    align: "center"
  },
  { text: "Gender", value: "gender", align: "center" },
  { text: "Phone No", value: "phoneNo", align: "center" },
  { text: "Day", value: "day", align: "center" },
  { text: "Department", value: "department", align: "center" },
  { text: "Profile", value: "department", align: "left" }
];

  // members to be displayed
  public members: Member[] = [];

  // loading status
  public status = ApiStatus.Success;

  // amount to skip for query
  private skip = 0;

  // amount of data returned
  private limit = 0;

  // amount of members found
  private total = 0;

  private prevPagination: TablePagination<Member> = {} as any;

  async monthBirthDays(month: string, skip: number = 0) {
    this.skip = skip;
    const res = await findApiFactory<Member, Partial<Member>>(
      EntityModelNames.Member,
      { month },
      { skip }
    );
    if (res.data) {
      // paginate
      this.members = res.data;
      this.limit = res.limit;
      this.skip = res.skip + res.limit;
      this.total = res.total;
      this.status = res.status;
    }
    // handle error
    this.status = res.status;
  }

  /** loads the member biodata profile page */
  memberProfile(member: Member) {
    console.log(member.id);
    this.$router.push({
      name: AdminRoutesNames.MemberProfile,
      params: { id: member.id as string }
    });
  }

  get picker() {
    return format(this.selectedDate, "YYYY-MM-DD");
  }

  set picker(date: string) {
    this.selectedDate = Number(format(format(date, DateFormat), "x"));
    this.monthBirthDays(format(this.selectedDate, "MMMM"), 0);
  }

  get currentMonth() {
    return format(this.selectedDate, "MMMM");
  }

  set currentMonth(date: string) {}

    get pagination() {
    return {} as any;
  }

  set pagination(v: TablePagination<Member>) {
    if (this.prevPagination.page !== v.page) {
      const miply = (v.page < 2) ? 0 : 1;
      this.monthBirthDays(this.currentMonth, this.limit * miply);
    }
    this.prevPagination = v;
  }
}
</script>

<style lang="scss">

</style>
