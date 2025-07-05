/** @type {import('zod2md'.Config)} */
const config = {
  title: 'User REST API',
  entry: [
    './endpoints/get-users.mjs',
    './endpoints/get-user.mjs',
    './endpoints/create-user.mjs',
    './endpoints/update-user.mjs',
    './endpoints/delete-user.mjs',
  ],
  output: '../../../../tmp/config/user-rest-api.md',
};

export default config;
