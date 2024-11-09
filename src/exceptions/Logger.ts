import winston from 'winston';

/**
 * An object defining custom logging levels and their corresponding colors for a logging system.
 * 
 * @type {{ levels: { trace: number, debug: number, info: number, warn: number, error: number, fatal: number },
*         colors: { trace: string, debug: string, info: string, warn: string, error: string, fatal: string } }}
* 
* @description
* The `customLevels` object provides a set of custom logging levels with numeric severity indicators and 
* corresponding color codes for easier identification when displaying log messages.
*/
const customLevels = {
    /**
     * The numeric severity of logging levels. Lower numbers indicate higher severity.
     */
    levels: {
      trace: 5,
      debug: 4,
      info: 3,
      warn: 2,
      error: 1,
      fatal: 0,
    },
    colors: {
      trace: 'white',
      debug: 'green',
      info: 'green',
      warn: 'yellow',
      error: 'red',
      fatal: 'red',
    },
   };
    
  /**
   * The color codes associated with each logging level for display purposes.
   */
   const formatter = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.splat(),
    winston.format.printf((info) => {
      const { timestamp, level, message, ...meta } = info;
    
      return `${timestamp} [${level}]: ${message} ${
        Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
      }`;
    }),
   );
    
   class Logger {
    private logger: winston.Logger;
    
    constructor() {
      const prodTransport = new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      });
      const transport = new winston.transports.Console({
        format: formatter,
      });
      this.logger = winston.createLogger({
        level: true ? 'trace' : 'error',
        levels: customLevels.levels,
        transports: [ true ? transport : prodTransport],
      });
      winston.addColors(customLevels.colors);
    }
    
    trace(msg: any, meta?: any) {
      this.logger.log('trace', msg, meta);
    }
    
    debug(msg: any, meta?: any) {
      this.logger.debug(msg, meta);
    }
    
    info(msg: any, meta?: any) {
      this.logger.info(msg, meta);
    }
    
    warn(msg: any, meta?: any) {
      this.logger.warn(msg, meta);
    }
    
    error(msg: any, meta?: any) {
      this.logger.error(msg, meta);
    }
    
    fatal(msg: any, meta?: any) {
      this.logger.log('fatal', msg, meta);
    }
   }
    
   export const logger = new Logger();