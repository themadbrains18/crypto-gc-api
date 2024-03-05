"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = () => {
    let record = {
        // database config add here
        // database: {
        //   db_urname: "root",
        //   db_pass: "123456",
        //   db_port: 3306,
        //   db_host: "127.0.0.1",
        //   db_name: "exchanage",
        //   optional: {
        //     dialect: "postgres",
        //     sync: {
        //       force: true,
        //     },
        //   },
        // },
        database: {
            db_urname: "avnadmin",
            db_pass: "AVNS_opzZTPNga4u2iyOcd4q",
            db_port: 17612,
            db_host: "mysql-3f67f905-surinderkumar-310c.a.aivencloud.com",
            db_name: "exchanage",
            optional: {
                dialect: "mysql",
                sync: {
                    force: true,
                },
                dialectModule: require('mysql2')
            },
        },
        // email config add here 
        email_service: false,
        email_config: {},
    };
    return record;
};
exports.default = config;
