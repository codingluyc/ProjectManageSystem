<script setup>
import {allProject} from "@/api/systemManage/project";
import {allModule} from "@/api/systemManage/module";
import {allTask} from "@/api/systemManage/task.js";
import {allUsers} from "@/api/system/user.js";
import {allList} from "@/api/systemManage/taskDeveloper";
import GanttComponent from '@/components/gantt/gantt.vue';
const { proxy } = getCurrentInstance();
const {task_state} = proxy.useDict('task_state');
const projects = ref([]);
const modules = ref([]);
const formModules = ref([]);
const users = ref([]);
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

const showSearch = ref(true);
const { queryParams, form, rules} = toRefs(data);
const tasks = ref(
    {
      data: [],
      links: []
    }
)

const columns = [
  { name: 'text', label: '任务名称', tree: true, width: '100', align: 'center'},
  { name: 'module_name', label: '模块', width: '100', align: 'center' },
  { name: 'project_name', label: '项目', width: '100', align: 'center' },
  { name: 'start_date', label: '开始时间', width: 100, align: "center" },
  { name: 'end_date', label: '结束时间', width: 100, align: "center" },
  { name: 'developer_name', label: '人员', width: '100', align: 'center' },

]

/**
 * 请求接口，并从将接口返回的data数组转换成task类型并加入到tasks数组中
 * */
async function getList() {
  tasks.value.data = [];
  return allList(queryParams.value).then(response => {
    let array = [];
    for(const item of response.data){
      const i = {
        id: item.id,
        text: item.taskName,
        start_date: new Date(item.startDate),
        end_date: new Date(item.endDate),
        developer_name: item.developerName,
        module_name: item.moduleName,
        project_name: item.projectName,
        open: true
      };
      array.push(i);
    }
    tasks.value = {data:array,links:tasks.value.links};
  });


}


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
  allUsers().then(response => {
    users.value = response.data;
  })
}
function  fetchTask(){

  allTask({
    projectId:form.value.projectId,
    moduleId:form.value.moduleId
  }).then(response=>{
    formTasks.value = response.data;
  })
}

/** 搜索按钮操作 */
function handleQuery() {
  getList()
}


/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

setTimeout(()=>{
  getList()
},2000)

fetchUser()
fetchProjects()
fetchModules()
getList()



</script>

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
    <div class="container">
      <GanttComponent class="left-container" :tasks="tasks" :columns="columns"></GanttComponent>
    </div>
  </div>
</template>

<style scoped lang="scss">
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}
.container {
  height: 100vh;
  width: 100%;
}
.left-container {
  overflow: hidden;
  position: relative;
  height: 100%;
}
</style>