var express = require('express'),
    databaseRouter = express.Router();
const path = require("path");

const Pool = require('pg').Pool
require('dotenv').config()

const CONSTANTS = require(path.join(process.cwd(), 'src', 'CONSTANTS.js'));

const APPNAME = process.env.APPNAME;
const TABLE_NAME = process.env.TABLENAME;
const TABLE_COLS = [
  {'name':'id', 'type':'integer'}, 
  {'name':'title', 'type':'text'}, 
  {'name':'url', 'type':'text'}, 
  {'name':'images', 'type':'text[]'}
];

var dbPool;
const openDBConnection = async () => {
  try {
    dbPool = await new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
/*   
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: 'luxonis22',
      port: 5432,
*/
    })
//    await dbPool.connect()
console.log(`### ${APPNAME} | Database | Test Query:`);
    const query = await dbPool.query(`SELECT NOW()`);
    console.log(query.rows)
console.log(`+++ ${APPNAME} | Database | Connection established.`);
    return true;

  } catch (error) {
console.log(`!!! ${APPNAME} | Database | Error: `+error);
    console.error(error)
  }
}

const closeDBConnection = async () => {
  try {
    await dbPool.end()
console.log(`### ${APPNAME} | Database | Connection closed.`);
  } catch (err) {
    console.error(err);
  }
}

const areThereDBRecords = async () => {
  try {
    const client = await dbPool.connect()
    const query = await client.query(`SELECT * FROM ${TABLE_NAME}`)
    return (query.rowCount >= CONSTANTS.NUM_OF_POSTS);
/*
    const query = await dbPool.query(`SELECT * FROM ${TABLE_NAME}`)
    return (query.rowCount >= CONSTANTS.NUM_OF_POSTS);
*/
  } catch (err) {
    console.error(err);
  }
}

databaseRouter
  .get('/posts', async (req, res, next) => {
console.log(`### ${APPNAME} | Database | GET /posts`);
    try {
      const query = await dbPool.query(`SELECT * FROM ${TABLE_NAME}`)
      res.status(201).json({ posts: query.rows })
    } catch (error) {
      console.error(error)
    }
  })

  .post('/posts', async (req, res, next) => {
console.log(`### ${APPNAME} | Database | POST /posts`);
//console.log(req['body']);
    const postsArray = req['body'];

    try {
/*      
      const postTitle = 'testtitle';
      const postUrl = 'http://google.com';
      const postImages = ['http://google.com/image/1','http://google.com/image/2','http://google.com/image/3'];

      const sqlQuery = `INSERT INTO ${TABLE_NAME} (${TABLE_COLS[1]['name']}, ${TABLE_COLS[2]['name']}, ${TABLE_COLS[3]['name']}) VALUES ($1, $2, $3)`;
      await dbPool.query(sqlQuery, [postTitle, postUrl, postImages], (error, results) => {
        if (error) {
          throw error
        }
        console.log(`Post added with ID: ${results.insertId}`);
      })
*/

      // INSERT MANY RECORDS

console.log(`--- ${APPNAME} | Database | POST /posts | inserting new records..`);
//      const sqlQuery = `INSERT INTO ${TABLE_NAME} (${TABLE_COLS[1]['name']}, ${TABLE_COLS[2]['name']}, ${TABLE_COLS[3]['name']}) SELECT * FROM UNNEST ($1::${TABLE_COLS[1]['type']}, $2::${TABLE_COLS[2]['type']}, $3::${TABLE_COLS[3]['type']})`;
      const sqlQuery = `
        INSERT INTO ${TABLE_NAME} (${TABLE_COLS[1]['name']}, ${TABLE_COLS[2]['name']}, ${TABLE_COLS[3]['name']}) 
        SELECT * FROM json_to_recordset($1) AS x(${TABLE_COLS[1]['name']} ${TABLE_COLS[1]['type']}, ${TABLE_COLS[2]['name']} ${TABLE_COLS[2]['type']}, ${TABLE_COLS[3]['name']} ${TABLE_COLS[3]['type']})
      `;
      await dbPool.query(sqlQuery,[ JSON.stringify(postsArray) ], (error, results) => {
        if (error) {
          throw error
        }
console.log(`+++ ${APPNAME} | Database | POST /posts | ${results.rowCount} records inserted`);
        res.status(200).json({ text: 'OK' });
      })

    } catch (error) {
      console.error(error)
    }
  })


module.exports = { 
  router: databaseRouter,
  openDBConnection: openDBConnection,
  closeDBConnection: closeDBConnection,
  areThereDBRecords: areThereDBRecords
}
