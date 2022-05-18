import {hash} from "../utils/sha256-hasher.js";
import {signin_db, is_verified_db} from "../models/signin.js";

const signin_service = async (req, res)=>{
    let mail = req.body.email;
    let password = req.body.password;
    let encrypted_password = hash(password);
    try {
        let password_result = await signin_db(mail);
        if(!is_same_password(encrypted_password, password_result.password)){
            res.send({res: 13});
        }
        else{
            set_cookie(req, mail);
            res.send({
                res: 1
            })
        }
    }catch (err){
        res.send({res: 25})
    }
}

const is_mail_verified = async (req, res, next)=>{
    try {
        let result = await is_verified_db(req.body.email);
        if(result.is_verified === 0){
            res.send({res:25});
        }
        else{
            next();
        }
    }
    catch (err){
        res.send({res:25});
    }
}

const is_same_password = (p1, p2)=>{
    return p1===p2;
}

const set_cookie = (req, mail)=>{
    req.session = {
        mail: mail
    };
}

const remove_cookie = (req, res)=>{
    req.session = null;
    res.send({res:1});
}


export {signin_service, remove_cookie, is_mail_verified}