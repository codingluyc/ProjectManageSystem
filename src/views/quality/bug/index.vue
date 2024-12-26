<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          @keyup.enter="handleQuery"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 150px">
          <el-option
            v-for="dict in bug_state"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="项目" prop="projectId">
        <el-select
          v-model="queryParams.projectId"
          placeholder="请选择项目"
          clearable
          style="width: 150px"
          @change="queryModules"
        >
          <el-option
            v-for="p in projects"
            :key="p.id"
            :label="p.name"
            :value="p.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="模块" prop="moduleId">
        <el-select
          v-model="queryParams.moduleId"
          placeholder="请选择模块"
          clearable
          style="width: 150px"
        >
          <el-option
            v-for="dict in modules"
            :key="dict.id"
            :label="dict.moduleName"
            :value="dict.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="版本" prop="version">
        <el-input
          v-model="queryParams.version"
          placeholder="请输入版本"
          clearable
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="发现人" prop="proposerName" >
        <el-input
          v-model="queryParams.proposerName"
          placeholder="请输入发现人姓名"
          clearable
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="解决人" prop="solverName" >
        <el-input
            v-model="queryParams.solverName"
            placeholder="请输入解决人姓名"
            clearable
            style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="来源" prop="source">
        <el-select v-model="queryParams.source" placeholder="请选择来源" clearable style="width: 150px">
          <el-option
            v-for="dict in bug_source"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
        <el-select v-model="queryParams.priority" placeholder="请选择优先级" clearable style="width: 150px">
          <el-option
            v-for="dict in bug_priority"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="严重程度" prop="severity">
        <el-select v-model="queryParams.severity" placeholder="请选择严重程度" clearable style="width: 150px">
          <el-option
            v-for="dict in bug_severity"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="自定义级别" prop="customized" label-width="100px">
        <el-select v-model="queryParams.customized" placeholder="请选择自定义级别" clearable style="width: 150px">
          <el-option
            v-for="dict in bug_customized"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发现时间" style="width: 308px">
        <el-date-picker
          v-model="daterangeDiscoverTime"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="分配时间" style="width: 308px">
        <el-date-picker
          v-model="daterangeAssignTime"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
<!--      <el-form-item label="确认时间" prop="confirmTime">-->
<!--        <el-date-picker clearable-->
<!--          v-model="queryParams.confirmTime"-->
<!--          type="date"-->
<!--          value-format="YYYY-MM-DD"-->
<!--          placeholder="请选择确认时间">-->
<!--        </el-date-picker>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="实际解决时间" prop="actualTime">-->
<!--        <el-date-picker clearable-->
<!--          v-model="queryParams.actualTime"-->
<!--          type="date"-->
<!--          value-format="YYYY-MM-DD"-->
<!--          placeholder="请选择实际解决时间">-->
<!--        </el-date-picker>-->
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
          v-hasPermi="['quality:bug:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['quality:bug:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['quality:bug:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['quality:bug:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bugsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="bug id" align="center" prop="id" />-->
      <el-table-column label="标题" align="center" prop="title" />
<!--      <el-table-column label="具体描述" align="center" prop="description" />-->
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="bug_state" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="模块名称" align="center" prop="moduleName" />
      <el-table-column label="版本" align="center" prop="version" />
      <el-table-column label="发现人" align="center" prop="proposerName" />
      <el-table-column label="解决人" align="center" prop="solverName" />
      <el-table-column label="来源" align="center" prop="source">
        <template #default="scope">
          <dict-tag :options="bug_source" :value="scope.row.source"/>
        </template>
      </el-table-column>
      <el-table-column label="优先级" align="center" prop="priority">
        <template #default="scope">
          <dict-tag :options="bug_priority" :value="scope.row.priority"/>
        </template>
      </el-table-column>
      <el-table-column label="严重程度" align="center" prop="severity">
        <template #default="scope">
          <dict-tag :options="bug_severity" :value="scope.row.severity"/>
        </template>
      </el-table-column>
      <el-table-column label="自定义级别" align="center" prop="customized">
        <template #default="scope">
          <dict-tag :options="bug_customized" :value="scope.row.customized"/>
        </template>
      </el-table-column>
      <el-table-column label="解决方案" align="center" prop="solution" />
      <el-table-column label="原因" align="center" prop="reason" />
