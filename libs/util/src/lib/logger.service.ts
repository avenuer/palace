import * as pino from "pino";

export type logNameSpace = "default" | string;

/**
 * logging interface for logs
 *
 * @export
 * @interface Log
 */
export interface Log {
  /**
   * a string containging the loacation of the log
   * i.e LogComponent or LogService
   *
   * @type {string}
   * @memberof Log
   */
  trace: string;
  /**
   * custom log message passed to the object
   *
   * @type {string}
   * @memberof Log
   */
  message: string;
}

/**
 * a wrapper along js logger
 *
 * @export
 * @class LoggerService
 */
export class Logger {
  private logger: any; // : Logger;

  constructor(public loggerNameSpace: string, loglevel?: string) {
    this.logger = (pino as any)({
      name: loggerNameSpace,
      prettyPrint: true
    } as any);
    this.logger.level = (loglevel as any) || this.logger.level;
  }

  /**
   * validates if the log is a valid log object
   *
   * @param {Log} customLog
   * @memberof LoggerService
   */
  validate(customLog: Log) {
    if (
      !customLog ||
      typeof customLog.message !== "string" ||
      typeof customLog.trace !== "string"
    ) {
      throw logError;
    }
  }

  /**
   * wrapper for a cross platform logger
   *
   * @param {Log} customLog
   * @memberof LoggerService
   */
  public debug(customLog: Log, ...other: any[]) {
    // return this.info(customLog, ...other);
    this.validate(customLog);
    this.logger.debug(
      `${this.loggerNameSpace}:::${customLog.trace}:::${
        customLog.message
      }::${Date()}}`,
      other
    );
  }

  /**
   * wrapper for a cross platform logger
   *
   * @param {Log} customLog
   * @param {...any[]} other
   * @memberof LoggerService
   */
  log(customLog: Log, ...other: any[]) {
    return this.info(customLog, ...other);
  }

  /**
   * wrapper for a cross platform logger
   *
   * @param {Log} customLog
   * @param {...any[]} other
   * @memberof LoggerService
   */
  warn(customLog: Log, ...other: any[]) {
    this.validate(customLog);
    this.logger.warn(
      `${customLog.trace}:::${customLog.message}::${Date()}}`,
      other
    );
  }

  /**
   * wrapper for a cross platform logger
   *
   * @param {Log} customLog
   * @param {...any[]} other
   * @memberof LoggerService
   */
  info(customLog: Log, ...other: any[]) {
    this.validate(customLog);
    this.logger.info(
      `${customLog.trace}:::${customLog.message}::${Date()}}`,
      other
    );
  }

  /**
   * wrapper for a cross platform logger
   *
   * @param {Log} customLog
   * @param {...any[]} other
   * @memberof LoggerService
   */
  error(customLog: Log, ...other: any[]) {
    this.validate(customLog);
    this.logger.error(
      `${customLog.trace}:::${customLog.message}::${Date()}}`,
      other
    );
  }

  action(location: string, data: { type: string }) {
    this.log(
      {
        message: `loading payload`,
        trace: location
      },
      data
    );
  }
}

/** error object thrown when the log object is invalid */
export const logError = new Error(
  `expect a valid log to have a [trace and message] params`
);
