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
            :items="membersMaped"
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
              <td class="text-xs-right">{{ props.item.selectedDate }}</td>
              <td class="text-xs-right">{{ props.item.lastAttendance }}</td>
              <td class="text-xs-right">{{ props.item.totalAttendance }}</td>
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
        </v-flex>
      </v-layout>

    </v-container>

</div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { format, getMonth, getMilliseconds } from "date-fns";
import { findMembersAttendance, FollowUpRoutesNames } from "libs/render";
import {
  EntityModelNames,
  Member,
  ApiStatus,
  DateFormat,
  FindQueryParams,
  MemberAttendanceQuery
} from "@elizer/shared";
import { MembersAttendance } from "libs/followup/attendance";
import { TableHeader, TablePagination } from "@elizer/members";

@Component({
  components: {}
})
export default class FollowUpHomePage extends Vue {
  /** query for search */
  private query: Partial<Member> = {};

  /** the total amount of result */
  private total = 0;
  /** limit of data retuned */
  private limit = 0;
  /** amount of data to skip */
  private skip = 0;

  /** modal condition for calender */
  private modal = false;

  /** Table Header configuration */
  headers: TableHeader<MembersAttendance>[] = [
    {
      text: "Full Name",
      value: "name",
      align: "center"
    },
    { text: "Gender", value: "gender", align: "center" },
    { text: "Phone No", value: "phoneNo", align: "center" },
    { text: "Church No", value: "churchNo", align: "center" },
    { text: "Date Attendance", value: "selectedDate", align: "center" },
    { text: "last Attendance", value: "lastAttendance", align: "center" },
    { text: "Total Attendance", value: "totalAttendance", align: "center" }
  ];

  /** member details array */
  private members: MembersAttendance[] = [];

  /** previous pagination */
  private prevPagination: TablePagination<MembersAttendance> = {} as any;

  /** the currently selected date */
  private currentDate = Date.now();

  async membersAttendance(
    query: Partial<MemberAttendanceQuery>,
    skip: number = 0
  ) {
    try {
      query.selectedDate = Number(format(this.selectedDate, "x"));
      const resp = await findMembersAttendance(query, { skip });
      if (resp.data) {
        this.members = resp.data;
        this.limit = resp.limit;
        this.skip = resp.skip + resp.limit;
        this.total = resp.total;
        this.$notify({
          type: "success",
          title: "Members Attendance",
          text: `successfully retrieved the members attendance details`
        });
        const { limit, skip, total } = resp;
        return;
      }
      throw new Error(resp.error);
    } catch (error) {
      this.$notify({
        title: "Members Attendance Failure",
        type: "error",
        text: (error as Error).message
      });
    }
  }

  /** changes the route to the member individual statics */
  memberProfile(member: MembersAttendance) {
    this.$router.push({
      name: FollowUpRoutesNames.Profile,
      params: { id: member.id as string }
    });
  }

  /** return selected date for the calender */
  get selectedDate() {
    return format(this.currentDate, DateFormat);
  }

  /** sets the calender dates */
  set selectedDate(date: string) {
    this.currentDate = Number(format(date, "x"));
  }

  /** returns the remapped members details */
  get membersMaped() {
    return this.members.map(e => {
      const { lastAttendance, ...others } = e;
      return { ...others, lastAttendance: format(lastAttendance, DateFormat) };
    });
  }

  set membersMaped(v: any) {}

  /** returns the pagination information */
  get pagination() {
    return {} as any;
  }

  /** updates pagination condition */
  set pagination(v: TablePagination<MembersAttendance>) {
    if (this.prevPagination.page !== v.page) {
      const miply = v.page < 2 ? 0 : 1;
      this.membersAttendance(this.query, this.limit * miply);
    }
    this.prevPagination = v;
  }

  get picker() {
    return format(this.currentDate, "YYYY-MM-DD");
  }

  set picker(date: string) {
    this.currentDate = Number(format(date, "x"));
    this.membersAttendance(this.query);
  }
}
</script>

<style lang="scss">
</style>
