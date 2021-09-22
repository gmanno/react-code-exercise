import React, { useEffect, useState, useRef } from "react";
import { httpClient } from "../util/Api";
import {
  Table,
  InputGroup,
  Row,
  Col,
  Button,
  Modal,
  Spinner,
  Form,
  FormControl,
} from "react-bootstrap";
import Pagination from "../components/pagination";

const Home = () => {
  const chambers = ["senate", "house"];
  const [session, setSession] = useState(115); // 115th congressional session
  const sessionField = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dataTable, setDataTable] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [chamber, setChamber] = useState("senate"); // or 'house'
  const [membersList, setMembersList] = useState(null);
  const [tableItems, setTableItems] = useState(null);

  const getMembers = () => {
    setLoading(true);
    httpClient
      .get(`${session}/${chamber}/members.json`)
      .then(({ data }) => {
        setTotalPages(Math.ceil(data.results[0].num_results / pageSize));
        return data.results[0];
      })
      .then(({ members }) => {
        setMembersList(members);
        setLoading(false);
        setCurrentPage(1);
      })
      .catch(() => {});
  };
  useEffect(() => {
    getMembers();
  }, [session, chamber]);

  useEffect(() => {
    if (currentPage !== null) tableContent();
  }, [membersList, currentPage]);

  const tableContent = () => {
    setDataTable(
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
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    );
  };

  const renderItems = () => {
    return membersList.map((item, index) => {
      if (
        index < pageSize * currentPage &&
        index >= pageSize * (currentPage - 1)
      ) {
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
  };

  const changePage = (event, page) => {
    event.preventDefault();
  };

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

  const handleShow = () => {
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
  };
  const handleSubmit = (event, values) => {
    event.preventDefault();
    console.log(event.target);
  };

  const changeChamber = (val) => {
    setChamber(val);
  };
  const changeSession = (val) => {
    setSession(sessionField.current.value);
  };
  return (
    <>
      {/* <Button variant="primary" onClick={handleShow}>
        Filter
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Filter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Chamber</Form.Label>

              <div key={`inline-radio`} className="mb-3">
                <Form.Check
                  inline
                  defaultChecked={chamber === "senate"}
                  label="Senate"
                  name="group1"
                  type="radio"
                  id={`inline-radio-1`}
                />
                <Form.Check
                  inline
                  defaultChecked={chamber === "house"}
                  label="House"
                  name="group1"
                  type="radio"
                  id={`inline-radio-2`}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Session</Form.Label>
              <Form.Control
                type="text"
                placeholder="Session"
                defaultValue={session}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Search
            </Button>
          </Form>
        </Modal.Body>
      </Modal> */}
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <div key={`inline-radio`} className="mb-3">
              <Form.Label>Chamber: </Form.Label>{" "}
              {chambers.map((item) => (
                <Form.Check
                  inline
                  defaultChecked={chamber === item}
                  onChange={() => changeChamber(item)}
                  key={item}
                  label={item}
                  name="chamber"
                  type="radio"
                  id={`inline-radio-${item}`}
                />
              ))}
            </div>
          </Form.Group>
        </Col>
        <Col>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="session number"
              defaultValue={session}
              ref={sessionField}
            />
            <Button
              onClick={(ev) => {
                changeSession(ev);
              }}
              variant="outline-secondary"
              id="button-addon2"
            >
              Get Session
            </Button>
          </InputGroup>
        </Col>
      </Row>
      <Row>
        {loading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <Col>{membersList != null ? dataTable : ""}</Col>
        )}
      </Row>
    </>
  );
};

export default Home;
