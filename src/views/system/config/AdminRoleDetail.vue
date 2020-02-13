<template>
  <div class="app-container">
    <el-row class="text-left el-collapse-item active">
      <el-form ref="dataForm" :model="form" label-width="80px" label-position="right">
        <el-form-item label-width="0px">
          <el-button type="primary" @click="btnDoSave('dataForm')">保存</el-button>
          <el-button @click="closePage">关闭</el-button>
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input style="width: 30%" v-model="form.name"/>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="textarea" v-model="form.description"/>
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
      <template v-slot:tools>
        <el-form :inline="true" label-width="0px">
          <el-form-item>
            <el-input v-model="searchName" placeholder="查询菜单名称" style="width:130px"/>
            <el-button type="primary" size="mini" @click="filterName">查询</el-button>
            <el-button size="mini" @click="resetFilter">重置</el-button>
          </el-form-item>
        </el-form>
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
      <vxe-table-column field="name" title="菜单名称" width="300" tree-node>
        <template v-slot="{ row }">
          <span>
            <template v-if="row.children && row.children.length">
              <i :class="$refs.xTree.isTreeExpandByRow(row) ? 'el-icon-folder-opened' : 'el-icon-folder'"/>
            </template>
            <template v-else>
              <i class="el-icon-document"/>
            </template>
            <a>{{ row.name }}</a>
          </span>
        </template>
      </vxe-table-column>
      <vxe-table-column title="授权">
        <template v-slot="{ row }">
          <el-checkbox-group v-if="row.pagePath" v-model="form.authed_permissions">
            <el-checkbox :label="row.uuid + '.view'">查看</el-checkbox>
            <template v-for=" p in getFunctionPermis(row.uuid)">
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
import { getEditRoleAuthDetail, saveForm } from '@/api/adminrole'
export default {
  name: 'system_config_AdminRoleDetail',
  data() {
    return {
      searchName: '',
      form: {
        id: null,
        name: '',
        description: '',
        authed_permissions: []
      },
      tableData: []
    }
  },
  created() {
    this.initPage()
  },
  activated() {
    this.initPage()
  },
  methods: {
    initPage() {
      this.form.id = this.$route.query.id || ''
      this.findList()
    },
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
      getEditRoleAuthDetail({ id: this.form.id }).then(res => {
        if (res.success && res.data[0]) {
          const result = res.data[0]
          this.form.name = result.name
          this.form.description = result.description
          this.form.authed_permissions = result.authed_permissions
          this.tableData = result.menuList
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
    },
    getFunctionPermis(uuid) {
      const list = this.$storage.get(uuid) || []
      return list
    },
    btnDoSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveForm(this.form).then(res => {
            if (res.success) {
              // 新增对象
              const isNewAdd = !this.form.id
              this.form.id = res.data[0].id
              if(isNewAdd){
                this.$router.push({path:this.$route.path,query:{id:this.form.id}})
              }
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
