<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>

<div>

<v-container>
    <v-layout row wrap>
      <v-flex xs6>
        <v-layout column>
          <v-flex v-if="chartData" d-flex>
             <dynam-chart :type="chartType"  :data="chartData" :options="chartOptions"></dynam-chart>
          </v-flex>
          <v-flex d-flex>
          <v-data-table
            :headers="headers"
            :items="attendanceList"
            :total-items="total"
            :rows-per-page-items="[5]"
            :pagination.sync="pagination"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td >{{ props.item.id }}</td>
              <td class="text-xs-right">{{ props.item.date }}</td>
            </template>
          </v-data-table>
          </v-flex>
        </v-layout>
      </v-flex>
      <!-- biodata -->
      <v-flex xs6>
        <v-layout column>
          <member-profile-page></member-profile-page>
        </v-layout>
      </v-flex>
      {{ image }}
    </v-layout>
  </v-container>

</div>

</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
  Member,
  EntityModelNames,
  Attendance,
  AttendanceStatus,
  DateFormat,
  Image
} from "@elizer/shared";
import {
  getApiFactory,
  loadMemberGraphData,
  findApiFactory
} from "libs/render";
import { TableHeader, TablePagination } from "@elizer/members";

import { format } from "date-fns";
import DynamChart from "../../shared/charts/dynam-chart.vue";
import { ChartData, ChartOptions } from "chart.js";
import { uniqBy } from 'lodash';
import MemberProfilePage from '../admin/member-profile-page.vue';

@Component({
  components: {
    MemberProfilePage,
    DynamChart
  }
})
export default class FollowUpStaticsPage extends Vue {
  /** user biodata details */
  private member: Member | null = null;
  /** user image */
  private image: string | null = null;

  /** chart type */
  private chartType = 'bar';
  /** chart data */
  private chartData: ChartData | null = null;

  /** selectedDate to start graph intervals */
  private selectedDate = Number(format(Date.now(), "x"));
  /** intervals  of graph data */
  private interval = 7;
  /** count of graph data required */
  private count = 5;
  /** attendance array ploted to the graph */
  private graphAttendance: Attendance[] = [];

  /** the total amount of result */
  private total = 0;
  /** limit of data retuned */
  private limit = 0;
  /** amount of data to skip */
  private skip = 0;

  /** Table Header configuration */
  headers: TableHeader<Attendance>[] = [
    {
      text: "Number",
      value: "id",
      align: "center"
    },
    { text: "Date", value: "date", align: "center" }
  ];

  /** member details array */
  private attendances: Attendance[] = [];

  /** previous pagination */
  private prevPagination: TablePagination<Attendance> = {} as any;

  private chartOptions: ChartOptions = {
    scales: {
      yAxes: [{ ticks: { beginAtZero: true } }]
    }
  };


  // get graph details
  async loadGraphDetails(id: string) {
    const { error, data } = await loadMemberGraphData({
      ownerId: id,
      selectedDate: this.selectedDate,
      interval: this.interval,
      count: this.count
    });
    if (data) {
      this.chartData = this.chartDataPreset(data);
      this.$notify({
        title: "Reterived Member Graph Data",
        type: "success",
        text: `successfully load member graph details`
      });
      return;
    }
    this.$notify({
      title: `Error loading Member Graph Data`,
      type: "error",
      text: `error while attempting to load  ${id} graph data`
    });
  }

  /** retrieves the image of the owner from the Database */

  async attendanceHistory(id: string, skip: number = 0) {
    try {
      const resp = await findApiFactory<Attendance, Partial<Attendance>>(
        EntityModelNames.Attendance,
        { id }
      );
      if (resp.data) {
        this.attendances = resp.data;
        this.limit = resp.limit;
        this.skip = resp.skip + resp.limit;
        this.total = resp.total;
        this.$notify({
          type: "success",
          title: "Member Attendance History",
          text: `successfully retrieved the member attendance history`
        });
        const { limit, skip, total } = resp;
        return;
      }
      throw new Error(resp.error);
    } catch (error) {
      this.$notify({
        title: "Members Attendance History",
        type: "error",
        text: (error as Error).message
      });
    }
  }

  // get attendance  table details
  /** returns the pagination information */
  get pagination() {
    return {} as any;
  }

  /** updates pagination condition */
  set pagination(v: TablePagination<Attendance>) {
    if (this.prevPagination.page !== v.page) {
      const miply = v.page < 2 ? 0 : 1;
      this.attendanceHistory(this.$route.params.id, this.limit * miply);
    }
    this.prevPagination = v;
  }

  get attendanceList() {
    return this.attendances.map((atnd, i) =>
      Object.assign({
        id: (i + 1).toString(),
        date: format(atnd.date, DateFormat)
      })
    );
  }

  /** cleans the attendance graph map to a valid chart data */
  chartDataPreset(attendances: Attendance[]): ChartData {
    const labels: string[] = [];
    const data = uniqBy(attendances, 'date').map(a => {
      labels.push(format(a.date, DateFormat));
      return (a.attendance === AttendanceStatus.Present) ? 1 : 0;
    });
    return {
        labels,
        datasets: [{
            data,
            label: 'Attendance graph'
        }]
    };
  }

  mounted() {
    const id = this.$route.params.id;
    this.loadGraphDetails(id);
    this.attendanceHistory(id);
  }

}
</script>

<style lang="scss">
</style>
