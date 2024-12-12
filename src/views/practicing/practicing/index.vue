<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="证件名称" prop="licenseName">
        <el-input
          v-model="queryParams.licenseName"
          placeholder="请输入证件名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="机构名称" prop="authorityName">
        <el-input
          v-model="queryParams.authorityName"
          placeholder="请输入机构名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="法定代表人" prop="legalRepresentative">
        <el-input
          v-model="queryParams.legalRepresentative"
          placeholder="请输入法定代表人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input
          v-model="queryParams.address"
          placeholder="请输入地址"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主要负责人" prop="personChieflyHeldResponsible">
        <el-input
          v-model="queryParams.personChieflyHeldResponsible"
          placeholder="请输入主要负责人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="登记号" prop="registrationNumber">
        <el-input
          v-model="queryParams.registrationNumber"
          placeholder="请输入登记号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="有效期限自" prop="effectiveDateFrom">
        <el-date-picker clearable
          v-model="queryParams.effectiveDateFrom"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择有效期限自">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="有效期限至" prop="effectiveDateTo">
        <el-date-picker clearable
          v-model="queryParams.effectiveDateTo"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择有效期限至">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="发证机关" prop="licenceIssuingAuthority">
        <el-input
          v-model="queryParams.licenceIssuingAuthority"
          placeholder="请输入发证机关"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="医疗机构性质" prop="natureOfMedicalInstitutions">
        <el-input
          v-model="queryParams.natureOfMedicalInstitutions"
          placeholder="请输入医疗机构性质"
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
          v-hasPermi="['practicing:practicing:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['practicing:practicing:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['practicing:practicing:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['practicing:practicing:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="practicingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="" align="center" prop="id" />
      <el-table-column label="证件名称" align="center" prop="licenseName" />
      <el-table-column label="机构名称" align="center" prop="authorityName" />
      <el-table-column label="法定代表人" align="center" prop="legalRepresentative" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="主要负责人" align="center" prop="personChieflyHeldResponsible" />
      <el-table-column label="诊疗科目" align="center" prop="medicalSubjects" />
      <el-table-column label="登记号" align="center" prop="registrationNumber" />
      <el-table-column label="有效期限自" align="center" prop="effectiveDateFrom" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.effectiveDateFrom, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效期限至" align="center" prop="effectiveDateTo" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.effectiveDateTo, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发证机关" align="center" prop="licenceIssuingAuthority" />
      <el-table-column label="医疗机构性质" align="center" prop="natureOfMedicalInstitutions" />
      <el-table-column label="证件照片url" align="center" prop="licenseUrl" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['practicing:practicing:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['practicing:practicing:remove']">删除</el-button>
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

    <!-- 添加或修改执业许可证对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="practicingRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="证件名称" prop="licenseName">
          <el-input v-model="form.licenseName" placeholder="请输入证件名称" />
        </el-form-item>
        <el-form-item label="机构名称" prop="authorityName">
          <el-input v-model="form.authorityName" placeholder="请输入机构名称" />
        </el-form-item>
        <el-form-item label="法定代表人" prop="legalRepresentative">
          <el-input v-model="form.legalRepresentative" placeholder="请输入法定代表人" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="主要负责人" prop="personChieflyHeldResponsible">
          <el-input v-model="form.personChieflyHeldResponsible" placeholder="请输入主要负责人" />
        </el-form-item>
        <el-form-item label="诊疗科目" prop="medicalSubjects">
          <el-input v-model="form.medicalSubjects" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="登记号" prop="registrationNumber">
          <el-input v-model="form.registrationNumber" placeholder="请输入登记号" />
        </el-form-item>
        <el-form-item label="有效期限自" prop="effectiveDateFrom">
          <el-date-picker clearable
            v-model="form.effectiveDateFrom"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择有效期限自">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="有效期限至" prop="effectiveDateTo">
          <el-date-picker clearable
            v-model="form.effectiveDateTo"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择有效期限至">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发证机关" prop="licenceIssuingAuthority">
          <el-input v-model="form.licenceIssuingAuthority" placeholder="请输入发证机关" />
        </el-form-item>
        <el-form-item label="医疗机构性质" prop="natureOfMedicalInstitutions">
          <el-input v-model="form.natureOfMedicalInstitutions" placeholder="请输入医疗机构性质" />
        </el-form-item>
        <el-form-item label="证件照片url" prop="licenseUrl">
          <el-input v-model="form.licenseUrl" type="textarea" placeholder="请输入内容" />
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

<script setup name="Practicing">
import { listPracticing, getPracticing, delPracticing, addPracticing, updatePracticing } from "@/api/practicing/practicing";

const { proxy } = getCurrentInstance();

const practicingList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    licenseName: null,
    authorityName: null,
    legalRepresentative: null,
    address: null,
    personChieflyHeldResponsible: null,
    medicalSubjects: null,
    registrationNumber: null,
    effectiveDateFrom: null,
    effectiveDateTo: null,
    licenceIssuingAuthority: null,
    natureOfMedicalInstitutions: null,
    licenseUrl: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询执业许可证列表 */
function getList() {
  loading.value = true;
  listPracticing(queryParams.value).then(response => {
    practicingList.value = response.rows;
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
    updateTime: null,
    updateBy: null,
    createTime: null,
    createBy: null,
    licenseName: null,
    authorityName: null,
    legalRepresentative: null,
    address: null,
    personChieflyHeldResponsible: null,
    medicalSubjects: null,
    registrationNumber: null,
    effectiveDateFrom: null,
    effectiveDateTo: null,
    licenceIssuingAuthority: null,
    natureOfMedicalInstitutions: null,
    licenseUrl: null
  };
  proxy.resetForm("practicingRef");
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
  title.value = "添加执业许可证";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getPracticing(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改执业许可证";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["practicingRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updatePracticing(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPracticing(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除执业许可证编号为"' + _ids + '"的数据项？').then(function() {
    return delPracticing(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('practicing/practicing/export', {
    ...queryParams.value
  }, `practicing_${new Date().getTime()}.xlsx`)
}

getList();
</script>
