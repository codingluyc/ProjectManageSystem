import request from '@/utils/request'

// 查询执业许可证列表
export function listPracticing(query) {
  return request({
    url: '/practicing/practicing/list',
    method: 'get',
    params: query
  })
}

// 查询执业许可证详细
export function getPracticing(id) {
  return request({
    url: '/practicing/practicing/' + id,
    method: 'get'
  })
}

// 新增执业许可证
export function addPracticing(data) {
  return request({
    url: '/practicing/practicing',
    method: 'post',
    data: data
  })
}

// 修改执业许可证
export function updatePracticing(data) {
  return request({
    url: '/practicing/practicing',
    method: 'put',
    data: data
  })
}

// 删除执业许可证
export function delPracticing(id) {
  return request({
    url: '/practicing/practicing/' + id,
    method: 'delete'
  })
}
