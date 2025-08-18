// lib/db.js
import oracledb from 'oracledb';

// Configure Oracle to fetch CLOBs as strings
oracledb.fetchAsString = [oracledb.CLOB];

// Enable "Thin Mode" - this saves you from installing heavy Oracle binaries
try {
  oracledb.initOracleClient({ libDir: process.env.ORACLE_LIB_DIR }); 
} catch (err) {
  // If thin mode fails or is already initialized, just continue
}

// Connection pool configuration
let pool;

async function getPool() {
  if (!pool) {
    pool = await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECTION_STRING,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1,
      poolTimeout: 60,
    });
  }
  return pool;
}

export async function query(sql, params = [], options = {}) {
  let connection;
  try {
    const connectionPool = await getPool();
    connection = await connectionPool.getConnection();

    // Execute the query
    const result = await connection.execute(sql, params, {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // Return data as JSON objects, not arrays
      autoCommit: options.autoCommit !== false, // Default to true
      ...options,
    });

    return result.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Execute a single query and return one row
export async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows && rows.length > 0 ? rows[0] : null;
}

// Execute a query for insert/update/delete operations
export async function execute(sql, params = []) {
  let connection;
  try {
    const connectionPool = await getPool();
    connection = await connectionPool.getConnection();

    const result = await connection.execute(sql, params, {
      autoCommit: true,
    });

    return result;
  } catch (error) {
    console.error("Database Error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Close the pool gracefully
export async function closePool() {
  if (pool) {
    await pool.close(10);
    pool = null;
  }
}
