import React from "react";
import { NominatimJS } from "nominatim-search";

// From: https://www.geodatasource.com/developers/javascript
// Minor change to always return miles and kilometers as object
function distance(lat1, lon1, lat2, lon2) {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    var miles = dist;
    var kilometers = dist * 1.609344;
    return { miles: miles.toFixed(2), kilometers: kilometers.toFixed(2) };
  }
}

class OSMSearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = { nearby: [], userLat: 0.0, userLon: 0.0, errored: false };
  }
  requestOSMData = (position) => {
    // unpack user current location
    var userLat = position.coords.latitude;
    var userLon = position.coords.longitude;
    this.setState({ userLat: userLat, userLon: userLon });

    // request water fountains (drinking water) near user
    NominatimJS.search({
      q: `${this.props.targetEntity} near ${userLat}, ${userLon}`,
    })
      .then((results) => {
        this.setState({ nearby: results });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ errored: true });
      });
  };

  getGMapsLink = (item) => {
    return `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lon}`;
  };

  getItemDisplay = (item) => {
    var distanceFromUser = distance(
      this.state.userLat,
      this.state.userLon,
      item.lat,
      item.lon
    );
    return `${item.display_name.split(", ").slice(0, 2).join(", ")} -- ${
      distanceFromUser.miles
    } miles away`;
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(this.requestOSMData);
  }
  render() {
    if (this.state.nearby.length === 0) {
      return (
        <div>
          <p>Loading...</p>
        </div>
      );
    }
    if (this.state.errored) {
      return (
        <div>
          <p>Something went wrong...</p>
        </div>
      );
    }
    return (
      <div>
        <h3>Nearby {this.props.displayName}:</h3>
        <ul>
          {this.state.nearby.length > 0 &&
            this.state.nearby.map((result) => (
              // generate a google maps link for each nearby water fountain
              <li key={result.osm_id}>
                <a
                  href={this.getGMapsLink(result)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {this.getItemDisplay(result)}
                </a>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <OSMSearchResults
        targetEntity="drinking water"
        displayName="Water Fountains"
      />
      <OSMSearchResults
        targetEntity="toilet"
        displayName="Restrooms"
      />
      <footer></footer>
    </div>
  );
}

export default App;
