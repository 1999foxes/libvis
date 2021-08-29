import React, { useEffect, useState } from 'react';
import * as api from './api';
import BingSearch from './BingSearch';
import { Book, BookClassification } from './Book';
import { AddFavoriteButton, FavoriteListButton } from './Favorite';
import { Link } from 'react-router-dom';
import PopularityHeatmap from './chart/PopularityHeatmap';


const RelaventBooks = ({bookid}) => {
    const [books, setBooks] = useState([]);
    useEffect(
        () => {
            api.findRelevantBooks(bookid).then(result => setBooks(result));
        },
        [bookid]
    )
    return (
        <div id='relaventbooks'>
            <h3>相关推荐：</h3>
            <ul>
                {
                    books.map(
                        b => (
                            <li key={b.id}>
                                <Link to={`/book/${encodeURIComponent(b.id)}`}>{b.title}</Link>
                            </li>
                        )
                    )
                }
            </ul>
        </div>
    )
}


function BookInfo({ bookid }) {
    const [book, setBook] = useState();
    const [avgRendDuration, setAvgRendDuration] = useState(0);
    const [popularity, setPopularity] = useState(0);
    const handleChangeBookid = () => {
        api.getBook(bookid)
            .then(result => setBook(result));
        
        api.calAvgRendDuration(bookid)
            .then(result => setAvgRendDuration(result));
        
        api.getPopularity(bookid)
            .then(result => setPopularity(result));
    }
    useEffect(handleChangeBookid, [bookid]);
    return (
        <div>
            {book ?
                (<>
                    <h2>{book.title}</h2>
                    <h3>{book.author}</h3>
                    <AddFavoriteButton bookid={book.id} />
                    <BingSearch title={book.title} />
                    <p>{book.press}</p>
                    <p>出版年份：{book.publishyear}</p>
                    <p>索书号：{book.id}</p>
                    <p>热度：{popularity}</p>
                    <p>预计阅读时长：{avgRendDuration}天</p>
                    <RelaventBooks bookid={book.id} />
                    {/* <PopularityHeatmap bookid={book.id} /> */}
                </>) : null
            }
        </div>
    );
}

export default BookInfo;
