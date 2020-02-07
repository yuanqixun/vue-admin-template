<template>
  <div class="app-container">
    <el-row class="text-left el-collapse-item active">
      <el-form :inline="true">
        <el-form-item label="角色名称:">
          <el-input v-model="searchForm.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" size="small">查询</el-button>
          <el-button type="" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <vxe-toolbar>
      <template v-slot:buttons>
        <el-button type="primary" size="small" icon="el-icon-plus">新增</el-button>
        <el-button size="small" icon="el-icon-refresh">刷新</el-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      border
      show-overflow
      row-id="id"
      size="small"
      :loading="loading"
      :data="tableData"
      :seq-config="{startIndex: (tablePage.currentPage - 1) * tablePage.pageSize}"
    >
      <vxe-table-column type="seq" title="序号" align="center" width="60" />
      <vxe-table-column field="name" title="角色名称" width="300" />
      <vxe-table-column field="description" title="角色描述" />
      <vxe-table-column field="createdDate" title="创建日期" width="150" />
      <vxe-table-column title="操作" align="center" width="200">
        <template v-slot="{ row }">
          <router-link :to="{path:'/system/config/RoleDetail',query:{id:row.id}}">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </vxe-table-column>
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
import { getAdminRoleList } from '@/api/role'
export default {
  name: 'system_config_RoleList',
  components: {},
  data() {
    return {
      searchForm: {
        name: ''
      },
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
      getAdminRoleList({ currentPage, pageSize }).then(({ code, data }) => {
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
