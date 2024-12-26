import request from '@/utils/request'

// 查询任务列表
export function listTask(query) {
  return request({
    url: '/scheduling/task/list',
    method: 'get',
    params: query
  })
}

// 查询任务列表
export function allTask(query) {
  return request({
    url: '/scheduling/task/allTask',
    method: 'get',
    params: query
  })
}
// 查询任务详细
export function getTask(id) {
  return request({
    url: '/scheduling/task/' + id,
    method: 'get'
  })
}

// 新增任务
export function addTask(data) {
  return request({
    url: '/scheduling/task',
    method: 'post',
    data: data
  })
}

// 修改任务
export function updateTask(data) {
  return request({
    url: '/scheduling/task',
    method: 'put',
    data: data
  })
}

// 删除任务
export function delTask(id) {
  return request({
    url: '/scheduling/task/' + id,
    method: 'delete'
  })
}
