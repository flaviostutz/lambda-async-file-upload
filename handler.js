'use strict';

import uploadToThirdParty from './handlers/uploadToThirdParty'
import deleteS3File from './handlers/deleteS3File'
import scheduleUpload from './handlers/scheduleUpload'

module.exports = {
  scheduleUpload: scheduleUpload,
  deleteS3File: deleteS3File,
  uploadToThirdParty: uploadToThirdParty
}

