const qiniu = require('qiniu');
const config = require('../config');
const qiniuConfig = config('qiniu');

const mac = new qiniu.auth.digest.Mac(qiniuConfig.accessKey, qiniuConfig.secretKey);
const options = {
  scope: qiniuConfig.bucket
};
const cdnManager = new qiniu.cdn.CdnManager(mac);
const rsConfig = new qiniu.conf.Config();
rsConfig.zone = qiniu.zone.Zone_z2;
const bucketManager = new qiniu.rs.BucketManager(mac, rsConfig);

module.exports.refreshFile = function refreshFile(urls) {
  cdnManager.refreshUrls(urls, function (err, respBody, respInfo) {
    if (err) {
      throw err;
    }
    if (respInfo.statusCode == 200) {
      var jsonBody = JSON.parse(respBody);
    }
  });
}

/**
 * 文件上传七牛
 * @param {String} filepath 
 * @param {String} filename 
 */
module.exports.coverUploadFile = function coverUploadFile(filepath, filename) {
  console.log(filepath)
  const date = new Date();
  filename = `${date.getFullYear()}_${date.getMonth()}_${date.getDate()}/${filename}`;
  return new Promise((resolve, reject) => {
    const options = {
      scope: qiniuConfig.bucket + ":" + filename
    };
    //
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    const formUploader = new qiniu.form_up.FormUploader(new qiniu.conf.Config());
    const putExtra = new qiniu.form_up.PutExtra();

    formUploader.putFile(uploadToken, filename, filepath, putExtra, function (respErr,
      respBody, respInfo) {
      if (respErr) {
        throw respErr;
      }
      if (respInfo.statusCode == 200) {
        console.log(respBody);
        const url = `${qiniuConfig.protocol}://${qiniuConfig.origin}/${respBody.key}`;
        // refreshFile([url]);
        resolve(url);
      } else {
        console.log(respInfo.statusCode);
        console.log(respBody);
        reject(respBody);
      }
    })
  })
}

module.exports.deleteFile = function deleteFile(filename) {
  const key = `auto-tool/${filename}`
  return new Promise((resolve, reject) => {
    bucketManager.delete(qiniuConfig.bucket, key, function (err, respBody, respInfo) {
      if (err) {
        console.log('error:', err)
        reject(err)
      } else {
        console.log('success:')
        console.log(respInfo.statusCode)
        console.log(respBody)
        resolve(respBody)
      }
    })
  })
}
