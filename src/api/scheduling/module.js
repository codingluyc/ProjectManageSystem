import request from '@/utils/request'

// 查询模块列表
export function listModule(query) {
  return request({
    url: '/scheduling/module/list',
    method: 'get',
    params: query
  })
}

// 查询模块列表
export function allModule(query) {
  return request({
    url: '/scheduling/module/allModule',
    method: 'get',
    params: query
  })
}

// 查询模块详细
export function getModule(id) {
  return request({
    url: '/scheduling/module/' + id,
    method: 'get'
  })
}

// 新增模块
export function addModule(data) {
  return request({
    url: '/scheduling/module',
    method: 'post',
    data: data
  })
}

// 修改模块
export function updateModule(data) {
  return request({
    url: '/scheduling/module',
    method: 'put',
    data: data
  })
}

// 删除模块
export function delModule(id) {
  return request({
    url: '/scheduling/module/' + id,
    method: 'delete'
  })
}
