import { GenericStatus } from '@athena-types/genericStatus';
import {
  CreateMatrixRequestData,
  Matrix,
  MatrixBase,
} from '@athena-types/matrix';
import { SuccessMessages } from '@athena-types/messages';
import {
  PaginatedDataResponse,
  PaginatedRequestParams,
} from '@athena-types/paginatedData';
import Api from './api';

const baseUrl = '/matrix';

async function getPaginated(
  params?: PaginatedRequestParams
): Promise<PaginatedDataResponse<MatrixBase>> {
  return Api.get(baseUrl, { params, headers: { authHeader: true } }).then(
    (res) => res.data
  );
}

async function getByGuid(guid: string): Promise<Matrix> {
  return Api.get(`${baseUrl}/${guid}`, { headers: { authHeader: true } }).then(
    (res) => res.data
  );
}

async function create(data: CreateMatrixRequestData): Promise<MatrixBase> {
  return Api.post(baseUrl, data, {
    headers: { authHeader: true, 'success-message': SuccessMessages.MSGS03 },
  }).then((res) => res.data);
}

async function update(data: Matrix): Promise<MatrixBase> {
  return Api.put(`${baseUrl}/${data.guid}`, data, {
    headers: { authHeader: true, 'success-message': SuccessMessages.MSGS02 },
  }).then((res) => res.data);
}

async function changeStatus(
  guid: string,
  status: GenericStatus
): Promise<MatrixBase> {
  return Api.patch(
    `${baseUrl}/${guid}`,
    { status },
    { headers: { authHeader: true, 'success-message': SuccessMessages.MSGS04 } }
  ).then((res) => res.data);
}

export const matrixService = {
  getPaginated,
  getByGuid,
  create,
  update,
  changeStatus,
};
