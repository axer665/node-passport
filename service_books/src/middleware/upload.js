const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, callback) {
        // в колбек отправляем ошибку (null) и название папки, куда будем сохранять файлы
        if (file.fieldname === "filecover") {
            callback(null, 'public/books/covers');
        } else {
            callback(null, 'public/books');
        }
    },
    filename(req, file, callback) {
        file.originalname = Buffer.from(`${Date.now()}-${file.originalname}`, 'latin1').toString('utf8')
        // в колбек отправляем ошибку (null) и маску с названием файла в нашей папке
        callback(null, file.originalname);
    }
});

// Допустимые форматы для книг
const bookAllowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/epub+zip'
]
// Допустимые форматы для обложек
const coverAllowedTypes = [
    'image/jpeg',
    'image/webp',
    'image/png'
]

const typeChecker = (typesList, searchedType, callback) => {
    if (typesList.includes(searchedType))
        callback(null, true);
    else
        callback(null, false);
}

// Фильтр типов файлов
const fileFilter = (req, file, cb) => {
    if (file.fieldname === "filecover") {
        typeChecker(coverAllowedTypes, file.mimetype, cb);
    } else {
        typeChecker(bookAllowedTypes, file.mimetype, cb);
    }
}


module.exports = multer({storage, fileFilter})