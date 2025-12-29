import { filesize } from 'filesize';

const format = (byteCount: number | string | bigint) => filesize(byteCount, { base: 2, standard: 'jedec' }).toString();

const formattedFilesize = { format };

export default formattedFilesize;
