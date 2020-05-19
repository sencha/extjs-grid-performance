import express from 'express';
import { getCount, createConnection } from '../helper/sqlHelper';
const router = express.Router();

/**
 * Generates and Sends the raw Data over the client on the basis of direct size.
 * @type {[type]}
 */
router.get('/getData', (req, res, next) => {
  const targetSize = parseInt(req.query.size, 10);
  const filter = parseInt(req.query.filter, 10);
  let tableName = req.query.tableName;
  const count = getCount(tableName);

  if (!tableName) {
    tableName = "one_hundred_k";
  }

  let result = [];
  const connection = createConnection();

  connection.connect((err) => {
    if(err) {
        res.send(err);
    } else {
        connection.query(`SELECT * FROM ${tableName} where id <= ${targetSize}`, ( err, rows, b ) => {
        res.send({ users: rows, totalCount: count });
      });  
    }
    connection.end();
  });
});

/**
 * Generates and Sends the raw Data over the client on the basis of direct size.
 * @type {[type]}
 */
router.get('/getAllData', (req, res, next) => {
  const tableName = req.query.tableName;

  let result = [];
  const connection = createConnection();

  connection.connect((err) => {
    if(err) {
        res.send(err);
    } else {
        connection.query(`SELECT * FROM ${tableName}`, ( err, rows, b ) => {
        res.send({ users: rows });
      });  
    }
    connection.end();
  });
});


/**
 * Generates and Sends the raw Data over the client on the basis of direct size.
 * @type {[type]}
 */
router.get('/getAllData', (req, res, next) => {
  const tableName = req.query.tableName;

  let result = [];
  const connection = createConnection();

  connection.connect((err) => {
    if(err) {
        res.send(err);
    } else {
        connection.query(`SELECT * FROM ${tableName}`, ( err, rows, b ) => {
        res.send({ users: rows });
      });  
    }
    connection.end();
  });
});


/**
 * For SyncFusion.
 * @type {[type]}
 */
router.post('/getData', (req, res, next) => {
  const connection = createConnection();
  let { skip, take, where } = req.body;
  skip = parseInt(skip, 10);
  take = parseInt(take, 10);
  let tableName = req.query.tableName;

  if (!tableName) {
    tableName = "one_hundred_k";
  }

  const count = getCount(tableName);

  connection.connect((err) => {
    if(err) {
        res.send(err);
    } else {
      if (where) {
        const filter = where[0];

        connection.query(`SELECT count(*) as totalCount FROM ${tableName} where ${filter.field} like "${filter.value}%"`, ( err, rowCounter, b ) => {
          const rowCount = rowCounter[0].totalCount;
          connection.query(`SELECT * FROM ${tableName} where ${filter.field} like "${filter.value}%" LIMIT ${take} OFFSET ${skip};`, ( err, rows, b ) => {
            res.send({ result: rows, count: rowCount });
            connection.end();
          });
        });  
      } else {
        connection.query(`SELECT * FROM ${tableName} where id >= ${skip+1} && id < ${skip + take + 1}`, ( err, rows, b ) => {
          res.send({ result: rows, count: count });
          connection.end();
        });  
      }
    }
  });
});


/**
 * For Kendo UI Buffering.
 * @type {[type]}
 */
router.get('/getDataBuffering', (req, res, next) => {
  const connection = createConnection();
  let { skip, take, where, tableName } = req.query;
  
  if (!tableName) {
    tableName = "one_hundred_k";
  }

  const count = getCount(tableName);
  skip = parseInt(skip, 10);
  take = parseInt(take, 10);

  connection.connect((err) => {
    if(err) {
        res.send(err);
    } else {
      connection.query(`SELECT * FROM ${tableName} where id >= ${skip+1} && id < ${skip + take + 1}`, ( err, rows, b ) => {
        res.send({ results: rows, count: count });
        connection.end();
      });  
    }
  });
});

/**
 * Generates and Sends data for Flex Grid Buffered Data.
 * @type {[type]}
 */
