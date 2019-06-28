const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const con = require('./connect.js');

function check_file_promise(input, allowed, size, type) {

    return new Promise((resolve, reject) => {

        let bytes_size = 0;
        let obj = {
            file_status: false,
            message: ''
        };

        if (size != '' && type == 'mb') {
            bytes_size = size * 1048576;  //size from mb to bytes
        }
        else if (size != '' && type == 'kb') {
            bytes_size = size * 1024;  //size from kb to bytes
        }

        if (input.size == 0) {
            obj.message = 'Please select a file.';
        }
        else {

            let extension = path.extname(input.originalFilename).toLowerCase();
            let files_allowed = allowed.includes(extension);

            if (!files_allowed) {
                obj.message = 'Only ' + allowed.join(',') + ' files allowed.';
            }
            else {

                if (input.size > bytes_size) {
                    obj.message = 'File size cannot be greater than ' + size + ' ' + type;
                }
                else {
                    obj.file_status = true;
                    obj.message = 'valid';

                }
            }
        }
        resolve(obj);
    });
}

function upload_file(newPath, buffer) {

    return new Promise((resolve, reject) => {

        fs.writeFile(newPath, buffer, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve('');
            }
        });
    });
}

function checkempty(input) {

    if (input == '' || input == null || input == undefined) {
        return true;
    }
    else {
        return false;
    }

}

const ENCRYPTION_KEY = 'uKTFyukeCDXNhpXyXAfexhFiWyTLVSKIbwtGwpUsVJedFWGjAl';

function encrypt(text) {
    text = typeof text === 'string' ? text : text.toString();
    let cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY)
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

class solvequery {

    constructor() {

    }

    return_results(query) {

        return new Promise((resolve, reject) => {

            con.query(query, (err, results) => {

                let obj = {};

                if (err) {
                    reject(err);
                }
                else {
                    resolve(results);
                }

            });

        });
    }

}

let sq = new solvequery();

module.exports = {
    check_file_promise, upload_file, checkempty, encrypt, decrypt, sq
}