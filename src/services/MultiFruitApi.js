import { request } from '@umijs/max';

export async function login( data, options ) {
  return request('/prod-api/sysUserApiController/login', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function getUserInfo( params, options ) {
  return request('/prod-api/sysUserApiController/getInfo', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function getStageList( params, options ) {
  return request('/prod-api/stageApi/list', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function getSectionsList( params, options ) {
  return request('/prod-api/stageApi/getStageList', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function updateProgress( data, options ) {
  return request('/prod-api/stageApi/add', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
