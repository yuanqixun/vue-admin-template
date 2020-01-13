<template>
  <div class="app-container">
    <vxe-grid
      border
      resizable
      height="500"
      size="small"
      :loading="loading"
      :seq-config="{startIndex: (tablePage.currentPage - 1) * tablePage.pageSize}"
      :pager-config="tablePage"
      :columns="tableColumn"
      :data="tableData"
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
      tablePage: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        align: 'left',
        pageSizes: [10, 20, 50, 100, 200, 500],
        layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
        perfect: true
      },
      tableColumn: [
        { type: 'seq', width: 60 },
        { type: 'checkbox', width: 50 },
        { field: 'name', title: 'Name' },
        { field: 'sex', title: 'sex' },
        { field: 'age', title: 'age' },
        { field: 'rate', title: 'rate', showOverflow: true }
      ],
      tableData: []
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
          this.tablePage.total = data.totalResult
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
