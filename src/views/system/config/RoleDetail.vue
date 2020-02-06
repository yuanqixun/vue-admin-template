<template>
  <div class="app-container">
    <el-row class="text-left el-collapse-item active">
      <el-form label-width="80px" label-position="right">
        <el-form-item label-width="0px">
          <el-button type="primary">保存</el-button>
          <el-button @click="closePage">关闭</el-button>
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input style="width: 30%" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="textarea" />
        </el-form-item>
      </el-form>
    </el-row>
    <vxe-toolbar>
      <template v-slot:buttons>
        <el-button type="primary" size="small">全部授权</el-button>
        <el-button type="danger" size="small">全部取消</el-button>
        <el-button size="small" icon="el-icon-bottom" @click="$refs.xTree.setAllTreeExpansion(true)">展开所有</el-button>
        <el-button size="small" icon="el-icon-top" @click="$refs.xTree.clearTreeExpand()">关闭所有</el-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      ref="xTree"
      resizable
      size="small"
      highlight-hover-row
      :data="tableData"
      :tree-config="{expandAll: true, children: 'children',trigger:'cell', line: false, iconOpen: 'el-icon-caret-bottom', iconClose: 'el-icon-caret-right'}"
      @toggle-tree-expand="toggleExpandChangeEvent"
    >
      <vxe-table-column field="name" width="300" tree-node>
        <template v-slot:header="{ row }">
          <div style="text-align: center">名称</div>
          <el-form :inline="true" label-width="0px">
            <el-form-item>
              <el-input v-model="searchName" placeholder="查询菜单名称" style="width:130px" />
              <el-button type="primary" size="mini" @click="filterName">查询</el-button>
              <el-button size="mini" @click="resetFilter">重置</el-button>
            </el-form-item>
          </el-form>
        </template>
        <template v-slot="{ row }">
          <span>
            <template v-if="row.children && row.children.length">
              <i :class="$refs.xTree.isTreeExpandByRow(row) ? 'el-icon-folder-opened' : 'el-icon-folder'" />
            </template>
            <template v-else>
              <i class="el-icon-document" />
            </template>
            <a>{{ row.name }}</a>
          </span>
        </template>
      </vxe-table-column>
      <vxe-table-column title="授权">
        <template v-slot="{ row }">
          <el-checkbox-group v-if="row.pagePath" v-model="row.authed">
            <el-checkbox :label="row.pagekey + '_view'">查看</el-checkbox>
            <template v-for=" p in row.permissions">
              <el-checkbox :key="p.uuid" :label="p.uuid">
                {{ p.name }}
              </el-checkbox>
            </template>
          </el-checkbox-group>
        </template>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>
<script>
import { getAdminRoleAuthDetail } from '@/api/role'
export default {
  name: 'RoleDetail',
  data() {
    return {
      searchName: '',
      tableData: []
    }
  },
  created() {
    this.findList()
  },
  methods: {
    closePage() {
      this.$closePage()
    },
    resetFilter() {
      this.searchName = ''
      this.findList()
    },
    filterName() {
      if (this.searchName) {
        const options = { children: 'children' }
        const searchProps = ['name']
        this.tableData = this.$XEUtils.searchTree(this.tableData, item => searchProps.some(key => this.$XEUtils.toString(item[key]).indexOf(this.searchName) > -1), options)
        // 搜索之后默认展开所有子节点
        this.$nextTick(() => {
          this.$refs.xTree.setAllTreeExpansion(true)
        })
      } else {
        this.findList()
      }
    },
    findList() {
      this.loading = true
      getAdminRoleAuthDetail({ id: '111' }).then(({ code, data }) => {
        if (code === 20000) {
          this.tableData = data
        }
      }).catch(e => {
        console.log(e)
        this.loading = false
      })
    },
    toggleExpandChangeEvent({ row, expanded }) {
      console.log('节点展开事件' + expanded)
    },
    getTreeExpansionEvent() {
      const treeExpandRecords = this.$refs.xTree.getTreeExpandRecords()
      this.$XModal.alert(treeExpandRecords.length)
    }
  }
}
</script>
