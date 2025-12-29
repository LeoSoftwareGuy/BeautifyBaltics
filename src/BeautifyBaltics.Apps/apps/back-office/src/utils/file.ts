import { v4 as uuidv4 } from 'uuid';

type FileOptions = {
  onError?: (error: string) => void;
};

/**
 * Downloads a file from the given URL and saves it to the local file system.
 * @param url The URL of the file to download.
 * @param data The data to send with the request.
 * @param options Optional parameters for the download.
 */
const download = async (url: string, data: any, options: FileOptions) => {
  const result = await getFile(url, data);

  if (!result) {
    options.onError?.('Failed to fetch the file');
    return;
  }

  const blob = await result.blob();
  const fileURL = URL.createObjectURL(blob);
  const fileName = getFilenameFromContentDisposition(result.headers);

  if (!fileName) {
    options.onError?.('Filename not found in response headers');
    return;
  }

  const link = createLink(fileURL, fileName);

  link.click();
  link.remove();

  URL.revokeObjectURL(fileURL);
};

/**
 * Downloads a file from a data URI and saves it to the local file system.
 * @param uri The data URI of the file to download.
 */
const downloadDataUri = (uri: string) => {
  const fileExtension = uri.split(';')[0].split('/')[1];
  const fileName = `${uuidv4()}-${Date.now()}.${fileExtension}`;
  const link = createLink(uri, fileName);

  link.click();
  link.remove();
};

/**
 * Opens a file from the given URL in a new tab.
 * @param url The URL of the file to open.
 * @param data The data to send with the request.
 * @param options Optional parameters for the download.
 */
const open = async (url: string, data: any, options: FileOptions) => {
  const result = await getFile(url, data);

  if (!result) {
    options.onError?.('Failed to fetch the file');
    return;
  }

  const blob = await result.blob();
  const fileURL = URL.createObjectURL(blob);
  window.open(fileURL);

  URL.revokeObjectURL(fileURL);
};

const getFile = async (url: string, data: any): Promise<Response | null> => {
  const result = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
  if (result.ok) return result;
  return null;
};

const createLink = (url: string, fileName: string): HTMLAnchorElement => {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  return link;
};

/**
 * Extracts a filename from a Content-Disposition header.
 * @param {string} headers The headers object containing the Content-Disposition header.
 * @returns {string|null} The decoded filename, or null if none found.
 */
const getFilenameFromContentDisposition = (headers: Headers): string | null => {
  const header = headers.get('content-disposition');

  if (!header) return null;

  const extendedMatch = header.match(/filename\*\s*=\s*(?:UTF-8'')?([^;]+)/i);
  if (extendedMatch) {
    try {
      return decodeURIComponent(extendedMatch[1].trim().replace(/(^"|"$)/g, ''));
    } catch (e) {
      return extendedMatch[1].trim().replace(/(^"|"$)/g, '');
    }
  }

  const basicMatch = header.match(/filename\s*=\s*"?(.*?)"?(?:;|$)/i);
  if (basicMatch) return basicMatch[1];

  return null;
};

const file = { download, downloadDataUri, open };

export default file;
