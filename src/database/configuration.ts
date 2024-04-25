import sql from 'mssql';

const getConfig = (): sql.config => {
    return {
        user: process.env.DB_USER?.toString(),
        password: process.env.DB_PWD?.toString(),
        database: process.env.DB_NAME?.toString(),
        server: process.env.DB_SERVER?.toString(),
        // port: 56219,
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        },
        options: {
            encrypt: false, // for azure
            trustServerCertificate: true, // change to true for local dev / self-signed certs
        }
    };
}

export const getPoolConnectionSqlServer = async (): Promise<sql.ConnectionPool> => {
    try {
        const con = `Data Source=KENNEDY\\SQLEXPRESS2022,56219;Initial Catalog=EdesoftManagement;User ID=sa;Password=sa@12345678;Connect Timeout=30;Encrypt=False;Trust Server Certificate=True;Application Intent=ReadWrite;Multi Subnet Failover=False`
        const a = getConfig();
        const pool = sql.connect(a);
        return pool;
    } catch (err) {
        console.error("[Database.Configuration - getPoolConnectionSqlServer] Error:");
        console.error(err);
    }
}