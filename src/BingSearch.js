const BingSearch = ({title}) => {
    return (
        <a id='bingsearch' 
            href={`http://cn.bing.com/search?q=${encodeURIComponent(title)}`} 
            target="_blank"
        >必应搜索</a>

    );
}

export default BingSearch;
