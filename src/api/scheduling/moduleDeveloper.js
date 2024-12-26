import request from '@/utils/request'

// 查询模块开发者列表
export function listModuleDeveloper(query) {
  return request({
    url: '/scheduling/moduleDeveloper/list',
    method: 'get',
    params: query
  })
}

// 查询模块开发者详细
export function getModuleDeveloper(id) {
  return request({
    url: '/scheduling/moduleDeveloper/' + id,
    method: 'get'
  })
}

// 新增模块开发者
export function addModuleDeveloper(data) {
  return request({
    url: '/scheduling/moduleDeveloper',
    method: 'post',
    data: data
  })
}

// 修改模块开发者
export function updateModuleDeveloper(data) {
  return request({
    url: '/scheduling/moduleDeveloper',
    method: 'put',
    data: data
  })
}

// 删除模块开发者
export function delModuleDeveloper(id) {
  return request({
    url: '/scheduling/moduleDeveloper/' + id,
    method: 'delete'
  })
}
