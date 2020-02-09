<template>
  <div class="app-container">
    <vxe-toolbar>
      <template v-slot:buttons>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addRootMenu">添加一级菜单</el-button>
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
      row-id="id"
      :tree-config="{children: 'children',trigger:'cell', line: false, iconOpen: 'el-icon-caret-bottom', iconClose: 'el-icon-caret-right'}"
      @toggle-tree-expand="toggleExpandChangeEvent"
    >
      <vxe-table-column field="name" title="名称" width="250" tree-node>
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
      <vxe-table-column field="pagePath" title="路径" width="300"/>
      <vxe-table-column field="subPages" title="子页面" width="300">
        <template v-slot="{ row }">
          <el-tag type="success" v-if="row.subPages" v-for="(sub,index) in toArray(row.subPages)" :key="sub.uuid"
                  :title="sub.pagePath" style="margin-right: 10px;cursor:pointer"
          >{{ sub.name }}</el-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作">
        <template v-slot="{ row }">
          <el-button type="text" size="mini" icon="el-icon-plus" :title="row.id" :disabled="row.grade >= 2"
                     @click="onItemAdd(row.id)"/>
          <el-button type="text" size="mini" icon="el-icon-top" title="上移" :disabled="row.order == 0"
                     @click="onItemMoveUp(row.id)"/>
          <el-button type="text" size="mini" icon="el-icon-bottom" title="下移"
                     :disabled="row.gradeSize == 0 || row.order == (row.gradeSize -1) "
                     @click="onItemMoveDown(row.id)"/>
          <el-button type="text" size="mini" icon="el-icon-edit" title="编辑" @click="onItemEdit(row.id)"/>
          <el-button type="text" size="mini" icon="el-icon-delete" :disabled="row.children && row.children.length > 0"
                     @click="onItemRemove(row.id)"/>
        </template>
      </vxe-table-column>
    </vxe-table>
    <el-dialog title="菜单详情"
               :visible.sync="dialogDetailVisible"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
    >
      <el-form :model="form" ref="form" :rules="validRules" label-width="80px">
        <el-form-item label-width="0px">
          <el-button type="primary" @click="btnSaveForm('form')" icon="el-icon-check">保 存</el-button>
          <el-button @click="resetFrom('form')" icon="el-icon-close">取 消</el-button>
        </el-form-item>
        <el-form-item label="上级菜单" prop="pname" v-if="showParentName">
          <el-input v-model="form.pname" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" v-if="showTypeSelect">
          <el-radio-group v-model="form.type">
            <el-radio :label="0">分组</el-radio>
            <el-radio :label="1">功能</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="canEditPagePath">
          <el-row>
            <el-col :span="10">
            <el-form-item label="绑定功能" prop="pagePath">
              <el-tree-select v-model="form.uuid" :selectParams="selectParams" :treeParams="treeParams" ref="treeSelect"
                              @node-click="onFuncSelect"
              />
            </el-form-item>
            </el-col>
            <el-col :span="14">
            <el-form-item label="功能路径">
              <el-input v-model="form.pagePath" autocomplete="off" readonly></el-input>
            </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="是否隐藏" prop="hidden">
            <el-switch v-model="form.hidden" active-color="#13ce66"/>
          </el-form-item>
        </template>
        <el-form-item label="默认页面" v-if="requireDefaultPagePath" prop="defaultPagePath">
          <el-input v-model="form.defaultPagePath" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import { getAdminMenuList, saveMenuItem, remove, moveup, movedown, getAllFunctionList } from '@/api/menu'
import ElTreeSelect from '@/components/TreeSelect'

