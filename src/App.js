import React from "react";
import { NominatimJS } from "nominatim-search";

class OSMSearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = { nearby: [] };
  }
  requestOSMData = (position) => {
    // unpack user current location
    console.log(`Searching for water fountains near:`, position.coords);
    var user_lat = position.coords.latitude;
    var user_lon = position.coords.longitude;

    // request water fountains (drinking water) near user
    NominatimJS.search({
      q: `drinking water near ${user_lat}, ${user_lon}`,
    })
      .then((results) => {
        this.setState({ nearby: results });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(this.requestOSMData);
  }
  render() {
    return (
      <div>
        <ul>
          {this.state.nearby.length > 0 && this.state.nearby.map((result) => (
            // generate a google maps link for each nearby water fountain
            <li>
              {`https://www.google.com/maps/search/?api=1&query=${result.lat},${result.lon}`}
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
      <header className="App-header">
        <OSMSearchResults />
      </header>
    </div>
  );
}

export default App;
