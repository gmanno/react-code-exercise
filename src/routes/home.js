import React, { useEffect, useState, useCallback } from "react";
import { httpClient } from "../util/Api";
import { Table } from "react-bootstrap";

const Home = () => {
  const [session, setSession] = useState(115); // 115th congressional session
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [chamber, setChamber] = useState("senate"); // or 'house'
  const [membersList, setMembersList] = useState(null);

  const getMembers = () => {
    httpClient
      .get(`${session}/${chamber}/members.json`)
      .then(({ data }) => {
        return data.results[0];
      })
      .then(({ members }) => {
        setMembersList(members);
      })
      .catch(() => {});
  };
  useEffect(() => {
    getMembers();
  }, [session, chamber]);

  const showTable = () => {
    return (
      <div className="table-responsive">
        <Table striped bordered className="table">
          <thead>
            <tr>
              <th>Full name</th>
              <th>Social media</th>
              <th>Party</th>
              <th>State</th>
              <th>Up for election in</th>
            </tr>
          </thead>
          <tbody>{renderItems()}</tbody>
        </Table>
      </div>
    );
  };
  const renderItems = useCallback(() => {
    return membersList.map((item, index) => {
      if (index < pageSize * page && index >= pageSize * (page - 1)) {
        return (
          <tr key={item.id}>
            <th>{`${item.first_name} ${
              item.middle_name ? item.middle_name : ""
            } ${item.last_name}`}</th>
            <td>{item.twitter_account}</td>
            <td>{showPartyName(item.party)}</td>
            <td>{item.state}</td>
            <td>{item.next_election}</td>
          </tr>
        );
      }
    });
  });

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

  return <>{membersList != null ? showTable() : ""}</>;
};

export default Home;
