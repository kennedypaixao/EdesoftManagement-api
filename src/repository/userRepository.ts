import sql from 'mssql';
import { getPoolConnectionSqlServer } from '../database/configuration';
import UserEntity from '../database/entity/userEntity';
import { Encrypt } from '../helpers';

const TABLE = '[User]';

export const GetUserByUIdAsync = async (uid: string): Promise<sql.IResult<UserEntity>> => {
    try {
        if (!uid) {
            throw new Error("É preciso informar o ID do usuário.");
        }
        const pool = await getPoolConnectionSqlServer();
        pool.on('error', (error) => {
            console.error(error);
            throw error;
        });

        let user = await pool.request()
            .input('UID', sql.UniqueIdentifier, uid)
            .query<UserEntity>(`select * from ${TABLE} where UID = @UID`)

        return user;
    } catch (error) {
        throw error;
    }
}

export const GetUserByEmailAsync = async (email: string): Promise<UserEntity> => {
    try {
        if (!email) {
            throw new Error("É preciso informar o e-mail do usuário.");
        }

        const pool = await getPoolConnectionSqlServer();

        let result = await pool.request()
            .input('Email', sql.VarChar, email)
            .query<UserEntity>(`select * from ${TABLE} where Email = @Email`)
        pool.close();

        const user = result.recordset.find(e => e.Email === email);
        return user;
    } catch (error) {
        throw error;
    }
}

export const AddUserAsync = async (email: string, password: string, name: string, isAdmin: boolean = false): Promise<any> => {
    try {
        if (!email) {
            throw new Error("É preciso informar o e-mail do usuário.");
        }

        if (!password) {
            throw new Error("É preciso informar a senha do usuário.");
        }

        if (!name) {
            throw new Error("É preciso informar o nome do usuário.");
        }

        const pool = await getPoolConnectionSqlServer();
        let result = await pool.request()
            .input('Email', sql.VarChar, email)
            .input('Password', sql.VarChar, Encrypt(password))
            .input('Name', sql.VarChar, name)
            .input('IsAdmin', sql.Bit, isAdmin)
            .query(`INSERT INTO ${TABLE} 
                        (Name, Email, Password, IsAdmin) 
                        VALUES 
                        (@Name, @Email, @Password, @IsAdmin)`)
        pool.close();

        return result;
    } catch (error) {
        throw error;
    }
}

export const UpdateUserAsync = async (uid: string, name: string = null, password: string = null, isAdmin: boolean = null): Promise<boolean> => {
    try {
        const updates = [];

        if (password) {
            updates.push(`Password = '${Encrypt(password)}'`);
        }

        if (name) {
            updates.push(`Name = '${name}'`);
        }

        if (isAdmin !== null) {
            updates.push(`IsAdmin = '${isAdmin === true ? 1 : 0}'`);
        }

        if (updates.length === 0) {
            throw new Error("É preciso informar um parâmetro para atualizar.")
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