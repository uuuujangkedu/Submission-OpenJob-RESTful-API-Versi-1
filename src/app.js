const express = require('express');

const usersRouter = require('./routes/users');
const authenticationsRouter = require('./routes/authentications');
const companiesRouter = require('./routes/companies');
const categoriesRouter = require('./routes/categories');
const jobsRouter = require('./routes/jobs');
const applicationsRouter = require('./routes/applications');
const bookmarksRouter = require('./routes/bookmarks');
const profileRouter = require('./routes/profile');

const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());

app.use(usersRouter);
app.use(authenticationsRouter);
app.use(companiesRouter);
app.use(categoriesRouter);
app.use(bookmarksRouter); // /jobs/:jobId/bookmark* + /bookmarks (didaftarkan sebelum jobsRouter)
app.use(jobsRouter);
app.use(applicationsRouter);
app.use(profileRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
