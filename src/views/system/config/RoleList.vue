<template>
  <div class="app-container">
    <el-row class="text-left el-collapse-item active">
      <el-form :model="searchForm" ref="searchForm" :inline="true">
        <el-form-item label="角色名称:" prop="name"
                      :rules="[
                        { required: true, message: '请输入角色名称', trigger: 'blur' }
                        ]"
        >
          <el-input v-model="searchForm.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" size="small" @click="btnDoSearch">查询</el-button>
          <el-button type="" size="small" @click="btnDoReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <vxe-toolbar>
      <template v-slot:buttons>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="btnDoAdd">新增</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="btnDoRefresh">刷新</el-button>
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
    <vxe-pager v-if="tablePage.totalPage > 1"
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
import { getEditRoleList } from '@/api/role'
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
        totalResult: 0,
        totalPage: 0
      }
    }
  },
  created() {
    this.findList()
  },
  methods: {
    findList() {
      this.loading = true
      const pageNumber = this.tablePage.currentPage
      const pageSize = this.tablePage.pageSize
      const searchParams = this.searchForm
      getEditRoleList({ pageNumber, pageSize}, searchParams).then(res => {
        if (res.success) {
          this.tableData = res.data
          this.tablePage.totalResult = res.total
          this.tablePage.totalPage = res.totalPage
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
    },
    btnDoSearch() {
      this.$refs.searchForm.validate((valid) => {
        if (valid) {
          this.findList()
        }
      })
    },
    btnDoReset() {
      this.searchForm.name = ''
      this.findList()
      this.$refs.searchForm.resetFields()
    },
    btnDoAdd() {
      this.$router.push({
        path:'/system/config/RoleDetail'
      })
    },
    btnDoRefresh() {
      this.findList()
    }
  }
}
</script>
