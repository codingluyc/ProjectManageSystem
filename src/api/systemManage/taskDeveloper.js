import request from '@/utils/request'

// 查询任务-开发者列表
export function listTaskDeveloper(query) {
  return request({
    url: '/systemManage/taskDeveloper/list',
    method: 'get',
    params: query
  })
}

// 查询任务-开发者详细
export function getTaskDeveloper(id) {
  return request({
    url: '/systemManage/taskDeveloper/' + id,
    method: 'get'
  })
}

// 新增任务-开发者
export function addTaskDeveloper(data) {
  return request({
    url: '/systemManage/taskDeveloper',
    method: 'post',
    data: data
  })
}

// 修改任务-开发者
export function updateTaskDeveloper(data) {
  return request({
    url: '/systemManage/taskDeveloper',
    method: 'put',
    data: data
  })
}

// 删除任务-开发者
export function delTaskDeveloper(id) {
  return request({
    url: '/systemManage/taskDeveloper/' + id,
    method: 'delete'
  })
}
