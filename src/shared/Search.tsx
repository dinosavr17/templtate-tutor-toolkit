import { useState, useEffect } from 'react';

const SearchComponent = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            // Только если ввод не менялся в течение 300ms
            handleSearch();
        }, 300);

        // Очистка таймаута при каждом изменении ввода
        return () => clearTimeout(delayDebounceFn);
    }, [query, currentPage]); // Зависимости эффекта

    const handleSearch = async () => {
        // Логика отправки запроса на сервер
        // с использованием значения query и currentPage
        // и установка полученных результатов через setResults
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Здесь может быть логика для обновления результатов с новой страницей
    };

    return (
        <div>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
            <SearchResultComponent results={results} currentPage={currentPage} onPageChange={handlePageChange} />
        </div>
    );
};

export default SearchComponent;
