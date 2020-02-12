<template>
  <div class="app-container">
    <el-form :model="form" ref="userForm" label-width="100px" label-position="right">
      <el-form-item label-width="0px">
        <el-button type="primary" @click="btnDoSave('userForm')">保存</el-button>
        <el-button @click="closePage">关闭</el-button>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="唯一键值：" prop="unique_key"
                        :rules="[
                          { required: true, message: '请输入名称', trigger: 'blur' }
                          ]">
            <el-input v-model="form.unique_key"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="名称：" prop="name"
                        :rules="[
                          { required: true, message: '请输入名称', trigger: 'blur' }
                          ]">
            <el-input v-model="form.name"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="可否删除：">
            <el-switch v-model="form.deletable"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="说明：">
            <el-input type="textarea" v-model="form.memo" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <vxe-toolbar>
      <template v-slot:buttons>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="btnDoAdd" :disabled="!form.id">新增</el-button>
        <el-button size="small" icon="el-icon-refresh">刷新</el-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      ref="subTable"
      border
      show-overflow
      row-id="uuid"
      size="small"
      class="vxe-table-element"
      :loading="loading"
      :data="tableData"
      :seq-config="{startIndex: (tablePage.currentPage - 1) * tablePage.pageSize}"
      :edit-config="{trigger: 'manual', mode: 'row',autoClear: false}"
    >
      <vxe-table-column type="seq" title="序号" align="center" width="60" />
      <vxe-table-column field="value" title="键值" width="150" :edit-render="{name: 'ElInput'}"></vxe-table-column>
      <vxe-table-column field="name" title="名称" width="150" :edit-render="{name: 'ElInput'}" />
      <vxe-table-column field="deletable" title="可否删除" width="100" align="center" :edit-render="{name: 'ElSwitch', type: 'visible'}" />
      <vxe-table-column field="disabled" title="是否停用" width="100" align="center" :edit-render="{name: 'ElSwitch', type: 'visible'}" />
      <vxe-table-column title="操作" align="left">
        <template v-slot="{ row }">
          <template v-if="$refs.subTable.isActiveByRow(row)">
            <el-button type="primary" size="mini" icon="el-icon-save" @click="btnSaveRowEvent(row)">保存</el-button>
            <el-button size="mini" icon="el-icon-close" @click="btnCancelRowEvent(row)">取消</el-button>
          </template>
          <template v-else>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="btnEditRowEvent(row)">编辑</el-button>
            <el-button type="primary" size="mini" icon="el-icon-top" title="上移" :disabled="isFirstRow(row.uuid)"
                       @click="onItemMoveUp(row.id)" plain>上移</el-button>
            <el-button type="primary" size="mini" icon="el-icon-bottom" title="下移"
                       :disabled="isLastRow(row.uuid)"
                       @click="onItemMoveDown(row.id)" plain>下移</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" plain @click="onItemRemove(row.uuid)">删除</el-button>
          </template>
        </template>
      </vxe-table-column>
    </vxe-table>
    <vxe-pager v-if="tablePage.totalPage > 1"
               background
               size="small"
               :current-page="tablePage.currentPage"
               :page-size="tablePage.pageSize"
               :total="tablePage.totalResult"
               :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
               @page-change="handlePageChange"
    />
  </div>
</template>
<script>
import VXETable from 'vxe-table'
import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'

VXETable.use(VXETablePluginElement)
import { getEditDetail, saveDetail, getDataItemList,saveItemDetail,remove, moveup, movedown } from '@/api/basedata'
/* eslint-disable */
export default {
  name: 'system_config_BaseDataDetail',
  data() {
    return {
      form: {
        id: null,
        unique_key: '',
        name: '',
        deletable: true
      },
      loading:false,
      tableData: [],
      tablePage: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
      }
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
      this.getEditDetail()
    },
    closePage() {
      this.$closePage()
    },
    getEditDetail() {
      getEditDetail({ id: this.form.id }).then(res => {
        if (res.success && res.data[0]) {
          const result = res.data[0]
          this.form.id = result.id
          this.form.name = result.name
          this.form.unique_key = result.unique_key
          this.form.deletable = result.deletable
          this.form.memo = result.memo
          this.findList()
        }
      }).catch(e => {
        console.log(e)
      })
    },
    btnDoSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveDetail(this.form).then(res => {
            if (res.success) {
              this.form.id = res.data[0].id
              this.$message({
                type: 'success',
                message: res.errmsg || '操作成功!'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    findList() {
      this.loading = true
      const pageNumber = this.tablePage.currentPage
      const pageSize = this.tablePage.pageSize
      const searchParams = {parentId:this.form.id}
      getDataItemList({ pageNumber, pageSize },searchParams).then(res => {
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
    btnDoAdd() {
      let record = {
        parentId: this.form.id,
        value: '',
        name: '',
        deletable: false,
        disabled: false,
        displayOrder: 0
      }
      this.$refs.subTable.insertAt(record,-1).then(({ row }) => this.$refs.subTable.setActiveRow(row))
    },
    btnSaveRowEvent(row) {
      let xTable = this.$refs.subTable;
      saveItemDetail(row).then(res => {
        if (res.success) {
          this.findList()
          xTable.clearActived();
          this.$message({
            type: 'success',
            message: res.errmsg || '操作成功!'
          })
        }
      })
    },
    btnCancelRowEvent(row) {
      let xTable = this.$refs.subTable;
      xTable.clearActived().then(() => {
        debugger
        if(!xTable.isInsertByRow(row)){
          xTable.revertData(row)
        }else{
          // 新增的行
          xTable.remove(row)
        }
      })
    },
    btnEditRowEvent(row) {
      this.$refs.subTable.setActiveRow(row)
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
      this.$confirm('确定要删除此项吗?', '系统消息', {
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
    isFirstRow(rowid) {
      if(this.tableData && this.tableData[0] && this.tableData[0].uuid == rowid) {
        return true
      }
      return false
    },
    isLastRow(rowid) {
      if(this.tableData && this.tableData.length >0 && this.tableData[this.tableData.length-1].uuid == rowid) {
        return true
      }
      return false
    }
  }
}
</script>
