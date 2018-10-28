<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>

<div>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12>
          <!-- date picker start -->
          <div >
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
          </div>
          <!-- date picker end -->
          <!-- user search input start -->
          <div>
            <v-text-field
              v-model="memberNos"
              label="Church Nos"
              placeholder="use comma (,) to seperate mutiple numbers"
              required
            ></v-text-field>
            <v-btn @click="searchMembers(memberNos)" block color="primary" dark> Search </v-btn>
          </div>
          <!-- user search input end -->
        </v-flex>
          
        <v-flex xs12 >
          
          <v-data-table
            :headers="headers"
            :items="membersMaped"
            :total-items="membersMaped.length"
            :rows-per-page-items="[membersMaped.length]"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td  @click="memberProfile(props.item)" >{{ props.item.name }}</td>
              <td class="text-xs-right">{{ props.item.phoneNo }}</td>
              <td class="text-xs-right">{{ props.item.gender }}</td>
              <td class="text-xs-right">{{ props.item.churchNo }}</td>
              <td class="text-xs-right">{{ props.item.textstatus }}</td>
              <td class="text-xs-center">
                  <v-icon
                    v-if=" props.item.textstatus === 'Absent'"
                    large
                    class="mr-2"
                    @click="markAttendance(props.item)"
                  >
                    check_circle_outline
                  </v-icon>
                  <v-icon
                    v-if=" props.item.textstatus === 'Present'"
                    large
                    class="mr-2"
                  >
                    cancel
                  </v-icon>
                </td>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
<v-btn
        absolute
        dark
        fab
        top
        right
        color="primary"
        @click="markAll()"
      >
        <v-icon>tick</v-icon>
      </v-btn>

    </v-container>

</div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ElizerMemberBiodata from "../../shared/member/member-profile.vue";

import { format, getDate } from "date-fns";
import {
  findApiFactory,
  createApiFactory,
  registerHistory,
  FollowUpRoutesNames
} from "libs/render";
import {
  Attendance,
  EntityModelNames,
  Member,
  AttendanceStatus,
  DateFormat,
  RegisterQuery,
  RegisterAttendance
} from "@elizer/shared";
import { TableHeader, TablePagination } from "@elizer/members";

// Errors during operations
const noUserError = new Error("user with the no not found");
const userAlreadyMarkedError = new Error(
  "user with the no has already marked his/her attendance"
);
const userAttendanceCreationFail = new Error(
  "user attendance failed during creation"
);

interface RegisterAttendanceHeader extends RegisterAttendance {
  index: number;
  textstatus: string;
}

@Component({
  components: {
    ElizerMemberBiodata
  }
})
export default class AttendanceRegisterPage extends Vue {
  // align center for button
  center = true;

  // open calender modal
  modal = false;

  // date to be marked for
  public selectedDate = Number(format(format(Date.now(), DateFormat), "x"));

  // memberNos no of the attendance owner
  public memberNos = "";

  // list of members register
  public members: RegisterAttendance[] = [];

  /** Table Header configuration */
  headers: TableHeader<RegisterAttendanceHeader>[] = [
    {
      text: "Full Name",
      value: "name",
      align: "center"
    },
    { text: "PhoneNo", value: "phoneNo", align: "center" },
    { text: "Gender", value: "gender", align: "center" },
    { text: "Church No", value: "churchNo", align: "center" },
    { text: "Attendance Status", value: "status", align: "center" },
    { text: "Action", value: "status", align: "center" },
  ];

  // locates the user and displays the user for confrmation
  async searchMembers(nos: string) {
    try {
      this.getMembersHistory(nos.split(",").map(Number), this.selectedDate);
    } catch (error) {
      this.$notify({
        title: "Error Searching Member No",
        text: (error as Error).message,
        type: "error"
      });
    }
  }

  // mark the user attendance to the database
  async markAttendance(register: RegisterAttendanceHeader) {
    try {
      const { index, ...member } = register;
      const attendance = await createApiFactory<
        Attendance,
        Partial<Attendance>
      >(EntityModelNames.Attendance, {
        owner: member.owner,
        date: this.selectedDate,
        attendance: AttendanceStatus.Present,
        // TODO: overide organization to be dynamic for individual organizations
        organization: `RCCG Jesus Palace`
      });
      if (attendance.data) {
        //  handle success
        this.members[index].status = AttendanceStatus.Present;
        this.$notify({
          title: "Attendance Register",
          type: "success",
          text: `marked attendance for ${member.name}`
        });
        return;
      }
      // futher expansion add organizationId to member creation
      throw new Error(attendance.error) || userAttendanceCreationFail;
    } catch (error) {
      this.$notify({
        title: "Error While marking Attendance",
        text: (error as Error).message,
        type: "error"
      });
    }
  }

  markAll() {
    this.membersMaped.forEach((e, i) => this.markAttendance({ ...e, index: i }));
  }

  // get the members date history which is the owner of the userNos
  async getMembersHistory(nos: number[], date: number) {
    // futher expansion request orginzationId for the memebr before query
    const res = await registerHistory({ date, no: nos });
    if (res.data) {
      this.members = res.data;
      this.$notify({
        type: "success",
        text: `retrieved the details of ${res.data.length} members`,
        title: "Register"
      });
      return;
    }
    this.$notify({
      type: "failure",
      text: `failed to retrieve members details`,
      title: "Register"
    });
  }

  // confirm attedance if user had been marked before
  async getAttendance(member: Member) {
    const attendance = await findApiFactory<Attendance, Partial<Attendance>>(
      EntityModelNames.Attendance,
      { owner: member.id, date: this.selectedDate }
    );
    if (attendance.data && attendance.data.length > 0) {
      throw userAlreadyMarkedError;
    }
    return member;
  }

  // open member followup profile page
  memberProfile(member: RegisterAttendanceHeader) {
    this.$router.push({
      name: FollowUpRoutesNames.Profile,
      params: { id: member.owner as string }
    });
  }

  /** returns the remapped members details */
  get membersMaped(): RegisterAttendanceHeader[] {
    return this.members.map((e, index) => {
      return {
        ...e,
        index,
        textstatus: e.status === AttendanceStatus.Present ? "Present" : "Absent"
      };
    });
  }

  get picker() {
    return format(this.selectedDate, "YYYY-MM-DD");
  }

  set picker(date: string) {
    this.selectedDate = Number(format(format(date, DateFormat), "x"));
  }
}
</script>

<style lang="scss">
</style>
