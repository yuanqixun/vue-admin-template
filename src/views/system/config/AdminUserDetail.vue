<template>
  <div class="app-container">
    <el-form :model="form" ref="userForm" label-width="100px" label-position="right">
      <el-form-item label-width="0px">
        <el-button type="primary" @click="btnDoSave('userForm')">保存</el-button>
        <el-button @click="closePage">关闭</el-button>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="登陆名：" prop="username"
                        :rules="[
                          { required: true, message: '请输入登陆名', trigger: 'blur' }
                          ]"
          >
            <el-input v-model="form.username" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="用户名称：" prop="name"
                        :rules="[
                          { required: true, message: '请输入用户名称', trigger: 'blur' }
                          ]">
            <el-input v-model="form.name"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="type === 'add'">
        <el-col :span="8">
          <el-form-item label="初始密码：" prop="password"
                        :rules="[
                          { required: true, message: '请输入密码', trigger: 'blur' }
                          ]">
            <el-input type="password" v-model="form.password"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="是否启用：">
            <el-switch v-model="form.isEnabled"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所属角色：">
            <el-checkbox-group v-model="form.authed_roles">
              <template v-for=" r in roleList">
                <el-checkbox :key="r.id" :label="r.id">
                  {{ r.name }}
                </el-checkbox>
              </template>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getEditUserDetail, saveUserDetail } from '@/api/adminuser'
/* eslint-disable */
export default {
  name: 'system_config_AdminUserDetail',
  data() {
    return {
      type:'',
      form: {
        id: null,
        username: '',
        name: '',
        password: '',
        isEnabled: true,
        authed_roles: []
      },
      roleList: []
    }
  },
  created() {
    // this.initPage()
  },
  activated() {
    this.initPage()
  },
  methods: {
    initPage() {
      this.form.id = this.$route.query.id || ''
      this.type = this.$route.query.type || ''
      this.getUserDetail()
    },
    closePage() {
      this.$closePage()
    },
    getUserDetail() {
      getEditUserDetail({ id: this.form.id }).then(res => {
        if (res.success && res.data[0]) {
          const result = res.data[0]
          this.form.name = result.name
          this.form.username = result.username
          this.form.isEnabled = result.isEnabled
          this.form.authed_roles = result.authed_roles
          this.roleList = result.roleList
        }
      }).catch(e => {
        console.log(e)
      })
    },
    btnDoSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveUserDetail(this.form).then(res => {
            if (res.success) {
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
    }
  }
}
</script>
