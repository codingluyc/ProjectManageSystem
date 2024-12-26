<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目" prop="projectId">
        <el-select
            v-model="queryParams.projectId"
            placeholder="请选择项目"
            clearable
            style="width: 150px"
            @change="fetchModules"
        >
          <el-option v-for="item in projects" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="模块" prop="moduleId">
        <el-select
            v-model="queryParams.moduleId"
            placeholder="请选择模块"
            clearable
            style="width: 150px"
        >
          <el-option v-for="item in modules" :value="item.id"
                     :label="item.moduleName + '_'+item.projectName"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="任务名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入任务名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="负责人姓名" prop="developerName" label-width="100px">
        <el-input
          v-model="queryParams.developerName"
          placeholder="请输入负责人姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="开始日期" prop="startDate">-->
<!--        <el-date-picker clearable-->
<!--          v-model="queryParams.startDate"-->
<!--          type="date"-->
<!--          value-format="YYYY-MM-DD"-->
<!--          placeholder="请选择开始日期">-->
<!--        </el-date-picker>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="结束日期" prop="endDate">-->
<!--        <el-date-picker clearable-->
<!--          v-model="queryParams.endDate"-->
<!--          type="date"-->
<!--          value-format="YYYY-MM-DD"-->
<!--          placeholder="请选择结束日期">-->
<!--        </el-date-picker>-->
<!--      </el-form-item>-->

      <el-form-item label="工作状态" prop="state">
      <el-select
          v-model="queryParams.state"
          placeholder="请选择状态"
          clearable
          style="width: 150px">
        <el-option v-for="dict in task_state" :key="dict.value" :label="dict.label" :value="dict.value"/>
      </el-select>
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
          v-hasPermi="['scheduling:taskDeveloper:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['scheduling:taskDeveloper:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['scheduling:taskDeveloper:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['scheduling:taskDeveloper:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="taskDeveloperList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />

      <el-table-column label="项目" align="center" prop="projectName" />
      <el-table-column label="模块" align="center" prop="moduleName" />
      <el-table-column label="任务" align="center" prop="taskName" />
      <el-table-column label="负责人" align="center" prop="developerName" />
<!--      <el-table-column label="工作" align="center" prop="duty" />-->
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
      <el-table-column label="工作状态" align="center" prop="state" >
        <template #default="scope">
          <dict-tag :options="task_state" :value="scope.row.state"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['scheduling:taskDeveloper:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['scheduling:taskDeveloper:remove']">删除</el-button>
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

    <!-- 添加或修改任务-开发者对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="taskDeveloperRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目" prop="projectId">
          <el-select
              v-model="form.projectId"
              placeholder="请选择项目"
              clearable
              style="width: 150px"
              @change="fetchFormModules();fetchTask();fetchUser()"
          >
            <el-option v-for="item in projects" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模块" prop="moduleId">
          <el-select
              v-model="form.moduleId"
              placeholder="请选择项目"
              clearable
              style="width: 150px"
              @change="fetchTask"
          >
            <el-option v-for="item in formModules" :value="item.id" :label="item.moduleName"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="任务" prop="taskId">
          <el-select
              v-model="form.taskId"
              placeholder="请选择任务"
              clearable
              style="width: 150px"
          >
            <el-option v-for="item in formTasks" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="developerId">
          <el-select
              v-model="form.developerId"
              placeholder="请选择负责人"
              clearable
              style="width: 150px"
          >
            <el-option v-for="item in users" :value="item.userId" :label="item.nickName"></el-option>
          </el-select>
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
        <el-form-item label="工作状态" prop="state">
          <el-select
              v-model="form.state"
              placeholder="请选择状态"
              clearable
              style="width: 150px">
            <el-option v-for="dict in task_state" :key="dict.value" :label="dict.label" :value="dict.value"/>
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
  </div>
</template>

<script setup name="TaskDeveloper">
import { listTaskDeveloper, getTaskDeveloper, delTaskDeveloper, addTaskDeveloper, updateTaskDeveloper } from "@/api/scheduling/taskDeveloper";
import {allProject} from "@/api/scheduling/project";
import {allModule} from "@/api/scheduling/module";
import {allTask} from "@/api/scheduling/task.js";
import {allUsers} from "@/api/system/user.js";

import DictTag from "@/components/DictTag/index.vue";
const { proxy } = getCurrentInstance();
const {task_state} = proxy.useDict('task_state');

const taskDeveloperList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const projects = ref([]);
const modules = ref([]);
const formModules = ref([]);
const users = ref([]);
const formTasks = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    projectId: null,
    moduleId: null,
    taskId: null,
    developerId: null,
    startDate: null,
    endDate: null,
    state: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

function fetchProjects(){
  allProject().then(response => {
    projects.value = response.data;
  })
}
function fetchModules(){
  queryParams.value.moduleId=null;
  allModule({projectId: queryParams.value.projectId}).then(response => {
    modules.value = response.data;
  })
}
function fetchFormModules(){
  form.value.moduleId = null;
  allModule({projectId: form.value.projectId}).then(response => {
    formModules.value = response.data;
  })
}
function fetchUser(){
  const _projectId = form.value.projectId;
  allUsers({projectId:_projectId}).then(response => {
    users.value = response.data;
  })
}
function  fetchTask(){
  form.value.taskId = null;
  allTask({
    projectId:form.value.projectId,
    moduleId:form.value.moduleId
  }).then(response=>{
    formTasks.value = response.data;
  })

}

/** 查询任务-开发者列表 */
function getList() {
  loading.value = true;
  listTaskDeveloper(queryParams.value).then(response => {
    taskDeveloperList.value = response.rows;
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
    createTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    projectId: null,
    moduleId: null,
    taskId: null,
    developerId: null,
    startDate: null,
    endDate: null,
    state: null
  };
  proxy.resetForm("taskDeveloperRef");
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
  open.value = true;
  title.value = "添加任务-开发者";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  fetchFormModules();
  fetchTask();
  const _id = row.id || ids.value
  getTaskDeveloper(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改任务-开发者";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["taskDeveloperRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateTaskDeveloper(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addTaskDeveloper(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除任务-开发者编号为"' + _ids + '"的数据项？').then(function() {
    return delTaskDeveloper(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('systemManage/taskDeveloper/export', {
    ...queryParams.value
  }, `taskDeveloper_${new Date().getTime()}.xlsx`)
}
fetchUser()
fetchProjects()
fetchModules()
getList();
</script>
