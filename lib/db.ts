import oracledb from 'oracledb';

// Configure Oracle to fetch CLOBs as strings
oracledb.fetchAsString = [oracledb.CLOB];

declare global {
  var _oraclePool: oracledb.Pool | undefined;
}

export async function getPool(): Promise<oracledb.Pool> {
  if (globalThis._oraclePool) {
    return globalThis._oraclePool;
  }

  const user = process.env.ORACLE_USER || process.env.DB_USER;
  const password = process.env.ORACLE_PASSWORD || process.env.DB_PASSWORD;
  const connectString = process.env.ORACLE_TNS_NAME || process.env.DB_CONNECTION_STRING;

  if (!user || !password || !connectString) {
    throw new Error('Missing required Oracle credentials.');
  }

  const pool = await oracledb.createPool({
    user,
    password,
    connectString,
    poolMin: 0,
    poolMax: 4,
    poolIncrement: 1,
    poolTimeout: 30,
  });

  globalThis._oraclePool = pool;
  return pool;
}

export async function query<T = any>(sql: string, params: oracledb.BindParameters = []): Promise<T[]> {
  const pool = await getPool();
  const connection = await pool.getConnection();
  try {
    const result = await connection.execute<T>(sql, params, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    return (result.rows as T[]) || [];
  } finally {
    await connection.close();
  }
}
