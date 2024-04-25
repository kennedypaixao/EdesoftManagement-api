import sql from 'mssql';
import { getPoolConnectionSqlServer } from '../database/configuration';
import ProductEntity from '../database/entity/productEntity';

const TABLE = '[Product]';

export const GetProductByUIdAsync = async (uid: string): Promise<sql.IRecordSet<ProductEntity>> => {
    try {
        if (!uid) {
            throw new Error("É preciso informar o ID do produto.");
        }
        const pool = await getPoolConnectionSqlServer();
        pool.on('error', (error) => {
            console.error(error);
            throw error;
        });

        let result = await pool.request()
            .input('UID', sql.UniqueIdentifier, uid)
            .query<ProductEntity>(`select top 1 * from ${TABLE} where UID = @UID`);

        return result.recordset;
    } catch (error) {
        throw error;
    }
}

export const GetProductsAsync = async (): Promise<sql.IRecordSet<ProductEntity>> => {
    try {
        const pool = await getPoolConnectionSqlServer();
        pool.on('error', (error) => {
            console.error(error);
            throw error;
        });

        let result = await pool.request()
            .query<ProductEntity[]>(`select * from ${TABLE} where Active = 1`);

        return result.recordset;
    } catch (error) {
        throw error;
    }
}

export const AddProductAsync = async (uid: string, name: string, quantity: number, picture: string, price: number, createdBy: string): Promise<boolean> => {
    try {
        if (!name) {
            throw new Error("É preciso informar o nome do produto.");
        }
        if (!quantity) {
            throw new Error("É preciso informar a quantidade do produto.");
        }
        if (!price) {
            throw new Error("É preciso informar o preço do produto.");
        }

        const pool = await getPoolConnectionSqlServer();
        let result = await pool.request()
            .input('UID', sql.UniqueIdentifier, uid)
            .input('Name', sql.VarChar, name)
            .input('Quantity', sql.Int, quantity)
            .input('Picture', sql.VarChar, picture)
            .input('Price', sql.Decimal(10, 2), price)
            .input('Active', sql.Bit, true)
            .input('CreatedBy', sql.UniqueIdentifier, createdBy)
            .query(`INSERT INTO ${TABLE} 
                        (UID, Name, Quantity, Picture, Price, Active, CreatedBy) 
                        VALUES 
                        (@UID, @Name, @Quantity, @Picture, @Price, @Active, @CreatedBy)`)
        pool.close();

        return result.rowsAffected[0] === 1 ? true : false;
    } catch (error) {
        throw error;
    }
}

export const UpdateProductAsync = async (uid: string, name: string, quantity: number, active: boolean, picture: string, price: number, updatedBy: string): Promise<boolean> => {
    try {
        const updates: string[] = [];

        if (name) {
            updates.push(`Name = '${name}'`);
        }

        if (quantity) {
            updates.push(`Quantity = ${quantity}`);
        }

        if (active !== null) {
            updates.push(`Active = '${active === true ? 1 : 0}'`);
        }

        if (picture) {
            updates.push(`Picture = '${picture}'`);
        }

        if (price) {
            updates.push(`Price = ${price}`);
        }

        if (updatedBy) {
            updates.push(`UpdatedBy = '${updatedBy}'`);
        }

        if (updates.length === 0) {
            throw new Error("É preciso informar um parâmetro para atualizar o produto.")
        }

        updates.push(`UpdatedAt = GETDATE()`);

        const pool = await getPoolConnectionSqlServer();
        let result = await pool.request()
            .query(`UPDATE ${TABLE} 
                       SET ${updates.join(',')}
                       WHERE UID = '${uid}' `);

        pool.close();

        return result.rowsAffected[0] === 1 ? true : false;
    } catch (error) {
        throw error;
    }
}

export const DeleteProductAsync = async (uid: string, updatedBy: string): Promise<boolean> => {
    try {
        const pool = await getPoolConnectionSqlServer();
        let result = await pool.request()
            .query(`UPDATE ${TABLE} 
                       SET UpdatedAt = GETDATE(), UpdatedBy = '${updatedBy}', Active = 0
                       WHERE UID = '${uid}' `);
        pool.close();

        return result.rowsAffected[0] === 1 ? true : false;
    } catch (error) {
        throw error;
    }
}