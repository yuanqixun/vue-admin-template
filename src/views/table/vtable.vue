<template>
  <div class="app-container">
    <vxe-table
      border
      show-overflow
      height="500"
      row-id="id"
      size="small"
      :loading="loading"
      :data="tableData"
      :seq-config="{startIndex: (tablePage.currentPage - 1) * tablePage.pageSize}"
    >
      <vxe-table-column type="checkbox" width="60" />
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="name" title="Name" sortable />
      <vxe-table-column field="sex" title="Sex" />
      <vxe-table-column field="age" title="Age" />
      <vxe-table-column field="rate" title="Rate" />
    </vxe-table>
    <vxe-pager
      background
      size="small"
      :loading="loading"
      :current-page="tablePage.currentPage"
      :page-size="tablePage.pageSize"
      :total="tablePage.totalResult"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change="handlePageChange"
    />
  </div>
</template>
<script>
import Vue from 'vue'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
import { getList } from '@/api/table'
Vue.use(VXETable)

export default {
  components: {},
  data() {
    return {
      loading: false,
      tableData: [],
      tablePage: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
      }
    }
  },
  created() {
    this.findList()
  },
  methods: {
    findList() {
      this.loading = true
      const currentPage = this.tablePage.currentPage
      const pageSize = this.tablePage.pageSize
      getList({ currentPage, pageSize }).then(({ code, data }) => {
        if (code === 20000) {
          this.tableData = data.items
          this.tablePage.totalResult = data.totalResult
        }
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      this.findList()
    }
  }
}
</script>
