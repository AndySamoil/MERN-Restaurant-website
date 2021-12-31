import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";
import { useParams, useLocation, useNavigate } from "react-router-dom";


// props is our input var kinda

const Restaurant = props => {

  const initialRestaurantState = {
    id: null,
    name: "",
    address: {},
    cuisine: "",
    reviews: []
  };

  let cur = useParams();
  let now = useLocation();
  let nava = useNavigate();
  

  const [restaurant, setRestaurant] = useState(initialRestaurantState);

  const getRestaurant = id => {
    RestaurantDataService.get(id)
      .then(response => {
        setRestaurant(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  //  use Effect has a dependency ( the array at the bottom )
  // use Effect will only do the effect if the dependency has changed
  // else it will remain constant
  useEffect(() => {
    console.log(props)
    getRestaurant(cur.id);
  }, [cur.id]);


  const deleteReview = (reviewId, index) => {
    RestaurantDataService.deleteReview(reviewId, props.user.id)
      .then(response => {
        setRestaurant((prevState) => {
          prevState.reviews.splice(index, 1)
          return({
            ...prevState
          })
        })
      })
      .catch(e => {
        console.log(e);
      });
  }

  const toNext = (review = null) => {
    nava("/restaurants/" + cur.id + "/review", {state:{currentReview: review}})
  }

  return (
    <div>
      
      {/* First Check if there is a restaurant */}
      {restaurant ? (
        // if there is a restaurant
        <div>
          <h5>{restaurant.name}</h5>
          <p>
            <strong>Cuisine: </strong>{restaurant.cuisine}<br/>
            <strong>Address: </strong>{restaurant.address.building} {restaurant.address.street}, {restaurant.address.zipcode}
          </p>
          <Link to={{
                    pathname:"/restaurants/" + cur.id + "/review",
                    state: {currentReview: "meow"},
                    }} className="btn btn-primary">
            Add Review
          </Link>

          <a onClick={()=>{toNext()}} className="btn btn-primary"> Add Review </a>

          <h4> Reviews </h4>
          <div className="row">
            {/* Check if restaurant reviews length is > 0  */}
            {restaurant.reviews.length > 0 ? (
             restaurant.reviews.map((review, index) => {
               return (
                 <div className="col-lg-4 pb-1" key={index}>
                   <div className="card">
                     <div className="card-body">
                       <p className="card-text">
                         {review.text}<br/>
                         {review.user_id}<br/>
                         <strong>User: </strong>{review.name}<br/>
                         <strong>Date: </strong>{review.date}
                       </p>
                       {/* if props.user and the userid is matching with the review  */}
                       
                       {props.user && props.user.id == review.user_id &&
                          <div className="row">
                            <a onClick={() => deleteReview(review._id, index)} className="btn btn-primary col-lg-5 mx-1 mb-1">Delete</a>
                            <a onClick={()=>{toNext(review)}} className="btn btn-primary col-lg-5 mx-1 mb-1"> Edit </a>
                            {/* <Link 
                              to={{
                                pathname:"/restaurants/" + cur.id + "/review",
                                state: {currentReview: review},
                              }} {...now.state = {currentReview: review}}
                             className="btn btn-primary col-lg-5 mx-1 mb-1">Edit</Link> */}
                          </div>                   
                       }
                     </div>
                   </div>
                 </div>
               );
             })
            ) : (
            <div className="col-sm-4">
              <p>No reviews yet.</p>
            </div>
            )}

          </div>

        </div>
      ) : (
        <div>
          <br />
          <p>No restaurant selected.</p>
        </div>
      )} 
    </div>
  );
}

export default Restaurant;