import React from "react";

import { Pagination } from "react-bootstrap";

const ShowPagination = ({ totalPages, currentPage, setCurrentPage }) => {
  const showItems = () => {
    let items = [];
    items.push(
      <Pagination.Item
        disabled={currentPage === 1}
        key={0}
        onClick={(event) => {
          changePage(event, currentPage - 1);
        }}
      >
        Previous
      </Pagination.Item>
    );
    let ini = 1;
    let endPage = totalPages < 7 ? totalPages : 7;

    if (totalPages > 7) {
      if (currentPage > 4) {
        endPage = currentPage + 2 < totalPages ? currentPage + 2 : totalPages;
        items.push(
          <Pagination.Item
            disabled={currentPage === 1}
            key={2}
            onClick={(event) => {
              changePage(event, 1);
            }}
          >
            1
          </Pagination.Item>
        );
        items.push(<Pagination.Ellipsis />);
        ini = currentPage - 2;
      }
      for (let page = ini; page <= endPage; page++) {
        items.push(
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={(event) => {
              changePage(event, page);
            }}
          >
            {page}
          </Pagination.Item>
        );
      }
    } else {
      for (let page = 1; page <= totalPages; page++) {
        items.push(
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={(event) => {
              changePage(event, page);
            }}
          >
            {page}
          </Pagination.Item>
        );
      }
    }
    if (currentPage + 3 < totalPages) items.push(<Pagination.Ellipsis />);
    if (currentPage + 2 < totalPages)
      items.push(
        <Pagination.Item
          key={totalPages}
          active={totalPages === currentPage}
          onClick={(event) => {
            changePage(event, totalPages);
          }}
        >
          {totalPages}
        </Pagination.Item>
      );

    items.push(
      <Pagination.Item
        disabled={currentPage === totalPages}
        key={totalPages + 1}
        onClick={(event) => {
          changePage(event, currentPage + 1);
        }}
      >
        Next
      </Pagination.Item>
    );
    return items;
  };

  const changePage = (event, page) => {
    event.preventDefault();
    setCurrentPage(page);
  };

  return (
    <nav aria-label="Page navigation example">
      <Pagination>{showItems()}</Pagination>
    </nav>
  );
};

export default ShowPagination;
