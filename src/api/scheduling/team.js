import request from '@/utils/request'

// 查询项目团队列表
export function listTeam(query) {
  return request({
    url: '/scheduling/team/list',
    method: 'get',
    params: query
  })
}

//查询不在项目中的成员
export function listNotInProject(query) {
  console.log(query)
  return request({
    url: '/scheduling/team/userNotInProject',
    method: 'get',
    params: query
  })
}

// 查询项目团队详细
export function getTeam(id) {
  return request({
    url: '/scheduling/team/' + id,
    method: 'get'
  })
}

// 新增项目团队
export function addTeam(data) {
  return request({
    url: '/scheduling/team',
    method: 'post',
    data: data
  })
}


// 新增项目团队
export function addTeams(data) {
  return request({
    url: '/scheduling/team/addTeams',
    method: 'post',
    data: data
  })
}

// 修改项目团队
export function updateTeam(data) {
  return request({
    url: '/scheduling/team',
    method: 'put',
    data: data
  })
}

// 删除项目团队
export function delTeam(id) {
  return request({
    url: '/scheduling/team/' + id,
    method: 'delete'
  })
}
