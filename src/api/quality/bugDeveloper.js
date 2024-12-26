import request from '@/utils/request'

// 查询bug开发人员列表
export function listDevloper(query) {
  return request({
    url: '/bugManage/devloper/list',
    method: 'get',
    params: query
  })
}

// 查询bug开发人员详细
export function getDevloper(id) {
  return request({
    url: '/bugManage/devloper/' + id,
    method: 'get'
  })
}

// 新增bug开发人员
export function addDevloper(data) {
  return request({
    url: '/bugManage/devloper',
    method: 'post',
    data: data
  })
}

// 修改bug开发人员
export function updateDevloper(data) {
  return request({
    url: '/bugManage/devloper',
    method: 'put',
    data: data
  })
}

// 删除bug开发人员
export function delDevloper(id) {
  return request({
    url: '/bugManage/devloper/' + id,
    method: 'delete'
  })
}
