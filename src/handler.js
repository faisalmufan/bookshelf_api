const addBookHandler = (request,h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id            = nanoid(16);
    const finished      = pageCount === readPage;
    const insertedAt    = new Date().toISOString();
    const updatedAt     = insertedAt;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    }

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;
    const isName = books.filter((book) => book.name === null);
    const isReadPage = books.filter((book) => book.readPage > book.pageCount);

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
    } else if (isName) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
            data: {
                bookName: name,
            },
        });
        response.code(400);
        return response;
    } else if (isReadPage) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
            data: {
                bookReadPage: readPage,
            },
        });
        response.code(400);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku'
    });
    response.code(500);
    return response;
};