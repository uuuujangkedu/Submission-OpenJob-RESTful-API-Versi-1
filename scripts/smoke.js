require('dotenv').config();
const assert = require('assert');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

const PORT = 3999;
const base = `http://localhost:${PORT}`;

const req = async (method, path, { token, body } = {}) => {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(base + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
};

const run = async () => {
  const server = app.listen(PORT);

  // Users
  const reg = await req('POST', '/users', { body: { name: 'John', email: 'john@example.com', password: 'secret123' } });
  assert.strictEqual(reg.status, 201, 'register 201');
  const userId = reg.body.data.id;

  const dup = await req('POST', '/users', { body: { name: 'John', email: 'john@example.com', password: 'secret123' } });
  assert.strictEqual(dup.status, 400, 'duplicate email 400');

  const badReg = await req('POST', '/users', { body: { name: 'J', email: 'j@x.com', password: '123' } });
  assert.strictEqual(badReg.status, 400, 'short password 400');

  assert.strictEqual((await req('GET', `/users/${userId}`)).status, 200, 'get user 200');
  assert.strictEqual((await req('GET', '/users/xxx')).status, 404, 'unknown user 404');

  // Authentications
  const login = await req('POST', '/authentications', { body: { email: 'john@example.com', password: 'secret123' } });
  assert.strictEqual(login.status, 200, 'login 200');
  const { accessToken, refreshToken } = login.body.data;
  assert.strictEqual((await req('POST', '/authentications', { body: { email: 'john@example.com', password: 'wrong' } })).status, 401, 'wrong password 401');
  assert.strictEqual((await req('POST', '/authentications', { body: {} })).status, 400, 'login invalid 400');

  const decoded = jwt.decode(accessToken);
  assert.strictEqual(decoded.id, userId, 'access token id');
  assert.strictEqual(decoded.exp - decoded.iat, 10800, 'access token 3h');

  const refreshed = await req('PUT', '/authentications', { body: { refreshToken } });
  assert.strictEqual(refreshed.status, 200, 'refresh 200');
  assert.strictEqual((await req('PUT', '/authentications', { body: { refreshToken: accessToken } })).status, 400, 'refresh with access token 400');
  assert.strictEqual((await req('PUT', '/authentications', { body: { refreshToken: 'xxx' } })).status, 400, 'unknown refresh 400');

  // Protected without token
  assert.strictEqual((await req('POST', '/companies', { body: { name: 'A', location: 'B' } })).status, 401, 'no token 401');
  assert.strictEqual((await req('DELETE', '/companies/xxx')).status, 401, 'protected before 404');

  // Companies
  const comp = await req('POST', '/companies', { token: accessToken, body: { name: 'OpenJob Inc', location: 'Jakarta', description: 'desc' } });
  assert.strictEqual(comp.status, 201, 'create company 201');
  const companyId = comp.body.data.id;
  assert.strictEqual((await req('POST', '/companies', { token: accessToken, body: {} })).status, 400, 'company invalid 400');
  assert.strictEqual((await req('GET', '/companies')).status, 200, 'list companies 200');
  assert.strictEqual((await req('GET', `/companies/${companyId}`)).status, 200, 'get company 200');
  assert.strictEqual((await req('GET', '/companies/xxx')).status, 404, 'company 404');
  assert.strictEqual((await req('PUT', `/companies/${companyId}`, { token: accessToken, body: { name: 'OpenJob Corp', location: 'Bandung' } })).status, 200, 'update company 200');
  assert.strictEqual((await req('PUT', '/companies/xxx', { token: accessToken, body: { name: 'X', location: 'Y' } })).status, 404, 'update company 404');

  // Categories
  const cat = await req('POST', '/categories', { token: accessToken, body: { name: 'Engineering' } });
  assert.strictEqual(cat.status, 201, 'create category 201');
  const categoryId = cat.body.data.id;
  assert.strictEqual((await req('POST', '/categories', { token: accessToken, body: { name: 'Engineering' } })).status, 400, 'duplicate category 400');
  assert.strictEqual((await req('POST', '/categories', { token: accessToken, body: { name: '' } })).status, 400, 'empty name 400');
  assert.strictEqual((await req('GET', `/categories/${categoryId}`)).status, 200, 'get category 200');
  assert.strictEqual((await req('GET', '/categories/xxx')).status, 404, 'category 404');

  // Jobs
  const jobPayload = {
    company_id: companyId,
    category_id: categoryId,
    title: 'Backend Engineer',
    description: 'Build APIs',
    job_type: 'full-time',
    experience_level: 'senior',
    location_type: 'remote',
    location_city: 'Jakarta',
    salary_min: 5000000,
    salary_max: 9000000,
    is_salary_visible: true,
    status: 'open',
  };
  const job = await req('POST', '/jobs', { token: accessToken, body: jobPayload });
  assert.strictEqual(job.status, 201, 'create job 201');
  const jobId = job.body.data.id;
  assert.strictEqual((await req('POST', '/jobs', { token: accessToken, body: {} })).status, 400, 'job invalid 400');
  assert.strictEqual((await req('POST', '/jobs', { token: accessToken, body: { title: 'x', company_id: 'xxx' } })).status, 400, 'job invalid 2 400');

  const list = await req('GET', '/jobs');
  assert.strictEqual(list.status, 200, 'list jobs 200');
  assert.ok(list.body.data.jobs[0].company_name, 'job has company_name');
  assert.strictEqual((await req('GET', `/jobs/${jobId}`)).status, 200, 'get job 200');
  assert.strictEqual((await req('GET', '/jobs/xxx')).status, 404, 'job 404');
  assert.strictEqual((await req('GET', `/jobs/company/${companyId}`)).status, 200, 'jobs by company 200');
  assert.strictEqual((await req('GET', '/jobs/company/xxx')).status, 200, 'jobs by unknown company 200 empty');
  assert.strictEqual((await req('GET', `/jobs/category/${categoryId}`)).status, 200, 'jobs by category 200');
  assert.strictEqual((await req('GET', '/jobs?title=&company-name=')).status, 200, 'search empty 200');
  assert.strictEqual((await req('GET', '/jobs?title=Backend')).body.data.jobs.length, 1, 'search title hit');
  assert.strictEqual((await req('GET', '/jobs?title=zzz')).body.data.jobs.length, 0, 'search miss empty');
  assert.strictEqual((await req('GET', '/jobs?company-name=OpenJob')).body.data.jobs.length, 1, 'search company hit');
  assert.strictEqual((await req('PUT', `/jobs/${jobId}`, { token: accessToken, body: { ...jobPayload, status: 'close' } })).status, 200, 'update job 200');
  assert.strictEqual((await req('PUT', '/jobs/xxx', { token: accessToken, body: jobPayload })).status, 404, 'update job 404');

  // Applications
  const appli = await req('POST', '/applications', { token: accessToken, body: { user_id: userId, job_id: jobId, status: 'pending' } });
  assert.strictEqual(appli.status, 201, 'create application 201');
  const applicationId = appli.body.data.id;
  assert.strictEqual((await req('POST', '/applications', { token: accessToken, body: { user_id: userId, job_id: jobId } })).status, 400, 'duplicate application 400');
  assert.strictEqual((await req('POST', '/applications', { token: accessToken, body: { user_id: 'xxx', job_id: jobId } })).status, 404, 'unknown user 404');
  assert.strictEqual((await req('GET', '/applications', { token: accessToken })).status, 200, 'list applications 200');
  assert.strictEqual((await req('GET', `/applications/${applicationId}`, { token: accessToken })).status, 200, 'get application 200');
  assert.strictEqual((await req('GET', `/applications/user/${userId}`, { token: accessToken })).status, 200, 'applications by user 200');
  assert.strictEqual((await req('GET', '/applications/user/xxx', { token: accessToken })).status, 200, 'unknown user 200 empty');
  assert.strictEqual((await req('GET', `/applications/job/${jobId}`, { token: accessToken })).status, 200, 'applications by job 200');
  assert.strictEqual((await req('GET', '/applications/xxx', { token: accessToken })).status, 404, 'application 404');
  assert.strictEqual((await req('PUT', `/applications/${applicationId}`, { token: accessToken, body: { status: 'accepted' } })).status, 200, 'update application 200');

  // Bookmarks
  const bm = await req('POST', `/jobs/${jobId}/bookmark`, { token: accessToken });
  assert.strictEqual(bm.status, 201, 'create bookmark 201');
  const bookmarkId = bm.body.data.id;
  assert.strictEqual((await req('POST', `/jobs/${jobId}/bookmark`, { token: accessToken })).status, 400, 'duplicate bookmark 400');
  assert.strictEqual((await req('POST', '/jobs/xxx/bookmark', { token: accessToken })).status, 404, 'bookmark unknown job 404');
  assert.strictEqual((await req('GET', `/jobs/${jobId}/bookmark/${bookmarkId}`, { token: accessToken })).status, 200, 'get bookmark 200');
  assert.strictEqual((await req('GET', `/jobs/${jobId}/bookmark/xxx`, { token: accessToken })).status, 404, 'bookmark 404');
  assert.strictEqual((await req('GET', '/bookmarks', { token: accessToken })).status, 200, 'list bookmarks 200');
  assert.strictEqual((await req('DELETE', `/jobs/${jobId}/bookmark`, { token: accessToken })).status, 200, 'delete bookmark 200');
  assert.strictEqual((await req('DELETE', `/jobs/${jobId}/bookmark`, { token: accessToken })).status, 404, 'delete bookmark 404');

  // Profile
  assert.strictEqual((await req('GET', '/profile', { token: accessToken })).status, 200, 'profile 200');
  assert.strictEqual((await req('GET', '/profile', { token: accessToken })).body.data.password, undefined, 'profile no password');
  assert.strictEqual((await req('GET', '/profile/applications', { token: accessToken })).status, 200, 'profile applications 200');
  assert.strictEqual((await req('GET', '/profile/bookmarks', { token: accessToken })).status, 200, 'profile bookmarks 200');
  assert.strictEqual((await req('GET', '/profile')).status, 401, 'profile no token 401');

  // Unknown route -> JSON 404
  const notFound = await req('GET', '/does-not-exist');
  assert.strictEqual(notFound.status, 404, 'unknown route 404');
  assert.strictEqual(notFound.body.status, 'failed', 'unknown route json');

  // Logout
  assert.strictEqual((await req('DELETE', '/authentications', { token: accessToken, body: { refreshToken } })).status, 200, 'logout 200');
  assert.strictEqual((await req('PUT', '/authentications', { body: { refreshToken } })).status, 400, 'refresh after logout 400');

  // Delete job + company
  assert.strictEqual((await req('DELETE', `/jobs/${jobId}`, { token: accessToken })).status, 200, 'delete job 200');
  assert.strictEqual((await req('DELETE', `/companies/${companyId}`, { token: accessToken })).status, 200, 'delete company 200');

  server.close();
  await require('../src/config/db').end();
  console.log('SMOKE OK — semua assertion lulus');
};

run().catch(async (err) => {
  console.error('SMOKE GAGAL:', err.message);
  await require('../src/config/db').end();
  process.exit(1);
});
