<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目" prop="projectId" >
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
          <el-option v-for="item in modules" :value="item.id" :label="item.moduleName + '_'+item.projectName"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="开发人员" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请选择开发人员"
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
          v-hasPermi="['systemManage:moduleDeveloper:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['systemManage:moduleDeveloper:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['systemManage:moduleDeveloper:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['systemManage:moduleDeveloper:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="moduleDeveloperList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="项目" align="center" prop="projectName" />
      <el-table-column label="模块" align="center" prop="moduleName" />
      <el-table-column label="职责" align="center" prop="devType" />
      <el-table-column label="人员" align="center" prop="developerName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['systemManage:moduleDeveloper:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['systemManage:moduleDeveloper:remove']">删除</el-button>
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

    <!-- 添加或修改模块开发者对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="moduleDeveloperRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目" prop="projectId" >
          <el-select
              v-model="form.projectId"
              placeholder="请选择项目"
              clearable
              style="width: 150px"
              @change="fetchFormModules"
          >
            <el-option v-for="item in projects" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模块" prop="moduleId">
          <el-select
              v-model="form.moduleId"
              placeholder="请选择请选择项目"
              clearable
              style="width: 150px"
          >
            <el-option v-for="item in modules" :value="item.id" :label="item.moduleName + '_'+item.projectName"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="职责" prop="devType">
          <el-select
              v-model="form.devType"
              placeholder="请选择职责"
              clearable
              style="width: 150px"
          >
          </el-select>
        </el-form-item>

        <el-form-item label="开发人员" prop="userId">
          <el-select
              v-model="form.userId"
              placeholder="请选择开发人员"
              clearable
              style="width: 150px"
          >
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
  </div>
</template>

<script setup name="ModuleDeveloper">
import { listModuleDeveloper, getModuleDeveloper, delModuleDeveloper, addModuleDeveloper, updateModuleDeveloper } from "@/api/systemManage/moduleDeveloper";
import {allProject} from "@/api/systemManage/project";
import {allModule} from "@/api/systemManage/module";
import {allUsers} from "@/api/system/user.js";
const { proxy } = getCurrentInstance();

const moduleDeveloperList = ref([]);
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
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    moduleId: null,
    devType: null,
    userId: null,
    projectId:null
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

/** 查询模块开发者列表 */
function getList() {
  loading.value = true;
  listModuleDeveloper(queryParams.value).then(response => {
    moduleDeveloperList.value = response.rows;
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
    moduleId: null,
    devType: null,
    userId: null,
    createTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null
  };
  formModules.value = [];
  proxy.resetForm("moduleDeveloperRef");
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
  form.moduleId = null;
  open.value = true;
  title.value = "添加模块开发者";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  fetchUser();
  const _id = row.id || ids.value
  getModuleDeveloper(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改模块开发者";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["moduleDeveloperRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateModuleDeveloper(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addModuleDeveloper(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除模块开发者编号为"' + _ids + '"的数据项？').then(function() {
    return delModuleDeveloper(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('systemManage/moduleDeveloper/export', {
    ...queryParams.value
  }, `moduleDeveloper_${new Date().getTime()}.xlsx`)
}

fetchProjects();
fetchModules();
getList();
</script>
