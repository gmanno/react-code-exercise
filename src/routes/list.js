import React, { useEffect, useState, useRef } from "react";
import { httpClient } from "../util/Api";

import { useForm } from "react-hook-form";

import {
  InputGroup,
  Row,
  Col,
  Button,
  Offcanvas,
  Spinner,
  Form,
  FormControl,
} from "react-bootstrap";
import Table from "../components/table";

const Home = () => {
  const { register, handleSubmit } = useForm();
  const chambers = ["senate", "house"];
  const [session, setSession] = useState(115); // 115th congressional session
  const sessionField = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [chamber, setChamber] = useState("senate"); // or 'house'
  const [membersList, setMembersList] = useState(null);
  const [filteredMembersList, setFilteredMembersList] = useState(null);

  const getMembers = () => {
    setLoading(true);
    httpClient
      .get(`${session}/${chamber}/members.json`)
      .then(({ data }) => {
        return data.results[0];
      })
      .then(({ members, num_results }) => {
        if (num_results == 0) {
          alert("No records found");
        }
        setMembersList(members);
        setFilteredMembersList(members);
        setTotalPages(Math.ceil(members.length / 10));
        setLoading(false);
      })
      .catch(() => {});
  };
  useEffect(() => {
    getMembers();
  }, [session, chamber]);

  const handleShow = () => {
    setShowCanvas(true);
  };
  const handleClose = () => {
    setShowCanvas(false);
  };
  const onSubmit = (values) => {
    let filtered = membersList;
    let fields = [];
    Object.keys(values).forEach((filter) => {
      if (values[`${filter}`] != "") {
        switch (filter) {
          case "name":
            filtered = filtered.filter((item) => {
              let full_name = `${item.first_name}${
                item.middle_name ? item.middle_name : ""
              }${item.last_name}`
                .toUpperCase()
                .replace(/\ /g, "");
              return full_name.includes(
                values[`${filter}`].toUpperCase().replace(/\ /g, "")
              );
            });
            break;
          case "next_election":
            filtered = filtered.filter((item) => {
              return values[`${filter}`] === item.next_election;
            });
            break;
          case "party":
            filtered = filtered.filter((item) => {
              return values[`${filter}`] === item.party;
            });
            break;
        }
      }
    });

    setTotalPages(Math.ceil(filtered.length / 10));
    setFilteredMembersList(filtered);
    setCurrentPage(1);
    setShowCanvas(false);
  };

  const changeChamber = (val) => {
    setChamber(val);
  };
  const changeSession = (val) => {
    setSession(sessionField.current.value);
  };
  return (
    <>
      <Offcanvas show={showCanvas} placement="end" onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Serch by name"
                {...register("name")}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="next_election">
              <Form.Label>Next Election</Form.Label>
              <Form.Control
                type="text"
                placeholder="Year"
                {...register("next_election")}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="party">
              <Form.Label>Party</Form.Label>
              <Form.Select
                aria-label="Default select example"
                {...register("party")}
              >
                <option value="">All</option>
                <option value="R">Republican</option>
                <option value="D">Democrat</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
      <div className="filters">
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
          <Col>
            <Button variant="primary" onClick={handleShow}>
              Filter
            </Button>
          </Col>
        </Row>
      </div>
      <Row>
        {loading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <Col>
            {membersList != null ? (
              <Table
                membersList={filteredMembersList}
                setTotalPages={setTotalPages}
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            ) : (
              ""
            )}
          </Col>
        )}
      </Row>
    </>
  );
};

export default Home;
