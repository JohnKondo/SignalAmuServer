import {pool} from "../config/database/database-config.js";

const get_password_query = "SELECT password FROM user WHERE user_email = ?";
const get_is_verified_query = "SELECT is_verified FROM user WHERE user_email = ?";
const is_consumer_query = "SELECT COUNT(*) isConsumer FROM consumer where user_id = (SELECT id FROM user WHERE user_email = ?)"

const signin_db = async (mail)=>{
    return new Promise(async (resolve, reject)=>{
        let conn = await pool.getConnection();
        try{
            let result = await conn.query(get_password_query, [mail]);
            await conn.release();
            resolve(result[0]);
        }catch (err){
            reject(err);
        }
    })
};

const eval_perm_db = (mail)=>{
    return new Promise(async (resolve, reject)=>{
        const conn = await pool.getConnection();
        try {
            let result = await conn.query(is_consumer_query, [mail]);
            await conn.release();
            resolve(Number(result[0].isConsumer));
        }catch (err){
            reject(err);
        }
    })
}

const is_verified_db = async(mail)=>{
    return new Promise(async (resolve, reject)=>{
        const conn = await pool.getConnection();
        try {
            let result = await conn.query(get_is_verified_query, [mail]);
            await conn.release();
            resolve(result[0]);
        }catch (err){
            reject(err);
        }
    })
}

export {signin_db, is_verified_db, eval_perm_db};





