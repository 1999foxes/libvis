import { Book, BookClassification } from './Book';


function query(command) {
    const queryApiUrl = encodeURI('http://127.0.0.1:5000/' + command);
    console.log(queryApiUrl);
    return fetch(queryApiUrl).then(response => response.json());
}


function findRelevantBooks(bookid, limit = 15, offset = 1) {
    return query(`select *, count(*) from operations join books on operations.studentid in (select studentid from operations where bookid='${bookid}') and operations.bookid=books.bookid group by books.title order by count(*) desc limit ${limit} offset ${offset}`)
        .then(result => {
            const books = [];
            for (const info of result) {
                books.push(new Book(info.bookid, info.title, info.isbn, info.author, info.publishyear, info.press));
            }
            return books;
        });
}


async function searchBooks(titleOrAuthor, limit = 15, offset = 0, orderBy = 'bookid') {
    let result;
    switch (orderBy) {
        case 'bookid':
            result = await query(`select * from books where books.title like '${titleOrAuthor}' or books.author like '${titleOrAuthor}' order by ${orderBy} limit ${limit} offset ${offset}`);
            break;
        case 'popular':
            result = await query(`select *, (select popularity from MonthlyPopular where MonthlyPopular.bookid=books.bookid order by popularity desc) as p from books where books.title like '${titleOrAuthor}' or books.author like '${titleOrAuthor}' order by p desc limit ${limit} offset ${offset}`);
    }
    const books = [];
    for (const info of result) {
        books.push(new Book(info.bookid, info.title, info.isbn, info.author, info.publishyear, info.press));
    }
    return books;
}


function countSearchBooks(titleOrAuthor, limit = 15, offset = 0) {
    return query(`select count(*) from books where books.title like '${titleOrAuthor}' or books.author like '${titleOrAuthor}'`)
        .then(result => {
            return result[0]['count(*)'];
        });
}


async function calAvgRendDuration(bookid) {
    const data = await query(`select studentid, renddate, operationtype from operations where bookid='${bookid}' and (operationtype=50 or operationtype=61) order by renddate asc limit 50;`);
    let totalDuration = 0;
    let totalCount = 0;
    for (let i = 0; i < data.length; ++i) {
        if (data[i].operationtype === 50) {
            for (let j = i; j < data.length; ++j) {
                if (data[i].studentid === data[j].studentid && data[j].operationtype === 61) {
                    const datei = new Date(
                        Math.floor(data[i].renddate / 10000),
                        Math.floor((data[i].renddate % 10000) / 100),
                        Math.floor(data[i].renddate % 100)
                    );
                    const datej = new Date(
                        Math.floor(data[j].renddate / 10000),
                        Math.floor((data[j].renddate % 10000) / 100),
                        Math.floor(data[j].renddate % 100)
                    );
                    totalDuration += (datej.getTime() - datei.getTime()) / 86400000;
                    totalCount += 1;
                    break;
                }
            }
        }
    }
    return totalCount === 0 ? 0 : Math.floor(totalDuration / totalCount);
}


function getBook(bookid) {
    return query(`select * from books where books.bookid='${bookid}'`)
        .then(result => result[0])
        .then(result => {
            if (result === undefined) {
                return undefined;
            } else {
                return new Book(result.bookid,
                    result.title,
                    result.isbn,
                    result.author,
                    result.publishyear,
                    result.press);
            }
        });
}


function getPopularity(bookid) {
    return query(`select popularity from MonthlyPopular where bookid='${bookid}' order by popularity desc limit 1;`)
        .then(result => result[0].popularity);
}


function getMonthlyPopularity(bookid) {
    return query(`select month, popularity from MonthlyPopular where bookid='${bookid}' order by month;`);
}

async function getClassificationMonthlyPopularity(year, month) {
    month = year * 100 + month;
    const promises = [];
    const data = [];
    for (const b of BookClassification) {
        promises.push(query(`select month, sum(popularity) as popularity, '${b.title}' as title, '${b.id}' as bookid from MonthlyPopular where month=${month} and bookid like '${b.id}';`));
    }
    for (const p of promises) {
        data.push((await(p))[0]);
    }
    return data;
}

async function getMonthlyRanking(bookid, year, month) {
    month = year * 100 + month;
    return query(`select month, popularity, books.bookid, books.title from monthlyPopular, books where books.bookid=monthlyPopular.bookid and books.bookid like '${bookid}' and month=${month} order by popularity desc limit 50;`);
}


async function getMonthlyRankingOthers(bookids, year, month) {
    month = year * 100 + month;
    return query(`select month, popularity, books.bookid, books.title from monthlyPopular, books where books.bookid=monthlyPopular.bookid and books.bookid not like '设%' and ${bookids.map(id => "books.bookid not like '" + id + "' and ").join('')} month=${month} order by popularity desc limit 50;`);
}


export {
    findRelevantBooks,
    searchBooks,
    countSearchBooks,
    calAvgRendDuration,
    getBook,
    getPopularity,
    getMonthlyPopularity,
    getClassificationMonthlyPopularity,
    getMonthlyRanking,
    getMonthlyRankingOthers,
};

// let b = new Book('I712.45/F11 2018', '冰与火之歌');
// findRelevantBooks(b).then(result => console.log(result));
// countFrequency(b, 20180101, 20180901).then(result => console.log(result));

// for (const bookClass of BookClassfication) {
    // countFrequency(bookClass, 20180101, 20180901).then(result => console.log(bookClass, result));
// }

// searchBooksTitle(new Book(undefined, '冰与火之歌')).then(result => console.log(result));