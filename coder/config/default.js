module.exports = {
  port: 9999,
  jwtTokenSecret: 'JWT_TOKEN_SECRET',
  qiniu: {
    accessKey: 'ACCESS_KEY',
    secretKey: 'SECRETE_KEY',
    origin: 'ORIGIN',
    bucket: 'BUCKET',
    protocol: 'PROTOCOL',
    uploadURL: 'UPLOAD_URL'
  },
  uploadQiniuLimitSize: 524288,
  uploadLimitSize: 524288
};