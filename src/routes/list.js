import React, { useEffect, useState, useRef } from "react";
import { httpClient } from "../util/Api";
import { usStates } from "../util/states";
import { useForm } from "react-hook-form";
import { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import encodeUrl from "encodeurl";

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
  const chambers = ["senate", "house"];
  const [chamber, setChamber] = useState("senate"); // or 'house'
  const [session, setSession] = useState(115); // 115th congressional session
  const [shareUrl, setShareUrl] = useState(
    `?chamber=${chamber}&session=${session}`
  );
  const sessionField = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showRange, setShowRange] = useState([0, 100]);
  const [showRangeMissedVotes, setShowRangeMissedVotes] = useState([0, 100]);
  const [showCanvas, setShowCanvas] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [membersList, setMembersList] = useState(null);
  const [filteredMembersList, setFilteredMembersList] = useState(null);
  const { register, handleSubmit } = useForm();
  const rangeField = useRef(null);
  const rangeFieldMissedVotes = useRef(null);

  const getMembers = () => {
    setLoading(true);
    setShareUrl(`?chamber=${chamber}&session=${session}`);
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
        setCurrentPage(1);
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
    let url = "";
    Object.keys(values).forEach((filter) => {
      if (values[`${filter}`] != "") {
        url += `&${filter}=${values[`${filter}`]}`;
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
          case "gender":
            filtered = filtered.filter((item) => {
              return values[`${filter}`] === item.gender;
            });
            break;
          case "state":
            filtered = filtered.filter((item) => {
              return values[`${filter}`] === item.state;
            });
            break;
        }
      }
    });

    filtered = filtered.filter((item) => {
      return (
        rangeField.current.state.bounds[0] <= item.votes_with_party_pct &&
        rangeField.current.state.bounds[1] >= item.votes_with_party_pct
      );
    });
    filtered = filtered.filter((item) => {
      return (
        rangeFieldMissedVotes.current.state.bounds[0] <= item.missed_votes &&
        rangeFieldMissedVotes.current.state.bounds[1] >= item.missed_votes
      );
    });

    setShareUrl(`?chamber=${chamber}&session=${session}${url}`);

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

  const rangePct = (event) => {
    setShowRange([event[0], event[1]]);
  };
  const rangePctMissedVotes = (event) => {
    setShowRangeMissedVotes([event[0], event[1]]);
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
              <Form.Select aria-label="Select party" {...register("party")}>
                <option value="">All</option>
                <option value="R">Republican</option>
                <option value="D">Democrat</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="gender">
              <Form.Label>Gender</Form.Label>
              <Form.Select aria-label="Select Gender" {...register("gender")}>
                <option value="">All</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="state">
              <Form.Label>State</Form.Label>
              <Form.Select aria-label="Select state" {...register("state")}>
                <option value="">All</option>
                {usStates.map((state) => {
                  return (
                    <option value={state.abbreviation}>{state.name}</option>
                  );
                })}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="votes_with_party_percentage">
              <Form.Label>Votes With Party</Form.Label>
              <Range
                ref={rangeField}
                defaultValue={showRange}
                onChange={rangePct}
              />
              <Form.Text className="text-muted">{`${showRange[0]}% - ${showRange[1]}%`}</Form.Text>
            </Form.Group>
            <Form.Group controlId="missed_votes">
              <Form.Label>Missed Votes</Form.Label>
              <Range
                ref={rangeFieldMissedVotes}
                defaultValue={showRangeMissedVotes}
                onChange={rangePctMissedVotes}
              />
              <Form.Text className="text-muted">{`${showRangeMissedVotes[0]}% - ${showRangeMissedVotes[1]}%`}</Form.Text>
            </Form.Group>

            <Button
              style={{ marginTop: "10px" }}
              variant="primary"
              type="submit"
            >
              Submit
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
      <div className="filters">
        <Row>
          <Col className="col-6">
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
          <Col className="col-3">
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
          <Col className="col-2">
            <Button variant="primary">
              <a
                href={`${encodeUrl(shareUrl)}`}
                target="_blank"
                style={{ color: "white" }}
              >
                Share
              </a>
            </Button>
          </Col>
          <Col className="col-1">
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
