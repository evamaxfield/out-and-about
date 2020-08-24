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

  getItemNameDisplay = (item) => {
    return item.display_name
      .split(", ")
      .slice(this.props.sliceItemNameFrom, this.props.sliceItemNameTo)
      .join(", ");
  };

  getItemDistanceDisplay = (item) => {
    var distanceFromUser = distance(
      this.state.userLat,
      this.state.userLon,
      item.lat,
      item.lon
    );

    return `${distanceFromUser.miles} miles away`;
  };

  getItemDisplay = (item) => {
    return `${this.getItemNameDisplay(item)} -- ${this.getItemDistanceDisplay(
      item
    )}`;
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(this.requestOSMData);
  }
  render() {
    if (this.state.nearby.length === 0) {
      return (
        <div className="osm-results-container">
          <h3>Nearby {this.props.displayName}:</h3>
          <p>Loading...</p>
        </div>
      );
    }
    if (this.state.errored) {
      return (
        <div className="osm-results-container">
          <h3>Nearby {this.props.displayName}:</h3>
          <p>Something went wrong...</p>
        </div>
      );
    }
    return (
      <div className="osm-results-container">
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
    <header>
        <h1>Out and About</h1>

        <p>
            Public amenities near you.<br/>
            All links below route to Google Maps.
        </p>
    </header>
      <div className="wrap-container">
        <OSMSearchResults
          targetEntity="drinking water"
          displayName="Water Fountains"
          sliceItemNameFrom={0}
          sliceItemNameTo={2}
        />
        <OSMSearchResults
          targetEntity="toilet"
          displayName="Restrooms"
          sliceItemNameFrom={1}
          sliceItemNameTo={3}
        />
      </div>
      <footer>
        <p>Help make this better -- <a href="https://github.com/JacksonMaxfield/out-and-about" target="_blank"
        rel="noopener noreferrer">Contribute on Github!</a></p>
      </footer>
    </div>
  );
}

export default App;
