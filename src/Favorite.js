import React, { useEffect, useState } from 'react';
import * as api from './api';
import { Link } from 'react-router-dom';

const AddFavoriteButton = ({ bookid }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const checkIsFavorite = () => {
        const books = window.localStorage.getItem('favorite');
        setIsFavorite(books !== null && books.includes(bookid + ';'));
    }

    const handleAddFavorite = () => {
        let books = window.localStorage.getItem('favorite');
        if (books === null) {
            books = '';
        }
        if (books.includes(bookid + ';')) {
            books = books.replaceAll(bookid, '');
            window.localStorage.setItem('favorite', books);
            setIsFavorite(false);
        } else {
            books = books + bookid + ';';
            window.localStorage.setItem('favorite', books);
            setIsFavorite(true);
        }
    }

    useEffect(checkIsFavorite, [bookid]);

    return (
        <>
            <button id='addfavorite' onClick={handleAddFavorite}>{isFavorite ? '已收藏' : '加入收藏'}</button>
        </>
    );
}

const FavoriteListButton = () => {
    const [opened, setOpened] = useState(false);
    const [books, setBooks] = useState([]);
    const getBooks = async () => {
        const bookids = window.localStorage.getItem('favorite').match(new RegExp('[^;]+(?=;)', 'g'));
        const newBooks = [];
        for (const bookid of bookids) {
            newBooks.push(await api.getBook(bookid));
        }
        setBooks(newBooks);
    }
    useEffect(getBooks, [opened]);

    return (
        <>
            <button id='myfavorite' onClick={() => setOpened(!opened)}>我的收藏</button>
            {
                opened ? (
                    <div id='favoritelist'>
                        <button id='closemyfavorite' onClick={() => setOpened(false)}>X</button>
                        <ul>
                            {
                                books.map(b => (
                                    <li key={b.id}>
                                        <Link to={`/book/${encodeURIComponent(b.id)}`}>{b.title}</Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                ) : null
            }
        </>
    )
}


export { AddFavoriteButton, FavoriteListButton };