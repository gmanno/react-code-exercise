import React, { useEffect, useState } from "react";
import { Modal, Button, Accordion, Card } from "react-bootstrap";

const details = ({ show, setShow, data }) => {
  const handleClose = () => {
    setBody("Loading...");
    setShow(false);
  };
  const [body, setBody] = useState("Loading...");

  useEffect(() => {
    console.log(data.item);
    if (data.item != null)
      setBody(
        <>
          <h4>Roles</h4>
          <Accordion>
            {data.item.roles.map((role, i) => {
              return (
                <Accordion.Item eventKey={i}>
                  <Accordion.Header>
                    #{role.congress} - {role.title} - ({role.start_date} /{" "}
                    {role.end_date})
                  </Accordion.Header>
                  <Accordion.Body>
                    <h5>Comittees</h5>
                    <ul>
                      {role.committees.map((comittee) => {
                        return <li>{comittee.name}</li>;
                      })}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              );
            })}
          </Accordion>
        </>
      );
  }, [data]);

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>{data.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default details;
