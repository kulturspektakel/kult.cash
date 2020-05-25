import {createHash} from 'crypto';

export default (data: string) => createHash('sha1').update(data).digest('hex');
