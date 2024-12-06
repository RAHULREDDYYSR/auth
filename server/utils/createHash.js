import crypto from 'crypto';

const hashString = (string) => crypto.createHash('mb5').update(string).digest('hex');
export default hashString