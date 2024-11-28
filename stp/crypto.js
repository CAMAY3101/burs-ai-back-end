const crypto = require('crypto-js');

function getSign() {
    var sign = crypto.createSign('RSA-SHA256');
    sign.update(this.cadenaOriginal);
    sign.end();
    const key = fs.readFileSync('ssl/key.pem');
    let signature_b64 = sign.sign(key, 'base64');
    return signature_b64;
}   

console.log(getSign())