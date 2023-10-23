const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id            = nanoid(16);
    const finished      = pageCount === readPage;
    const insertedAt    = new Date().toISOString();
    const updatedAt     = insertedAt;

    const newBook = {
        name, year, author, summary, publisher, pageCount, readPage, reading, id, finished, insertedAt, updatedAt
    };
    
    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }
    
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    } 

    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku'
    });
    response.code(500);
    return response;
};

const getAllBookHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    let newBooks = [];
    let data = {};

    if (name && books.filter((n) => n.name.toLowerCase().indexOf(name.toLowerCase()) > -1)) {
        let withName = books.filter((n) => n.name.toLowerCase().indexOf(name.toLowerCase()) > -1);
        withName.forEach((item,index,arr) => {
            data = {
                id: arr[index].id,
                name: arr[index].name,
                publisher: arr[index].publisher
            }
            newBooks.push(data);
        });
    } else if (parseInt(reading) === 0 || parseInt(reading) === 1) {
        let withReading = books.filter((r) => r.reading === (parseInt(reading) === 1 ? true : false));
        withReading.forEach((item,index,arr) => {
            data = {
                id: arr[index].id,
                name: arr[index].name,
                publisher: arr[index].publisher
            }
            newBooks.push(data);
        });
    } else if (parseInt(finished) === 0 || parseInt(finished) === 1) {
        let withFinished = books.filter((r) => r.finished === (parseInt(finished) === 1 ? true : false));
        withFinished.forEach((item,index,arr) => {
            data = {
                id: arr[index].id,
                name: arr[index].name,
                publisher: arr[index].publisher
            }
            newBooks.push(data);
        });
    } else if (books[0] !== undefined) {
        books.forEach((item,index,arr) => {
            data = {
                id: arr[index].id,
                name: arr[index].name,
                publisher: arr[index].publisher
            }
            newBooks.push(data);
        });
    } else {
        newBooks = books;
    }

    return {
        status: 'success',
        data: {
            'books' : newBooks
        }
    }
};

const getBookByIdHandler = (request,h) => {
    const { id } = request.params;

    const book = books.filter((n) => n.id === id)[0];
    if (book != undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request,h) => {
    const { id } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    
    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }
    
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }

    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
        books[index] = {
          ...books[index],
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          reading,
          updatedAt,
        };
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
    }

    const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = { addBookHandler, getAllBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }