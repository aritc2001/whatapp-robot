//Configuration for MySQL connection
function db_init() {
    const mysql = require('mysql');
    const db_config = require('./db_config.json');

    const db_connect = mysql.createConnection({
        host: db_config.db_connection.host,
        user: db_config.db_connection.user,
        password: db_config.db_connection.password,
        database: db_config.db_connection.database
    });

    return db_connect;
}

//Connect to MySQL database
function db_connect() {
    const db_connect = db_init();
    
    if (db_connect.state = 'disconnected') {
        db_connect.connect(function(error){
            if(error){
                console.error(error);
            } else {
                console.info("Connected to database '" + db_connect.config.database + "'");
            }
        })
    };

    return db_connect;
} 

//Create new database in MySQL
function db_create_database(db_connect) {
    const db_config = require('./db_config.json');
    const sql = "CREATE DATABASE " + db_config.db_connection.database;

    db_connect.query(sql, function (err, result) {
        if (err) console.log("Error when creating new database '" + db_config.db_connection.database + "' ==> " + err.code); //throw err.code
        else console.log("Database '"+ db_config.db_connection.database + "' is created");
    });
}

//Create new table in MySQL
function db_create_table(db_connect) {
    const db_config = require('./db_config.json');

    const sql = `CREATE TABLE ` + db_config.db_table_log.name + ` 
                (   aw_cl_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    aw_cl_number_from VARCHAR(20), 
                    aw_cl_message TEXT,
                    PRIMARY KEY (aw_cl_datetime, aw_cl_number_from)
                ) ENGINE = InnoDB;`;

    db_connect.query(sql, function (err, result) {
        if (err) console.log("Error when creating new table '" + db_config.db_table_log.name + "' ==> " + err.code); //throw err.code;
        else console.log("Table '" + db_config.db_table_log.name + "' is created");
    });
}

//Insert new record in table MySQL
function db_insert_record_log(db_connect, values) {
    const db_config = require('./db_config.json');
    const propOwn = Object.getOwnPropertyNames(values); //read object property to find object length
    let str_sql = '';

    for (let i = 0; i < propOwn.length; i++) {
        str_sql = str_sql + Object.values(values)[i]; //read value of object with index key i
        if (i != propOwn.length - 1) {
            str_sql = str_sql + ', ';
        }
    }
    
    str_sql = `INSERT INTO ` + db_config.db_table_log.name + ` ` + 
                `VALUES (` + str_sql + `);`

    db_connect.query(str_sql, function (err, result) {
        if (err) console.log("Error when inserting new record ==> " + err.code); //throw err.code;
        console.log("1 record inserted");
    });
} 

module.exports = {
    db_connect, 
    db_create_database, 
    db_create_table,
    db_insert_record_log
};