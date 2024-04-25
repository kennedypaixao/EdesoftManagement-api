import sql from 'mssql';
import { getPoolConnectionSqlServer } from '../database/configuration';
import OrdersEntity from '../database/entity/ordersEntity';

const TABLE = '[Orders]';

export const GetOrderByUserUIdAsync = async (userUID: string, month: number, year: number): Promise<sql.IRecordSet<OrdersEntity>> => {
    try {
        if (!userUID) {
            throw new Error("É preciso informar o ID do usuário.");
        }
        const pool = await getPoolConnectionSqlServer();
        pool.on('error', (error) => {
            console.error(error);
            throw error;
        });

        let dateBegin = `${year}/${month}/01 00:00:00.000`;
        let dateEnd = `${year}/${month}/31 23:59:59.999`;

        let result = await pool.request()
            .input('UserUID', sql.UniqueIdentifier, userUID)
            .query<OrdersEntity>(`select 
                top 1 * 
                from ${TABLE} 
               where UserUID = @UserUID
               and CreatedBy >= ${dateBegin} and CreatedBy <= ${dateEnd}`);

        return result.recordset;
    } catch (error) {
        throw error;
    }
}


export const AddOrderAsync = async (userUID: string, productUID: string, quantity: number, createdBy: string): Promise<boolean> => {
    try {
        if (!userUID) {
            throw new Error("É preciso informar o nome do produto.");
        }
        if (!productUID) {
            throw new Error("É preciso informar a quantidade do produto.");
        }
        if (!quantity) {
            throw new Error("É preciso informar o preço do produto.");
        }

        const pool = await getPoolConnectionSqlServer();
        let result = await pool.request()
            .input('UserUID', sql.UniqueIdentifier, userUID)
            .input('ProductUID', sql.UniqueIdentifier, quantity)
            .input('Quantity', sql.Int, quantity)
            .input('CreatedBy', sql.UniqueIdentifier, createdBy)
            .query(`INSERT INTO ${TABLE} 
                        (UserUID, ProductUID, Quantity, CreatedBy) 
                        VALUES 
                        (@UserUID, @ProductUID, @Quantity, @CreatedBy)`)
        pool.close();

        return result.rowsAffected[0] === 1 ? true : false;
    } catch (error) {
        throw error;
    }
}
