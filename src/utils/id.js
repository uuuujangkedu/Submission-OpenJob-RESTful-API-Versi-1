const { randomUUID } = require('crypto');

module.exports = (prefix) => `${prefix}-${randomUUID()}`;
