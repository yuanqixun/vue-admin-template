<template>
  <div class="app-container">
    <el-form label-width="100px" label-position="right">
      <el-form-item label-width="0px">
        <el-button type="primary">保存</el-button>
        <el-button @click="closePage">关闭</el-button>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="登陆名：">
            <el-input v-model="form.username" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="用户名称：">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="是否启用：">
            <el-switch v-model="form.isEnabled" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所属角色：">
            <el-checkbox-group v-model="form.myRoles">
              <template v-for=" r in allRoles">
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
import { getUserDetail } from '@/api/user'
export default {
  name: 'UserDetail',
  data() {
    return {
      form: {
        username: '',
        name: '',
        isEnabled: true,
        myRoles: [2]
      },
      allRoles: [
        {
          id: 1,
          name: '系统管理员'
        }, {
          id: 2,
          name: '业务员'
        }
      ]
    }
  },
  created() {
  },
  methods: {
    closePage() {
      this.$closePage()
    },
    getUserDetail() {
      getUserDetail()
    }
  }
}
</script>
