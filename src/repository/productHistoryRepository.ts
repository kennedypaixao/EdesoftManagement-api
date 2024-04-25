import sql from 'mssql';
import { getPoolConnectionSqlServer } from '../database/configuration';

const TABLE = '[ProductHistory]';

export const AddHistoryAsync = async (productUID: string, quantity: number, createdBy: string): Promise<boolean> => {
    try {
        if (!productUID) {
            throw new Error("É preciso informar o nome do produto.");
        }
        if (!quantity) {
            throw new Error("É preciso informar a quantidade do produto.");
        }
       
        const pool = await getPoolConnectionSqlServer();
        let result = await pool.request()
            .input('ProductUID', sql.UniqueIdentifier, productUID)
            .input('Quantity', sql.Int, quantity)
            .input('CreatedBy', sql.UniqueIdentifier, createdBy)
            .query(`INSERT INTO ${TABLE} 
                        (ProductUID, Quantity, CreatedBy) 
                        VALUES 
                        (@ProductUID, @Quantity, @CreatedBy)`)
        pool.close();

        return result.rowsAffected[0] === 1 ? true : false;
    } catch (error) {
        throw error;
    }
}