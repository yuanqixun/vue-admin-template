<template>
  <div class="app-container">
    <vxe-toolbar>
      <template v-slot:buttons>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="getTreeExpansionEvent">添加一级菜单</el-button>
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
      :tree-config="{children: 'children',trigger:'cell', line: false, iconOpen: 'el-icon-caret-bottom', iconClose: 'el-icon-caret-right'}"
      @toggle-tree-expand="toggleExpandChangeEvent"
    >
      <vxe-table-column field="name" title="名称" width="250" tree-node>
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
      <vxe-table-column field="pagePath" title="路径" width="300" />
      <vxe-table-column title="操作">
        <template v-slot="{ row }">
          <el-button type="text" size="mini" icon="el-icon-plus" :title="row.id" :disabled="row.grade >= 2" />
          <el-button type="text" size="mini" icon="el-icon-top" title="上移" :disabled="row.order == 0" />
          <el-button type="text" size="mini" icon="el-icon-bottom" title="下移" :disabled="row.gradeSize == 0 || row.order == (row.gradeSize -1) " />
          <el-button type="text" size="mini" icon="el-icon-edit" title="编辑" />
          <el-button type="text" size="mini" icon="el-icon-delete" :disabled="row.children && row.children.length > 0" />
        </template>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>
<script>
import Vue from 'vue'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
import { getAdminMenuList } from '@/api/menu'
Vue.use(VXETable)
export default {
  name: 'MenuList',
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.findList()
  },
  methods: {
    findList() {
      this.loading = true
      getAdminMenuList({}).then(({ code, data }) => {
        if (code === 20000) {
          this.tableData = data
        }
      }).catch(e => {
        console.log(e)
        debugger
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
