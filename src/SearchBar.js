import React, { useState, useEffect } from 'react';
import * as api from './api';
import { Book } from './Book';
import { Link } from 'react-router-dom';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState([]);
    const [resultCount, setResultCount] = useState(0);
    const [offset, setOffset] = useState(0);
    const limit = 15;

    const [orderBy, setOrderBy] = useState('bookid');

    const search = async () => {
        if (query == '') {
            setResult([]);
            setResultCount(0);
            return;
        }
        const title = '%' + query + '%';
        const books = await api.searchBooks(title, limit, offset, orderBy);
        setResult(books);
        const count = await api.countSearchBooks(title);
        setResultCount(count);
    };
    useEffect(search, [query, offset, orderBy]);
    useEffect(() => { setOffset(0) }, [query, orderBy]);

    const handleSubmit = async e => {
        e.preventDefault();
        setOffset(0);
    };

    const handleChangePage = e => {
        e.preventDefault();
        setOffset(parseInt(e.target.getAttribute('data-pagenumber')) * limit - limit);
    };

    const handleNextPage = () => {
        if (offset + limit < resultCount) {
            setOffset(offset + limit);
        }
    };

    const handlePreviousPage = () => {
        if (offset - limit >= 0) {
            setOffset(offset - limit);
        }
    };

    const handleClickBook = e => {
        const b = new Book(e.target.getAttribute('data-bookid'), e.target.getAttribute('data-booktitle'));
    }

    return (
        <div id='searchbar'>
            <form action="/" method="get" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Search books"
                    autoComplete="off"
                    name="s"
                    value={query}
                    onInput={e => setQuery(e.target.value)}
                />
                {/* <button type="submit">Search</button> */}
            </form>
            <button onClick={() => setOrderBy('bookid')} className={'orderby ' + (orderBy === 'bookid' ? 'chosen' : '')}>按索书号排序</button>
            <button onClick={() => setOrderBy('popular')} className={'orderby ' + (orderBy === 'popular' ? 'chosen' : '')}>按热度排序</button>
            {
                result.length > 0 ?
                    <div id='searchresult'>
                        <ul>
                            {
                                result.map(b =>
                                    <li key={b.id} data-bookid={b.id} data-booktitle={b.title} onClick={handleClickBook}>
                                        <Link to={`/book/${encodeURIComponent(b.id)}`}>{b.title}</Link>
                                    </li>
                                )
                            }
                        </ul>
                        <div id='pagechanger'>
                            <button disabled={offset - limit < 0} onClick={handlePreviousPage}>{'<'}</button>
                            {
                                Math.floor(offset / limit) + 1
                            }
                            <button disabled={offset + limit >= resultCount} onClick={handleNextPage}>{'>'}</button>
                        </div>
                    </div>
                    : null
            }
        </div>
    );
}

export default SearchBar;