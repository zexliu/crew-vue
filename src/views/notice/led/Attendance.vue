<template>
  <div>
    <a-row>
      <a-button
        icon="fullscreen"
        style="float:right;"
        size="large"
        @click="onFullscreenClick"
      />
    </a-row>
    <div id="components-layout-container">
      <a-layout id="layout-container">
        <a-layout>
          <a-layout-header>
            <marquee
              onMouseout="this.start()"
              onMouseover="this.stop()"
              class="marquee"
              v-html="welcomeString"
            ></marquee>
          </a-layout-header>
          <a-layout-content>
            <a-table
              class="table"
              :columns="columns"
              :data-source="tableData"
              :pagination="{ hideOnSinglePage: true }"
              :row-key="record => record.routeItemNo"
              bordered
            >
              <template slot="title">
                实时考勤信息
              </template>
              <span slot="staffTeamId" slot-scope="staffTeamId">
                {{ getStaffTeamName(staffTeamId) }}
              </span>
              <span slot="staffGroupId" slot-scope="staffGroupId">
                {{ getStaffGroupName(staffGroupId) }}
              </span>
              <span slot="backStationId" slot-scope="backStationId">
                {{ getStationName(backStationId) }}
              </span>
              <span slot="meetStationId" slot-scope="meetStationId">
                {{ getStationName(meetStationId) }}
              </span>
              <span slot="attendanceStationId" slot-scope="attendanceStationId">
                {{ getStationName(attendanceStationId) }}
              </span>
            </a-table>
          </a-layout-content>
        </a-layout>

        <a-layout-sider width="20%">
          <div class="safe-container">安全行驶{{ safeDays }}天</div>
          <marquee
            class="marquee-y"
            direction="up"
            v-html="standardString"
            onMouseout="this.start()"
            onMouseover="this.stop()"
          >
          </marquee>
        </a-layout-sider>
      </a-layout>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import moment from 'moment'

import { fetchList } from '@/api/common'
import { replaceAll } from '@/utils/string'
import screenfull from 'screenfull'
@Component({
  name: 'Led'
})
export default class extends Vue {
  get welcomeString() {
    let str = ''
    this.welcomes.forEach(e => {
      let tempStr = e.content
      if (e.params) {
        var paramsJson = JSON.parse(e.params)
        for (const key in paramsJson) {
          if (Object.prototype.hasOwnProperty.call(paramsJson, key)) {
            const item = paramsJson[key]
            let replaceStr = '\\${' + key + '}'
            var regExp = new RegExp(replaceStr, 'gm')
            tempStr = e.content.replace(regExp, item.toString())
          }
        }
      }
      str = str + tempStr
    })
    return str
  }

  get standardString() {
    let str = ''
    this.standards.forEach(e => {
      let tempStr = e.content
      if (e.params) {
        var paramsJson = JSON.parse(e.params)
        for (const key in paramsJson) {
          if (Object.prototype.hasOwnProperty.call(paramsJson, key)) {
            const item = paramsJson[key]
            let replaceStr = '\\${' + key + '}'
            var regExp = new RegExp(replaceStr, 'gm')
            tempStr = e.content.replace(regExp, item.toString())
          }
        }
      }
      str = str + tempStr
    })
    return str
  }

  columns = [
    {
      title: '交路号',
      dataIndex: 'routeItemNo'
    },
    {
      title: '机队',
      dataIndex: 'staffTeamId',
      scopedSlots: { customRender: 'staffTeamId' }
    },
    {
      title: '机组',
      dataIndex: 'staffGroupId',
      scopedSlots: { customRender: 'staffGroupId' }
    },
    {
      title: '司机工号',
      dataIndex: 'workNo'
    },
    {
      title: '司机姓名',
      dataIndex: 'realName'
    },
    {
      title: '计划出勤时间',
      dataIndex: 'attendanceAt'
    },
    {
      title: '实际出勤时间',
      dataIndex: 'realAttendanceAt'
    },
    {
      title: '计划退勤时间',
      dataIndex: 'backAt'
    },
    {
      title: '实际退勤时间',
      dataIndex: 'realBackAt'
    }
  ]
  welcomes: any[] = []
  standards: any[] = []
  marqueeKey = 0
  timer: any
  tableData: any[] = []
  stations: any[] = []
  staffTeams: any[] = []
  staffGroups: any[] = []

