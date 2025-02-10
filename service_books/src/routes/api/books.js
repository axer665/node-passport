const express = require('express');
//const Book = require('../../Book');
const { Book } = require('../../models');
const uploadMulter = require('../../middleware/upload');
const router = express.Router();

router.get('/', async (req, res) => {
    const books = await Book.find().select('-__v');
    res.json(books);
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const book = await Book.findById(id).select('-__v');
        res.status(201);
        res.json({
            success: 'ok',
            book: book
        });
    } catch (e) {
        res.status(404);
        res.json('404 | страница не найдена')
    }
});

router.get('/:id/download', async (req, res) => {
    const {id} = req.params;

    try {
        const book = await Book.findById(id).select('-__v');
        res.download(`${__dirname}/../../../${book.fileBook}`, book.fileName, err => {
            if (err) {
                res.status(404);
                res.json(err);
            }
        });
    } catch {
        res.status(404);
        res.json('404 | страница не найдена')
    }
});

router.post('/', uploadMulter.fields([
    {name:'filebook', maxCount: 1,},
    {name:'filecover', maxCount: 1,}
]), async(req, res) => {

    let {
        title,
        authors,
        description,
        favorite,
        fileName,
    } = req.body;

    if (!req.file && !req.files) {
        res.status(404);
        res.json('404 | Файл не найден');
        return;
    }

    const fileBook = req.files && req.files.filebook ? req.files.filebook[0].path : '';
    const fileCover = req.files && req.files.filecover ? req.files.filecover[0].path : '';

    if (fileBook) {
        let pathArray = fileBook.split('/');
        fileName = pathArray[pathArray.length-1];
    }

    const newBook = new Book({
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        fileBook,
    });

    await newBook.save();

    res.status(201);
    res.json({
        success: 'ok',
        book: newBook
    });
});

router.put('/:id', uploadMulter.fields([
        {name:'filebook', maxCount: 1,},
        {name:'filecover', maxCount: 1,}
    ]), async (req, res) => {
    const {
        title,
        authors,
        description,
        favorite,
    } = req.body;

    const {id} = req.params;

    // Нам могут и не прислать файл
    if (!req.file && !req.files) {
        console.log(`При изменении книги ${id} файл не был передан. Оставляем прежний файл книги`)
    }

    try {
        const book = await Book.findByIdAndUpdate(id, {
            title,
            description,
            authors,
            favorite
        });

        const fileBook = req.files && (req.files.filebook) ? (req.files.filebook[0].path) : book.fileBook;
        const fileCover =  req.files && req.files.filecover ? req.files.filecover[0].path : book.fileCover;
        let fileName = book.fileName;
        if (fileBook) {
            let pathArray = fileBook.split('/');
            fileName = pathArray[pathArray.length-1];
        }

        await Book.findByIdAndUpdate(id, {
            fileCover: fileCover || book.fileCover,
            fileName,
            fileBook
        });

        res.status(201)
        res.json({
            success: 'ok',
            book: book
        });
    } catch {
        res.status(404);
        res.json('404 | страница не найдена')
    }
});

router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    //const idx = books.findIndex((el) => el.id === id);
    try {
        await Book.deleteOne({_id: id});
        res.status(201);
        res.json({success: 'ok'});
    } catch (e) {
        res.status(404);
        res.json('404 | страница не найдена')
    }
});

module.exports = router;