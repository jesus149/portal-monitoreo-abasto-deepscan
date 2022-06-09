// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  urlServices: 'http://10.184.17.48:7003/ords/xxmab/',
  urlLogin: 'https://fcportaldes.femcom.net:8443/userapi/api/user/keys?',
  portalAcces: 'https://fcportaldes.femcom.net:8443/AccessControl/pages/login_form.jsf',
  production: false
};
