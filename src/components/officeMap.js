import React, { Component, useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { Modal, Button } from "react-bootstrap";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const OfficeMap = ({ show, setShow, location }) => {
  const handleClose = () => {
    setBody("Loading...");
    setShow(false);
  };

  const [body, setBody] = useState("Loading...");

  const renderMarkers = (map, maps) => {
    const lat_lng = location.geo;
    let marker = new maps.Marker({
      position: { lat: lat_lng.lat, lng: lat_lng.lng },
      map,
      title: location.address,
    });
    return marker;
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Office location</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ height: "70vh", width: "100%" }}>
          {location ? (
            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyBEO5ZEMGgtSxbbRhW67IwkZiKu7yEGSFw",
              }}
              defaultZoom={18}
              defaultCenter={[location.geo.lat, location.geo.lng]}
              yesIWantToUseGoogleMapApiInternals
              onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
            ></GoogleMapReact>
          ) : (
            ""
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OfficeMap;
