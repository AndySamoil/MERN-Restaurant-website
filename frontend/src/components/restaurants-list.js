import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";
import restaurant from "../services/restaurant";

const RestaurantsList = props => {
  // Set variables for search results
  const [restaurants, setRestaurants] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchZip, setSearchZip] = useState("");
  const [searchCuisine, setSearchCuisine] = useState("");
  const [cuisines, setCuisines] = useState(["All Cuisines"])

  // useEffect => component needs to do something after rendering
  useEffect(() => {
    retrieveRestaurants();
    retrieveCuisines();
  }, []);

  // when someone changes the text box,
  // set searchname to the data entered
  const onChangeSearchName = e => {
    const searchName = e.target.value;
    setSearchName(searchName);
  }

  const onChangeSearchZip = e => {
    const searchZip = e.target.value;
    setSearchZip(searchZip);
  }

  const onChangeSearchCuisine = e => {
    const searchCuisine = e.target.value;
    setSearchCuisine(searchCuisine);
  }

  const retrieveRestaurants = () => {
    // do RestaurantDataServer.getAll, then log the data and set restaurants variable to the restaurant data
    RestaurantDataService.getAll()
      .then(response => {
        console.log(response.data);
        setRestaurants(response.data.restaurants);
      })
      .catch(e => {
        console.log(e);
      });
  }

  const retrieveCuisines = () => {
    RestaurantDataService.getCuisines()
      .then(response => {
        console.log(response.data);
        // Drop Down menu, Always start with "All Cuisines", then concat more cuisines after, stored as array
        setCuisines(["All Cuisines"].concat(response.data));
      })
      .catch(e => {
        console.log(e);
      });
  }

  const refreshList = () => {
    retrieveRestaurants();
  }

  const find = (query, by) => {
    RestaurantDataService.find(query, by)
      .then(response => {
        console.log(response.data);
        setRestaurants(response.data.restaurants);
      })
      .catch(e => {
        console.log(e);
      });
  }

  const findByName = () => {
    find(searchName, "name");
  }

  const findByZip = () => {
    find(searchZip, "zipcode")
  }

  const findByCuisine = () => {
    if (searchCuisine == "All Cuisines") {
      refreshList();
    } else {
      find(searchCuisine, "cuisine")
    }
  }


  return (
    <div>
      {/* Boot Strap ClassName's (classes) */}
      <div className="row pb-1">
        {/* TextBox for Searching the Name of a Restaurant */}
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="SearchbyName"
            value={searchName}
            onChange={onChangeSearchName}
          />
          {/* Button to Search for the Restaurant Entered in the textbox */}
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByName}
            >
              Search
            </button>
          </div>
        </div>
        {/* TextBox for Searching the ZipCode of a Restaurant */}
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by zip"
            value={searchZip}
            onChange={onChangeSearchZip}
          />
          {/* Button to Search for the ZipCode Entered in the textbox */}
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByZip}
            >
              Search
            </button>
          </div>
        </div>
        {/* Drop Down Menu for Cuisine Types */}
        <div className="input-group col-lg-4">
          <select onChange={onChangeSearchCuisine}>
            {cuisines.map(cuisine => {
              return (
                // the substr(0, 20) means the cusine name is limited to 20 chars
                <option value={cuisine}> {cuisine.substr(0, 20)} </option>
              )
            })}
          </select>
          {/* Search Button For Cuisine DropDownMenu */}
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByCuisine}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        {/* Essentailly a for loop using the map function */}
        {/* for each restaurant in restaurants */}
        {restaurants.map((restaurant) => {
          // get address parts and combine
          const address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`;
          return (
            // FROM BOOTSTRAP => use of cards for each entry
            <div className="col-lg-4 pb-1">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{restaurant.name}</h5>
                  <p className="card-text">
                    <strong>Cuisine: </strong>{restaurant.cuisine}<br/>
                    <strong>Address: </strong>{address}
                  </p>
                  <div className="row">
                  <Link to={"/restaurants/"+restaurant._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
                    View Reviews
                  </Link>
                  <a target="_blank" href={"https://www.google.com/maps/place/" + address} className="btn btn-primary col-lg-5 mx-1 mb-1">View Map</a>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RestaurantsList;