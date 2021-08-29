import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import PopularityLineChart from './chart/PopularityLineChart';
import { Book, BookClassification } from './Book';
import * as api from './api';
import SearchBar from './SearchBar';
import { ChartTest } from './chart/d3Utils';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import BookInfo from './BookInfo';
import MonthlyRanking from './chart/MonthlyRanking';
import { FavoriteListButton } from './Favorite';

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <SearchBar />
            <div id='header'>
                <FavoriteListButton />
                <Link to='/ranking'>热书月榜</Link>
            </div>
            <div id='content'>
                <Switch>
                    <Route path='/book/:bookid'
                        render={({ match, location, history }) => <BookInfo bookid={decodeURIComponent(match.params.bookid)} />}
                    />
                    <Route path='/ranking'
                        render={() => <MonthlyRanking year={2013} month={1} />}
                    />

                </Switch>
            </div>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
