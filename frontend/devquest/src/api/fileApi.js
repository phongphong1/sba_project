import axios from 'axios';
import axiosClient from './axiosClient';

const FILE_UPLOAD_LINK_ENDPOINT = '/r2/get-upload-url';
const PUBLIC_FILE_BASE_PATH = import.meta.env.VITE_PUBLIC_FILE_BASE_PATH;

function ensureFile(file) {
  if (!file?.name) {
    throw new Error('A valid file is required.');
  }
}

function getContentType(file) {
  return file?.type || 'application/octet-stream';
}

function getFileExtension(fileName) {
  const lastDotIndex = fileName.lastIndexOf('.');

  if (lastDotIndex <= 0 || lastDotIndex === fileName.length - 1) {
    return '';
  }

  return fileName.slice(lastDotIndex);
}

function createUniqueFileName(fileName) {
  const extension = getFileExtension(fileName);
  const uniqueId =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return `${Date.now()}-${uniqueId}${extension}`;
}

function resolveUploadLink(payload) {
  return payload?.uploadUrl ?? payload?.url ?? payload?.data?.uploadUrl ?? payload?.data?.url ?? payload;
}

function buildPublicFileUrl(fileName) {
  return `${PUBLIC_FILE_BASE_PATH.replace(/\/$/, '')}/${fileName}`;
}

function createProgressHandler(file, onProgress) {
  if (typeof onProgress !== 'function') {
    return undefined;
  }

  return (event) => {
    const loaded = event?.loaded ?? 0;
    const total = event?.total ?? file?.size ?? 0;
    const percent = total > 0 ? Math.round((loaded / total) * 100) : 0;

    onProgress(percent, event);
  };
}

async function getUploadLink(file, fileName = file?.name) {
  ensureFile(file);

  const payload = await axiosClient.get(FILE_UPLOAD_LINK_ENDPOINT, {
    params: {
      fileName,
      contentType: getContentType(file),
    },
  });

  const uploadLink = resolveUploadLink(payload);

  if (!uploadLink || typeof uploadLink !== 'string') {
    throw new Error('Upload link is missing from the server response.');
  }

  return uploadLink;
}

async function uploadToSignedUrl(file, options = {}) {
  const uniqueFileName = createUniqueFileName(file.name);
  const uploadLink = await getUploadLink(file, uniqueFileName);

  await axios.put(uploadLink, file, {
    headers: {
      'Content-Type': getContentType(file),
    },
    onUploadProgress: createProgressHandler(file, options.onProgress),
  });

  return buildPublicFileUrl(uniqueFileName);
}

const fileApi = {
  getUploadLink,
  uploadFile(file) {
    return uploadToSignedUrl(file);
  },
  uploadFileWithProgress(file, onProgress) {
    return uploadToSignedUrl(file, { onProgress });
  },
};

export const uploadFile = fileApi.uploadFile;
export const uploadFileWithProgress = fileApi.uploadFileWithProgress;

export default fileApi;