export default {
  name: 'system_config_MenuList',
  components: {
    ElTreeSelect
  },
  data() {
    return {
      selectParams: {
        clearable: false,
        placeholder: '请选择系统功能'
      },
      treeParams: {
        clickParent: false,
        filterable: true,
        'check-strictly': true,
        'default-expand-all': true,
        'expand-on-click-node': false,
        data: [],
        props: {
          label: 'name',
          value: 'uuid',
          disabled: 'disabled',
          children: 'children'
        }
      },
      form: {
        pid: null,
        pname: null,
        id: null,
        uuid: '',
        name: '',
        hidden: false,
        pagePath: '',
        defaultPagePath: '',
        subPages: '',
        grade: 0,
        type: 0
      },
      validRules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        pagePath: [
          { required: true, message: '请设置页面路径', trigger: 'blur' }
        ],
        defaultPagePath: [
          { required: true, message: '请设置默认页面路径', trigger: 'blur' }
        ]
      },
      dialogDetailVisible: false,
      tableData: []
    }
  },
  computed: {
    showTopNavBar() {
      return this.$store.state.settings.showTopNavBar
    },
    requireDefaultPagePath() {
      return this.showTopNavBar && this.form.grade == 0
    },
    canEditPagePath() {
      return this.form.grade != 0 && this.form.type != 0
    },
    showParentName() {
      return this.form.pid && (this.form.pid != null)
    },
    showTypeSelect() {
      return this.form.grade != 0
    }
  },
  created() {
    this.findList()
    this.initFuncList()
  },
  methods: {
    toArray(str) {
      if(!str)
        return
      return JSON.parse(str)
    },
    initFuncList() {
      getAllFunctionList().then(res =>{
        if(res.success){
          this.treeParams.data = res.data
        }
      })
    },
    // 功能点选择回调
    onFuncSelect(data, node, vm) {
      console.log(data)
      this.form.uuid = data.uuid
      this.form.pagePath = data.pagePath
      if(data.subPages) {
        this.form.subPages = JSON.stringify(data.subPages)
      }
    },
    findList() {
      this.loading = true
      getAdminMenuList({}).then(res => {
        if (res.success) {
          this.tableData = res.data
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
    getRowDataById(rowid) {
      return this.$refs.xTree.getRowById(rowid)
    },
    bindRowAndForm(row) {
      console.log(row)
      if (row) {
        this.form.id = row.id
        this.form.uuid = row.uuid
        this.form.name = row.name
        this.form.pagePath = row.pagePath
        this.form.grade = row.grade
        this.form.defaultPagePath = row.defaultPagePath
        if (row.hidden) {
          this.form.hidden = row.hidden
        } else {
          this.form.hidden = false
        }
        if (row.children && row.children.length > 0) {
          this.form.type = 0
        } else {
          this.form.type = 1
        }
        if (row.pid) {
          let prow = this.getRowDataById(row.pid)
          if (prow) {
            this.form.pid = prow.id
            this.form.pname = prow.name
          }
        }
      }
    },
    addRootMenu() {
      this.dialogDetailVisible = true
    },
    onItemAdd(rowid) {
      console.log(rowid)
      const row = this.getRowDataById(rowid)
      // 新节点为本节点级别+1
      this.form.grade = row.grade + 1
      // 父节点信息
      this.form.pid = row.id
      this.form.pname = row.name
      this.dialogDetailVisible = true
    },
    onItemEdit(rowid) {
      const row = this.getRowDataById(rowid)
      this.bindRowAndForm(row)
      this.dialogDetailVisible = true
    },
    onItemMoveUp(rowid) {
      moveup(rowid).then(res => {
        this.$message({
          type: 'success',
          message: res.errmsg
        })
        this.findList()
      })
    },
    onItemMoveDown(rowid) {
      movedown(rowid).then(res => {
        this.$message({
          type: 'success',
          message: res.errmsg
        })
        this.findList()
      })
    },
    onItemRemove(rowid) {
      this.$confirm('确定要删除此菜单吗?', '系统消息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(rowid).then(res => {
          this.$message({
            type: 'success',
            message: res.errmsg || '删除成功!'
          })
          this.findList()
        })
      }).catch(() => {

      })
    },
    btnSaveForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveMenuItem(this.form).then(res => {
            if (res.success) {
              this.findList()
              this.resetFrom(formName)
            }
          })
        } else {
          return false
        }
      })
    },
    /**
     * 重置表单
     * @param formName
     */
    resetFrom(formName) {
      // 重置表单项的值
      this.form = {
        pid: null,
        pname: null,
        id: null,
        uuid: '',
        name: '',
        type: 0,
        hidden: false,
        pagePath: '',
        defaultPagePath: '',
        subPages: '',
        grade: 0
      }
      // 重置表单项的验证等信息
      this.$refs[formName].resetFields()
      this.dialogDetailVisible = false
    }
  }
}
</script>
