<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目" prop="projectId" >
        <el-select
        v-model="queryParams.projectId"
        placeholder="请选择项目"
        clearable
        style="width: 150px"
        >
          <el-option v-for="item in projects" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="唯一编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入唯一编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模块名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入模块名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="排序" prop="sort">-->
<!--        <el-input-->
<!--          v-model="queryParams.sort"-->
<!--          placeholder="请输入排序"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
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
          v-hasPermi="['scheduling:module:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['scheduling:module:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['scheduling:module:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['scheduling:module:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="moduleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="${comment}" align="center" prop="id" />-->
      <el-table-column label="唯一编码" align="center" prop="code" />
      <el-table-column label="模块名称" align="center" prop="name" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['scheduling:module:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['scheduling:module:remove']">删除</el-button>
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

    <!-- 添加或修改模块对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="moduleRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目" prop="projectId">
<!--          <el-input v-model="form.projectId" placeholder="请输入项目id" />-->
          <el-select
              v-model="form.projectId"
              placeholder="请选择项目"
              clearable
              style="width: 150px"
          >
            <el-option v-for="item in projects" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="唯一编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入唯一编码" />
        </el-form-item>
        <el-form-item label="模块名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入模块名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
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

<script setup name="Module">
import {listModule, getModule, delModule, addModule, updateModule, allModule} from "@/api/scheduling/module";
import {allProject} from "@/api/scheduling/project";
const { proxy } = getCurrentInstance();

const moduleList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const projects = ref([]);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    projectId: null,
    code: null,
    name: null,
    sort: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询模块列表 */
function getList() {
  loading.value = true;
  listModule(queryParams.value).then(response => {
    moduleList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function fetchProjects(){
  allProject().then(response => {
    projects.value = response.data;
  })
}
function fetchModules(){
  allModule().then(response => {
    modules.value = response.data;
  })
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
    projectId: null,
    code: null,
    name: null,
    remark: null,
    sort: null,
    createTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null
  };
  proxy.resetForm("moduleRef");
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
  fetchProjects();
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
  title.value = "添加模块";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getModule(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改模块";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["moduleRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateModule(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addModule(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除模块编号为"' + _ids + '"的数据项？').then(function() {
    return delModule(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('systemManage/module/export', {
    ...queryParams.value
  }, `module_${new Date().getTime()}.xlsx`)
}

getList();
fetchProjects();
</script>