router.get('/getWebixGridBufferedData', (req, res, next) => {
  let {
    start,
    count,
    pageSize,
    tableName,
    filter
  } = req.query;

  if (!tableName || tableName === 'undefined') {
    tableName = "one_hundred_k";
  }

  let limit = 0;
  const tableTotalCount = getCount(tableName);
  start = parseInt(start, 10);
  if (pageSize) {
    limit = parseInt(pageSize, 10);
  } else if (count) {
    limit = parseInt(count, 10);
  }

  const connection = createConnection();
  connection.connect((err) => {
    if(err) {
      res.send(err);
    } else {
      if (filter && filter !== 'null') {
        connection.query(`SELECT count(*) as totalCount FROM ${tableName} where firstname like "${filter}%"`, ( err, rowCounter, b ) => {
          const rowCount = rowCounter[0].totalCount;
          connection.query(`SELECT * FROM ${tableName} where firstname like "${filter}%" LIMIT ${limit} OFFSET ${start}`, ( err, rows, b ) => {
            res.send({ result: rows, count: rowCount });
            connection.end();
          });
        });  
      } else {
        connection.query(`SELECT * FROM ${tableName} where id > ${start} && id <= ${start + limit}`, ( err, rows, b ) => {
          res.send({ result: rows, count: tableTotalCount });
          connection.end();
        });  
      }
    }
  });
});

/**
 * Generates and Sends data for Flex Grid Buffered Data.
 * @type {[type]}
 */
router.get('/getNewWebixGridBufferedData', (req, res, next) => {
  let {
    start,
    count,
    pageSize,
    tableName,
    filter
  } = req.query;

  if (!tableName || tableName === 'undefined') {
    tableName = "mega_5000";
  }

  let limit = 0;
  const tableTotalCount = getCount(tableName);
  start = parseInt(start, 10);

  if (start === 1) {
    start--;
  }

  if (pageSize) {
    limit = parseInt(pageSize, 10);
  } else if (count) {
    limit = parseInt(count, 10);
  }

  const connection = createConnection();
  connection.connect((err) => {
    if(err) {
      res.send(err);
    } else {
      if (filter && filter.firstname) {
        connection.query(`SELECT count(*) as totalCount FROM ${tableName} where firstname like "${filter.firstname}%"`, ( err, rowCounter, b ) => {
          const rowCount = rowCounter[0].totalCount;
          connection.query(`SELECT * FROM ${tableName} where firstname like "${filter.firstname}%" LIMIT ${limit} OFFSET ${start}`, ( err, rows, b ) => {
            res.send({ data: rows, total_count: rowCount, pos: start });
            connection.end();
          });
        });  
      } else {
        connection.query(`SELECT * FROM ${tableName} where id > ${start} && id <= ${start + limit}`, ( err, rows, b ) => {
          res.send({ data: rows, total_count: tableTotalCount, pos: start });
          connection.end();
        });  
      }
    }
  });
});

/**
 * Generates and Sends data for Flex Grid Buffered Data.
 * @type {[type]}
 */
router.get('/getWijmoGridBufferedData', (req, res, next) => {
  let {
    start,
    count,
    pageSize,
    tableName
  } = req.query;

  if (!tableName) {
    tableName = "one_hundred_k";
  }

  let limit = 0;
  const tableTotalCount = getCount(tableName);
  start = parseInt(start, 10);
  if (pageSize) {
    limit = parseInt(pageSize, 10);
  } else if (count) {
    limit = parseInt(count, 10);
  }

  const connection = createConnection();
  connection.connect((err) => {
    if(err) {
      res.send(err);
    } else {
      const filter = req.query.filter;
      if (filter != 'null') {
        var filterObj = JSON.parse(filter);
        const field = filterObj.key;
        const value = filterObj.value;
        connection.query(`SELECT count(*) as totalCount FROM ${tableName} where ${field} like "${value}%"`, ( err, rowCounter, b ) => {
          const rowCount = rowCounter[0].totalCount;
          connection.query(`SELECT * FROM ${tableName} where ${field} like "${value}%" LIMIT ${pageSize} OFFSET ${start}`, ( err, rows, b ) => {
            res.send({ result: rows, count: rowCount });
            connection.end();
          });
        });  
      } else {
        connection.query(`SELECT * FROM ${tableName} where id > ${start} && id <= ${start + limit}`, ( err, rows, b ) => {
          res.send({ result: rows, count: tableTotalCount });
          connection.end();
        });  
      }
    }
  });
});

/**
 * Generates and Sends the raw Data over the client on the basis of direct size.
 * @type {[type]}
 */
router.get('/getFilterDataExtClassic', (req, res, next) => {
  let {
    size, filter, tableName
  } = req.query;

  size = parseInt(size, 10);
  filter = JSON.parse(filter)[0];
  if (!tableName) {
    tableName = "one_hundred_k";
  }

  const count = getCount(tableName);
  const connection = createConnection();
  connection.connect((err) => {
    if(err) {
        res.send(err);
    } else {
      let query = '';

      if (filter) {
        const field = filter.property;
        const value = filter.value;


        query = `SELECT * FROM ${tableName} where ${field} like "${value}%"`;
      } else {
        query = `SELECT * FROM ${tableName} where id <= ${size}`;
      }

      connection.query(`SELECT * FROM ${tableName} where id <= ${size}`, ( err, rows, b ) => {
        res.send(rows);
      });  
    }
    connection.end();
  });
});