  safeDays = 0
  created() {
    this.fetch()
    fetchList('/api/v1/stations', { current: 1, size: 99999 }).then(
      (res: any) => {
        this.stations = res.records
      }
    )

    fetchList('/api/v1/staff/teams', {
      current: 1,
      size: 99999
    }).then((res: any) => {
      this.staffTeams = res.records
    })
    this.timer = setInterval(this.fetch, 60000)

    fetchList('/api/v1/staff/groups', {
      current: 1,
      size: 99999
    }).then((res: any) => {
      this.staffGroups = res.records
    })

    fetchList('/api/v1/safe/configs/latest', {}).then((res: any) => {
      let days = moment().diff(moment(res.safe1At, 'YYYY-MM-DD'), 'days')
      this.safeDays = days
    })
  }

  fetch() {
    fetchList('/api/v1/announcements', {
      current: 1,
      size: 10,
      announcementType: 1,
      validStatus: true,
      validTime: true
    }).then((res: any) => {
      this.welcomes = res.records
    })

    fetchList('/api/v1/announcements', {
      current: 1,
      size: 10,
      announcementType: 2,
      validStatus: true,
      validTime: true
    }).then((res: any) => {
      this.standards = res.records
    })

    fetchList('/api/v1/staff/attendances/led', { current: 1, size: 10 }).then(
      (res: any) => {
        this.tableData = res.records
      }
    )
  }

  beforeDestroy() {
    console.log('destroy')
    clearInterval(this.timer)
  }

  getStationName(id: string) {
    let item = this.stations.find((el: any) => {
      return el.id === id
    })
    return item ? item.stationName : ''
  }

  getStaffTeamName(id: string) {
    let item = this.staffTeams.find((el: any) => {
      return el.id === id
    })
    return item ? item.teamName : ''
  }

  getStaffGroupName(id: string) {
    let item = this.staffGroups.find((el: any) => {
      return el.id === id
    })
    return item ? item.groupName : ''
  }
  onFullscreenClick() {
    if (screenfull.isEnabled) {
      const element: any = document.getElementById('layout-container')
      screenfull.request(element)
    }
  }
}
</script>

<style lang="less" scoped>
#components-layout-container {
  margin-top: 16px;
  text-align: center;
}
#components-layout-container .ant-layout-header {
  background: black;
  height: 100px;
  text-align: center;
  line-height: 100px;
  // border-style: none none solid none;
  // border-width: 5px;
  border-color: red;
}

#components-layout-container .ant-layout-sider {
  background: black;
  height: 100%;
  // color: #fff;
  // border-style: none none none solid;
  // border-width: 5px;
  border-color: red;
}
#components-layout-container .ant-layout-content {
  background: black;
  color: #fff;
  height: calc(100% - 100px);
  line-height: 120px;
  padding: 16px;
  border-style: solid solid none none;
  border-color: red;
  border-width: 1px;
  border-radius: 0px;
}
#components-layout-container > .ant-layout {
  background: black;
  height: 100%;
  widows: 100%;
}
#container > .ant-layout:last-child {
  margin: 0;
}

.marquee {
  color: yellow;
  font-size: 35px;
}

.marquee-y {
  color: yellow;
  font-size: 35px;
  height: calc(100% - 100px);
  padding: 8px;
}
.safe-container {
  text-align: center;
  color: yellow;
  font-weight: bold;
  font-size: 35px;
  height: 100px;
  line-height: 100px;
  border-style: none none solid none;
  border-color: red;
  border-width: 1px;
}

.table {
  margin-top: 32px;
}

/deep/ .ant-table-thead > tr > th,
/deep/ .ant-table-tbody > tr > td {
  padding: 16px 16px;
  overflow-wrap: break-word;
  border-color: red;
  background: black;
  color: red;
}

/deep/ .ant-table-bordered .ant-table-body > table {
  border: 1px solid red;
  border-right: 0;
  border-bottom: 0;
}
/deep/ .ant-table-title {
  color: red;
  font-size: 35px;
  font-weight: bold;
}

/deep/ .ant-table-body {
  color: red;
  font-size: 20px;
  font-weight: bold;
}
// /deep/ .ant-table-bordered {
//   border-color: red;
// }

/deep/ .ant-table.ant-table-bordered .ant-table-title {
  border: 1px solid red;
}
</style>
