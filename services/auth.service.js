const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 12);
};

module.exports = {
    hashPassword,
};
