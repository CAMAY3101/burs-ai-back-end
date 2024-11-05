const format_fad = {
    ocr: (data) => {
        return data.reduce((acc, item) => {
            const formattedKey = item.key.toLowerCase().replace(/ /g, '_');
            acc[formattedKey] = item.value;
            return acc;
        }, {});
    },
}

module.exports = format_fad;