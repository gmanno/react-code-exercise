import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";

import { Table, Pagination, Dropdown } from "react-bootstrap";
library.add(fab);

const MembersTable = ({
  membersList,
  totalPages,
  setTotalPages,
  currentPage,
  setCurrentPage,
}) => {
  const [pageSize, setPageSize] = useState(10);

  const showPartyName = (party) => {
    switch (party) {
      case "R":
        return "Republican";
        break;
      case "D":
        return "Democrat";
        break;
      default:
        return party;
    }
  };

  const changePage = (event, page) => {
    event.preventDefault();
    setCurrentPage(page);
  };

  const changePageSize = (event, size) => {
    event.preventDefault();
    setPageSize(size);
    setCurrentPage(1);
    setTotalPages(Math.ceil(membersList.length / size));
  };

  const showPaginationItems = () => {
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
    if (currentPage + 3 < totalPages && totalPages > 7)
      items.push(<Pagination.Ellipsis />);
    if (currentPage + 2 < totalPages && totalPages > 7)
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

  return (
    <div className="table-responsive">
      <Table striped bordered className="table">
        <thead>
          <tr>
            <th>Full name</th>
            <th>Social media</th>
            <th>Party</th>
            <th>State</th>
            <th>Next election</th>
          </tr>
        </thead>
        <tbody>
          {membersList.map((item, index) => {
            if (
              index < pageSize * currentPage &&
              index >= pageSize * (currentPage - 1)
            ) {
              return (
                <tr key={item.id}>
                  <td>
                    {`${item.first_name} ${
                      item.middle_name ? item.middle_name : ""
                    } ${item.last_name}`}
                  </td>
                  <td className="social_media">
                    <a
                      href={`https://twitter.com/${item.twitter_account}`}
                      target="_blank"
                    >
                      <FontAwesomeIcon icon={["fab", "twitter"]} />
                    </a>
                    <a
                      href={`https://facebook.com/${item.facebook_account}`}
                      target="_blank"
                    >
                      <FontAwesomeIcon icon={["fab", "facebook"]} />
                    </a>
                    <a
                      href={`https://youtube.com/${item.youtube_account}`}
                      target="_blank"
                    >
                      <FontAwesomeIcon icon={["fab", "youtube"]} />
                    </a>
                  </td>
                  <td>{showPartyName(item.party)}</td>
                  <td>{item.state}</td>
                  <td>{item.next_election}</td>
                </tr>
              );
            }
          })}
        </tbody>
      </Table>
      {totalPages > 1 ? (
        <nav aria-label="Pagination">
          <Pagination>
            {showPaginationItems()}
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">
                {pageSize} / page
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  href="#"
                  onClick={(event) => {
                    changePageSize(event, 10);
                  }}
                >
                  10 / page
                </Dropdown.Item>
                <Dropdown.Item
                  href="#"
                  onClick={(event) => {
                    changePageSize(event, 20);
                  }}
                >
                  20 / page
                </Dropdown.Item>
                <Dropdown.Item
                  href="#"
                  onClick={(event) => {
                    changePageSize(event, 30);
                  }}
                >
                  30 / page
                </Dropdown.Item>
                <Dropdown.Item
                  href="#"
                  onClick={(event) => {
                    changePageSize(event, 50);
                  }}
                >
                  50 / page
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Pagination>
        </nav>
      ) : (
        ""
      )}
    </div>
  );
};

export default MembersTable;
