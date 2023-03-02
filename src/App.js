import React, { useState } from 'react';
import axios from 'axios';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleLimitChange = (event) => {
    const newLimit = parseInt(event.target.value);
    if (newLimit < 5 || newLimit > 10) {
      alert('Limit must be between 5 and 10');
      return;
    }
    setLimit(newLimit);
    setSearchResults([]);
    setPage(1);
    setTotalPages(1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const options = {
      method: 'GET',
      url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
      params: { countryIds: 'IN', namePrefix: searchTerm, limit: limit.toString(), offset: ((page - 1) * limit).toString() },
      headers: {
        'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
        'x-rapidapi-key': '4ac5e3352fmshe6ac515ca3b8ccap1f0045jsnf0a504a87bbe'
      }
    };
    axios
      .request(options)
      .then(function (response) {
        setSearchResults(response.data.data);
        setTotalPages(Math.ceil(response.data.metadata.totalCount / limit));
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <input type="text" value={searchTerm} onChange={handleChange} />
          
        </label>
        <label>
          Limit:
          <input type="number" value={limit} min="5" max="10" onChange={handleLimitChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
      {searchResults.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Place</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((result, index) => (
              <tr key={result.id}>
                <td>{(page - 1) * limit + index + 1}</td>
                <td>{result.city}</td>
                <td>{result.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {totalPages > 1 && (
        <div>
          {getPageNumbers().map((pageNumber) => (
            <button key={pageNumber} onClick={() => handlePageChange(pageNumber)}>
              {pageNumber}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar
