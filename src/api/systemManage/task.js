import request from '@/utils/request'

// 查询任务列表
export function listTask(query) {
  return request({
    url: '/systemManage/task/list',
    method: 'get',
    params: query
  })
}

// 查询任务详细
export function getTask(id) {
  return request({
    url: '/systemManage/task/' + id,
    method: 'get'
  })
}

// 新增任务
export function addTask(data) {
  return request({
    url: '/systemManage/task',
    method: 'post',
    data: data
  })
}

// 修改任务
export function updateTask(data) {
  return request({
    url: '/systemManage/task',
    method: 'put',
    data: data
  })
}

// 删除任务
export function delTask(id) {
  return request({
    url: '/systemManage/task/' + id,
    method: 'delete'
  })
}