<!--      <el-table-column label="发现时间" align="center" prop="DiscoverTime" width="180">-->
<!--        <template #default="scope">-->
<!--          <span>{{ parseTime(scope.row.DiscoverTime, '{y}-{m}-{d}') }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="分配时间" align="center" prop="assignTime" width="180">-->
<!--        <template #default="scope">-->
<!--          <span>{{ parseTime(scope.row.assignTime, '{y}-{m}-{d}') }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="确认时间" align="center" prop="confirmTime" width="180">-->
<!--        <template #default="scope">-->
<!--          <span>{{ parseTime(scope.row.confirmTime, '{y}-{m}-{d}') }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="实际解决时间" align="center" prop="actualTime" width="180">-->
<!--        <template #default="scope">-->
<!--          <span>{{ parseTime(scope.row.actualTime, '{y}-{m}-{d}') }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['quality:bug:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['quality:bug:remove']">删除</el-button>
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

    <!-- 添加或修改bug对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="bugsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="具体描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in bug_state"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="项目" prop="projectId">
          <el-select
              v-model="form.projectId"
              placeholder="请选择项目"
              clearable
              style="width: 150px"
              @change="queryFormModules();queryFormProposers()"
          >
            <el-option
                v-for="p in formProjects"
                :key="p.id"
                :label="p.name"
                :value="p.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="模块" prop="moduleId">
          <el-select
              v-model="form.moduleId"
              placeholder="请选择模块"
              clearable
              style="width: 150px"
          >
            <el-option
                v-for="p in formModules"
                :key="p.id"
                :label="p.moduleName"
                :value="p.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input v-model="form.version" placeholder="请输入版本" />
        </el-form-item>
        <el-form-item label="发现人" prop="proposerId">
          <el-select v-model="form.proposerId" placeholder="请选择发现人" clearable style="width: 150px">
            <el-option
                v-for="p in formProposers"
                :key="p.userId"
                :label="p.nickName"
                :value="p.userId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="解决人" prop="solverId">
          <el-select v-model="form.solverId" placeholder="请选择发现人" clearable style="width: 150px">
            <el-option
                v-for="p in formProposers"
                :key="p.userId"
                :label="p.nickName"
                :value="p.userId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="来源" prop="source">
<!--          <el-select v-model="form.source" placeholder="请选择来源" clearable style="width: 150px">-->
<!--            <el-option-->
<!--                v-for="dict in bug_source"-->
<!--                :key="dict.value"-->
<!--                :label="dict.label"-->
<!--                :value="dict.value"/>-->
<!--          </el-select>-->

          <el-radio-group v-model="form.source">
            <el-radio
                v-for="dict in bug_source"
                :key="dict.value"
                :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>

        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-radio-group v-model="form.priority">
            <el-radio
              v-for="dict in bug_priority"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="严重程度" prop="severity">
          <el-radio-group v-model="form.severity">
            <el-radio
              v-for="dict in bug_severity"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自定义级别" prop="customized" label-width="90px">
          <el-radio-group v-model="form.customized">
            <el-radio
              v-for="dict in bug_customized"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="formType === 1" label="解决方案" prop="solution">
          <el-input v-model="form.solution" placeholder="请输入解决方案" />
        </el-form-item>
        <el-form-item v-show="formType === 1" label="原因" prop="reason">
          <el-input v-model="form.reason" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="发现时间" prop="DiscoverTime">
          <el-date-picker clearable
            v-model="form.discoverTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择发现时间">
          </el-date-picker>
        </el-form-item>

<!--        <el-form-item label="分配时间" prop="assignTime">-->
<!--          <el-date-picker clearable-->
<!--            v-model="form.assignTime"-->
<!--            type="date"-->
<!--            value-format="YYYY-MM-DD"-->
<!--            placeholder="请选择分配时间">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->

<!--        <el-form-item vshowlabel="确认时间" prop="confirmTime">-->
<!--          <el-date-picker clearable-->
<!--            v-model="form.confirmTime"-->
<!--            type="date"-->
<!--            value-format="YYYY-MM-DD"-->
<!--            placeholder="请选择确认时间">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="实际解决时间" prop="actualTime">-->
<!--          <el-date-picker clearable-->
<!--            v-model="form.actualTime"-->
<!--            type="date"-->
<!--            value-format="YYYY-MM-DD"-->
<!--            placeholder="请选择实际解决时间">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->

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

<script setup name="Bugs">
import { listBugs, getBugs, delBugs, addBugs, updateBugs } from "@/api/quality/bug.js";
import {allProject} from '@/api/scheduling/project.js';
import {allModule} from '@/api/scheduling/module.js';
import {allUsers} from "@/api/system/user.js";

const { proxy } = getCurrentInstance();
const { bug_customized, bug_severity, bug_state, bug_priority,bug_source } = proxy.useDict('bug_customized', 'bug_severity', 'bug_state', 'bug_priority','bug_source');

const bugsList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const daterangeDiscoverTime = ref([]);
const daterangeAssignTime = ref([]);


const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    title: null,
    status: null,
    projectId: null,
    moduleId: null,
    version: null,
    proposerId: null,
    proposerName: null,
    solverId: null,
    solverName: null,
    source: null,
    priority: null,
    severity: null,
    customized: null,
    discoverTime: null,
    assignTime: null,
    confirmTime: null,
    actualTime: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

// 表单类型：0无 1新增，2修改
const formType = ref(0);
const projects = ref([]);
const modules = ref([]);
const formProjects = ref([]);
const formModules = ref([]);
const formProposers = ref([]);

function queryProjects() {
  allProject().then(response => {
    projects.value = response.data;
  });
}

function queryModules() {
  queryParams.value.moduleId = null;
  allModule({projectId:queryParams.value.projectId}).then(response => {
    modules.value = response.data;
  });
}
function queryFormProjects() {
  allProject().then(response => {
    formProjects.value = response.data;
  });
}

function queryFormProposers() {
  allUsers({projectId:form.value.projectId}).then(response => {
    formProposers.value = response.data;
  });
}

function queryFormModules() {
  form.value.moduleId = null;
  allModule({projectId:form.value.projectId}).then(response => {
    formModules.value = response.data;
  });
}
/** 查询bug列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  if (null != daterangeDiscoverTime && '' != daterangeDiscoverTime) {
    queryParams.value.params["beginDiscoverTime"] = daterangeDiscoverTime.value[0];
    queryParams.value.params["endDiscoverTime"] = daterangeDiscoverTime.value[1];
  }
  if (null != daterangeAssignTime && '' != daterangeAssignTime) {
    queryParams.value.params["beginAssignTime"] = daterangeAssignTime.value[0];
    queryParams.value.params["endAssignTime"] = daterangeAssignTime.value[1];
  }
  listBugs(queryParams.value).then(response => {
    bugsList.value = response.rows;
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
    createBy: null,
    updateBy: null,
    createTime: null,
    updateTime: null,
    title: null,
    description: null,
    status: null,
    projectId: null,
    moduleId: null,
    version: null,
    proposerId: null,
    source: null,
    priority: null,
    severity: null,
    customized: null,
    solution: null,
    reason: null,
    discoverTime: null,
    assignTime: null,
    confirmTime: null,
    actualTime: null
  };
  proxy.resetForm("bugsRef");
  queryFormProjects();
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeDiscoverTime.value = [];
  daterangeAssignTime.value = [];
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
  formType.value=1;
  open.value = true;
  title.value = "添加bug";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  formType.value=2;
  const _id = row.id || ids.value;
  // if(row.moduleName !== null){
  //   formModules.value =[
  //     {
  //       id:row.moduleId,
  //       moduleName:row.moduleName
  //     }
  //   ]
  // }
  form.value.projectId = row.projectId;
  queryFormModules();
  queryFormProposers();
  getBugs(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改bug";
  });
}

/** 提交按钮 */
function submitForm() {
  formType.value = 0;
  proxy.$refs["bugsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateBugs(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addBugs(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除bug编号为"' + _ids + '"的数据项？').then(function() {
    return delBugs(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('bugManage/bugs/export', {
    ...queryParams.value
  }, `bugs_${new Date().getTime()}.xlsx`)
}
queryProjects();
queryModules();
getList();
</script>
