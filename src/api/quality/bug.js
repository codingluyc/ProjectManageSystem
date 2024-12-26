import request from '@/utils/request'

// 查询bug列表
export function listBugs(query) {
  return request({
    url: '/bugManage/bugs/list',
    method: 'get',
    params: query
  })
}

// 查询bug详细
export function getBugs(id) {
  return request({
    url: '/bugManage/bugs/' + id,
    method: 'get'
  })
}

// 新增bug
export function addBugs(data) {
  return request({
    url: '/bugManage/bugs',
    method: 'post',
    data: data
  })
}

// 修改bug
export function updateBugs(data) {
  return request({
    url: '/bugManage/bugs',
    method: 'put',
    data: data
  })
}

// 删除bug
export function delBugs(id) {
  return request({
    url: '/bugManage/bugs/' + id,
    method: 'delete'
  })
}
