const express = require('express');
const router = express.Router();
const axios = require('axios');

const { Book } = require('../models');

const FindModelBookError = require("../errors/FindModelBookError");

// 1. Получить список всех книг
router.get('/', async (req, res) => {
    const books = await Book.find();

    res.render("books/index", {
        title: "Список книг",
        books: books,
        route: 'books'
    });
});

// 2. Создание книги
router.get('/create', (req, res) => {
    res.render("books/create", {
        title: "Добавить новую книгу",
        book: {},
        route: 'books'
    });
});

// 3. получить книгу по ID
router.get('/:id', async(req, res) => {

    const {id} = req.params;

    // чтобы правильно обработать возможную ошибку, будем её пробрасывать во вложенных try
    try {
        let cnt = 0;
        let book;

        // Сначала проверим, найдётся ли книга
        try {
            book = await Book.findById(id);
        } catch (e) {
            throw new FindModelBookError('Не удалось найти книгу по её id');
        }

        // Если поиск книги прошёл без ошибок, можем послать запрос для подсчета просмотров
        try {
            const COUNTER_URL = process.env.COUNTER_URL || "http://localhost:3003";
            const access_url = `${COUNTER_URL}/counter/${id}`;
            await axios.post(`${access_url}/incr`);
            const axios_res = await axios.get(access_url);
            cnt = axios_res.data.cnt;
        } catch (e) {
            console.warn('Не удалось получить данные от сервиса Cчетчика');
            // Ошибку выдавать не будем, т.к. она не критичная
            //throw new CounterFetchError('Не удалось получить данные от сервиса счетчика');
        }

        res.render("books/view", {
            title: "Карточка книги",
            book: book,
            cnt: cnt,
            route: 'books'
        });

    } catch (e) {
        if (e.name === 'findModelBookError') {
            res.redirect('/404');
        }
        console.log(e.message);
    }
});

// 4. редактировать книгу по ID
router.get('/update/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const book = await Book.findById(id);
        res.render("books/update", {
            title: "Редактирование атрибутов книги",
            book: book,
            route: 'books'
        });
    } catch {
        res.redirect('/404');
    }
});

module.exports = router