/**
 * Generates and Sends the raw Data over the client on the basis of direct size.
 * @type {[type]}
 */
router.get('/getDevExtremeData', (req, res, next) => {
  let {
    tableName,
    start,
    page,
    limit,
    filter, 
  } = req.query;

  limit = parseInt(limit, 10);
  start = parseInt(start, 10);
  page = parseInt(page, 10);

  if (!tableName) {
    tableName = "one_hundred_k";
  }
  const count = getCount(tableName);

  const connection = createConnection();
  connection.connect((err) => {
      if(err) {
          res.send(err);
      } else {
        let query = '';

        if (filter) {
          filter = JSON.parse(filter);
          const field = filter[0];
          const value = filter[2];
          const type = filter[1];
          connection.query(`SELECT count(*) as totalCount FROM ${tableName} where ${field} like "${value}%"`, ( err, rowCounter, b ) => {
            const rowCount = rowCounter[0].totalCount;
            connection.query(`SELECT * FROM ${tableName} where ${field} like "${value}%" LIMIT ${limit} OFFSET ${start}`, ( err, rows, b ) => {
              res.send({ result: rows, totalCount: rowCount });
              connection.end();
            });
          });  
        } else {
          connection.query(`SELECT * FROM ${tableName} LIMIT ${limit} OFFSET ${start};`, ( err, rows, b ) => {
            res.send({ result: rows, totalCount: count });
            connection.end();
          });  
        }
      }
  });
});

/**
 * Generates and Sends the raw Data over the client on the basis of direct size.
 * @type {[type]}
 */
router.get('/getKendoUIData', (req, res, next) => {
  const targetSize = parseInt(req.query.pageSize, 10);
  const skip = parseInt(req.query.skip, 10);
  let tableName = req.query.tableName;

  if (!tableName) {
    tableName = "one_hundred_k";
  }

  const count = getCount(tableName);
  const filter = req.query.filter;
  const connection = createConnection();

  connection.connect((err) => {
    if(err) {
      res.send(err);
    } else {
      if (filter) {
        const filters = filter.filters[0];
        const field = filters.field;
        const value = filters.value;

        connection.query(`SELECT count(*) as totalCount FROM ${tableName} where ${field}="${value}"`, ( err, rowCounter, b ) => {
          const rowCount = rowCounter[0].totalCount;
          connection.query(`SELECT * FROM ${tableName} where ${field}="${value}" LIMIT ${targetSize} OFFSET ${skip};`, ( err, rows, b ) => {
            res.send({ users: rows, totalCount: rowCount });
            connection.end();
          });
        });  
      } else {
        connection.query(`SELECT * FROM ${tableName} LIMIT ${targetSize} OFFSET ${skip};`, ( err, rows, b ) => {
          res.send({ users: rows, totalCount: count });
          connection.end();
        });  
      }
    }
  });
});

/**
 * Generates and Sends the Data over the client on the basis of pagination.
 * @type {[type]}
 */
router.get('/getPageData', (req, res, next) => {
  let {
      start,
      limit,
      filter,
      page,
      tableName
  } = req.query;
  
  const filterVal = filter ? JSON.parse(filter)[0] : null;
  start = parseInt(start, 10);
  limit = parseInt(limit, 10);
  page = parseInt(page, 10);

  if (limit > 50000) {
    res.send({
      error: 'Max Limit is 50000'
    })
  }

  if (!tableName) {
    tableName = "one_hundred_k";
  }

  const count = getCount(tableName);

  const connection = createConnection();
  connection.connect((err) => {
    if(err) {
        res.send(err);
    } else {
      if (filter) {
        connection.query(`SELECT count(*) as totalCount FROM ${tableName} where ${filterVal.property} like "${filterVal.value}%" LIMIT ${limit}`, ( err, rowCounter, b ) => {
          const rowCount = rowCounter[0].totalCount;
          connection.query(`SELECT * FROM ${tableName} where ${filterVal.property} like "${filterVal.value}%" LIMIT ${limit} OFFSET ${limit * (page - 1)};`, ( err, rows, b ) => {
            res.send({ users: rows, totalCount: rowCount });
            connection.end();
          });
        });  
      } else {
        connection.query(`SELECT * FROM ${tableName} where id > ${start} && id <= ${start + limit}`, ( err, rows, b ) => {
          res.send({ users: rows, totalCount: count });
          connection.end();
        });  
      }
    }
  });
});

export default router;