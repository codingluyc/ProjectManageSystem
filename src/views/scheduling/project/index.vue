<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="唯一编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入唯一编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始日期" prop="startDate">
        <el-date-picker clearable
          v-model="queryParams.startDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="endDate">
        <el-date-picker clearable
          v-model="queryParams.endDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input
          v-model="queryParams.sort"
          placeholder="请输入排序"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="管理者姓名" label-width="120px" prop="managerUserName">
        <el-input
          v-model="queryParams.managerUserName"
          placeholder="请输入管理者姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['scheduling:project:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['scheduling:project:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['scheduling:project:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['scheduling:project:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="projectList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="项目id" align="center" prop="id" />-->
      <el-table-column label="唯一编码" align="center" prop="code" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="开始日期" align="center" prop="startDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束日期" align="center" prop="endDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="管理者" align="center" prop="managerName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['scheduling:project:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['scheduling:project:remove']">删除</el-button>
          <el-button link type="primary" icon="View" @click="handleManageTeam(scope.row)" v-hasPermi="['scheduling:team:list']">团队</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改项目对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="projectRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="form.projectName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="唯一编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入唯一编码" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker clearable
            v-model="form.startDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker clearable
            v-model="form.endDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
<!--        <el-form-item label="管理者id" prop="managerUserId">-->
<!--          <el-input v-model="form.managerUserId" placeholder="请输入管理者id" />-->
<!--        </el-form-item>-->
        <el-form-item label="管理者" prop="managerUserId">
          <el-select v-model="form.managerUserId" placeholder="请输入管理者" >
            <el-option v-for="item in users" :label="item.nickName" :value="item.userId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

<!--    团队抽屉-->
    <el-drawer :title="teamTitle" v-model="teamOpen" width="500px" :direction="'rtl'">
      <el-table v-loading="loading" :data="teamUsers" >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户id" align="center" prop="userId" />
        <el-table-column label="用户名称" align="center" prop="userName" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Delete" @click="handleDeleteTeam(scope.row)" v-hasPermi="['scheduling:team:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="openAddTeamNumbers()">添加</el-button>
          <el-button @click="teamOpen=false">确认</el-button>
        </div>
      </template>
    </el-drawer>

<!--    添加团队成员-->
    <el-dialog :title="'添加成员'"  width="500px" v-model="teamAddOpen" append-to-body>
      <el-form ref="teamAddRef" :model="teamForm" :rules="rules" label-width="80px">
        <el-form-item label="用户">
          <el-select v-model="teamForm.userIds" placeholder="请选择团队成员" multiple>
            <el-option v-for="item in usersNotInProject" :label="item.userName" :value="item.userId" :key="item.userId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitTeamForm">确 定</el-button>
          <el-button @click="teamAddOpen=false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="Project">
import { listProject, getProject, delProject, addProject, updateProject } from "@/api/scheduling/project";
import { listTeam,  delTeam, addTeams, listNotInProject } from "@/api/scheduling/team";
import {allUsers} from '@/api/system/user.js'


const { proxy } = getCurrentInstance();

const projectList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const teamTitle = ref("团队成员列表");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    projectName: null,
    code: null,
    startDate: null,
    endDate: null,
    sort: null,
    managerUserId: null,
    managerUserName: null
  },
  rules: {
  }
});

const users = ref([])

const { queryParams, form, rules } = toRefs(data);
const teamOpen = ref(false);
const teamAddOpen = ref(false);
const teamMembers = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    projectId: null
  },
  teamUsers:[],
  teamForm: {
    projectId: null,
    userIds: []
  },
  total: 0
});
const {teamForm,teamUsers} = toRefs(teamMembers)
const usersNotInProject = ref([]);

function fetchUser(){
  allUsers().then(response => {
    users.value = response.data;
  })
}

//查询不在项目的用户
function fetchUserNotInProject(){
  const _project_id = teamMembers.value.queryParams.projectId;
  listNotInProject({projectId: _project_id}).then(response => {
    usersNotInProject.value = response.rows;
    teamMembers.value.total = response.total;
  })
}

/** 查询项目列表 */
function getList() {
  loading.value = true;
  listProject(queryParams.value).then(response => {
    projectList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    projectName: null,
    code: null,
    remark: null,
    startDate: null,
    endDate: null,
    sort: null,
    managerUserId: null,
    createTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null
  };
  proxy.resetForm("projectRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  fetchUser();
  open.value = true;
  title.value = "添加项目";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  fetchUser()
  const _id = row.id || ids.value
  getProject(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改项目";
  });
}

// 打开添加团队成员抽屉
function openAddTeamNumbers(){
  teamAddOpen.value = true;
  teamForm.value.userIds=[];
  teamForm.value.projectId = teamMembers.value.queryParams.projectId;
  fetchUserNotInProject();
}

function restTeamQuery(){
  teamMembers.value = {
    queryParams: {
      pageNum: 1,
      pageSize: 10,
      projectId: null
    },
    teamForm: {
      projectId: null,
      userIds: []
    }
  }
  proxy.resetForm("teamAddRef");
}

/**
 * 查询项目团队成员
 * @param row
 */
function handleManageTeam(row) {
  restTeamQuery();
  loading.value = true;
  teamMembers.value.queryParams.projectId = row.id;
  updateTeamView();
}

/**
 * 更新项目团队列表视图
 */
function updateTeamView(){
  listTeam(teamMembers.value.queryParams).then(response => {
    teamMembers.value.total = response.total;
    teamUsers.value = response.rows;
    teamOpen.value = true;

    loading.value = false;
  });
}

function handleDeleteTeam(row){
  const _ids = row.id || ids.value;
  const _userName = row.userName;
  proxy.$modal.confirm('是否确认删除项目成员"' + _userName ).then(function() {
    return delTeam(_ids);
  }).then(() => {
    updateTeamView();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["projectRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateProject(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addProject(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/**
 * 提交团队成员
 */
function submitTeamForm(){
  addTeams(teamForm.value).then(response => {
    proxy.$modal.msgSuccess("添加成功");
    teamAddOpen.value = false;
    fetchUserNotInProject();
    updateTeamView();
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除项目编号为"' + _ids + '"的数据项？').then(function() {
    return delProject(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('scheduling/project/export', {
    ...queryParams.value
  }, `project_${new Date().getTime()}.xlsx`)
}

getList();
</script>
