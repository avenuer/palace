import moment from 'moment';
import MemberOperations, { formatDate } from './members';

export const memberUtils = MemberOperations;

const logger = require('js-logger');
logger.useDefaults();
// window.require('electron').remote.getGlobal('logger');
const { log, info, warn, debug } = logger;

const nullDbError = new Error('Missing Request from the database');
const dialog = window.require('electron').remote.getGlobal('dialog');

export default {
  /** throwError by checking if truthful */
  throwError(e) {
    if (e) {
      throw e;
    }
  },
  /** checks the value for a null value */
  nullError(value) {
    if (value === null) {
      throw nullDbError;
    }
  },
  formatDate,
};

export const logs = {
  log,
  info,
  warn,
  debug,
};

export const notify = {
  error: dialog.showErrorBox,
  success() { },
};

const days = [];
for (let i = 0; i < 31; i++) { // eslint-disable-line
  days.push(i);
}

export const calender = {
  months: moment.months(),
  days,
};

