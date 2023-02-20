export const httpErrors = {
  // user error
  ACCOUNT_NOT_FOUND: {
    message: 'Account not found.',
    code: 'USER_00000',
  },
  ACCOUNT_EXISTED: {
    message: 'Account already existed.',
    code: 'USER_00001',
  },
  ACCOUNT_INCORRECT: {
    message: 'email or password incorrect.',
    code: 'USER_00002',
  },
  UNAUTHORIZED: {
    message: 'Unauthorized user.',
    code: 'USER_00003',
  },
  ACTIVATION_TOKEN_EXPIRED: {
    message: 'Activation tokens is expired.',
    code: 'USER_00004',
  },
  REFRESH_TOKEN_EXPIRED: {
    message: 'Refresh tokens is expired.',
    code: 'USER_00005',
  },
  ACCESS_TOKEN_EXPIRED: {
    message: 'Refresh tokens is expired.',
    code: 'USER_00006',
  },
  FORBIDDEN: {
    message: 'You are not authorized to access this resource.',
    code: 'USER_00007',
  },
  USER_EMAIL_NOT_EXISTED: {
    message: 'This email does not exist.',
    code: 'USER_00008',
  },
  CHANGE_PASSWORD_FAILED: {
    message: 'Change password fail.',
    code: 'USER_00009',
  },
  OLD_PASSWORD_INCORRECT: {
    message: 'Old password incorrect',
    code: 'USER_00010',
  },

  // image error
  UPLOAD_IMAGE_FAILED: {
    message: 'Upload image failed',
    code: 'UPLOAD_00001',
  },
  WRONG_FILE_FORMAT: {
    message: 'Wrong file format',
    code: 'UPLOAD_00002',
  },
  UPLOAD_IMAGE_EXISTED: {
    message: 'Upload image existed',
    code: 'UPLOAD_00003',
  },
  UPLOAD_IMAGE_NOT_FOUND: {
    message: 'Upload image not found',
    code: 'UPLOAD_00004',
  },

  // post error
  POST_NOT_FOUND: {
    message: 'Post not found.',
    code: 'POST_00001',
  },
};
