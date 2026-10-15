import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';


const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [purchase, setPurchase] = useState(false);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0,curr_url.indexOf("postreview"));
  let params = useParams();
  let id =params.id;
  let dealer_url = root_url+`djangoapp/dealer/${id}`;
  let review_url = root_url+`djangoapp/add_review`;
  let carmodels_url = root_url+`djangoapp/get_cars`;

  const makes = [...new Set(carmodels.map(carmodel => carmodel.CarMake))];
  const models = carmodels
    .filter(carmodel => carmodel.CarMake === make)
    .map(carmodel => carmodel.CarModel);
  const years = carmodels
    .filter(carmodel => carmodel.CarMake === make && carmodel.CarModel === model)
    .map(carmodel => carmodel.year);

  const postreview = async ()=>{
    let name = sessionStorage.getItem("firstname")+" "+sessionStorage.getItem("lastname");
    //If the first and second name are stores as null, use the username
    if(name.includes("null")) {
      name = sessionStorage.getItem("username");
    }
    if(!review.trim() || !make || !model || !year) {
      alert("All details are mandatory")
      return;
    }

    let jsoninput = JSON.stringify({
      "name": name,
      "dealership": id,
      "review": review,
      "purchase": purchase,
      "purchase_date": date,
      "car_make": make,
      "car_model": model,
      "car_year": year,
    });

    console.log(jsoninput);
    const res = await fetch(review_url, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: jsoninput,
  });

  const json = await res.json();
  if (json.status === 200) {
      window.location.href = window.location.origin+"/dealer/"+id;
  }

  }
  const get_dealer = async ()=>{
    try {
      const res = await fetch(dealer_url, {
        method: "GET"
      });
      const retobj = await res.json();
      
      if(retobj.status === 200) {
        let dealerobjs = Array.from(retobj.dealer)
        if(dealerobjs.length > 0)
          setDealer(dealerobjs[0])
      }
    } catch (error) {
      console.error("Unable to load dealer details", error);
    }
  }

  const get_cars = async ()=>{
    try {
      const res = await fetch(carmodels_url, {
        method: "GET"
      });
      const retobj = await res.json();
      
      let carmodelsarr = Array.from(retobj.CarModels)
      setCarmodels(carmodelsarr)
    } catch (error) {
      console.error("Unable to load car models", error);
    }
  }
  useEffect(() => {
    get_dealer();
    get_cars();
  },[]);


  return (
    <div>
      <Header/>
      <div  style={{margin:"5%"}}>
      <h1 style={{color:"darkblue"}}>{dealer.full_name}</h1>
      <label htmlFor="review">Review</label>
      <textarea id='review' cols='50' rows='7' onChange={(e) => setReview(e.target.value)}></textarea>
      <div className='input_field'>
      <label htmlFor="purchase">Did you purchase this car?</label>
      <input id="purchase" type="checkbox" checked={purchase} onChange={(e) => {
        setPurchase(e.target.checked);
        if (!e.target.checked) {
          setDate("");
        }
      }}/>
      </div>
      <div className='input_field'>
      <label htmlFor="purchase-date">Purchase Date</label>
      <input id="purchase-date" type="date" value={date} disabled={!purchase} onChange={(e) => setDate(e.target.value)}/>
      </div>
      <div className='input_field'>
      <label htmlFor="car-make">Car Make</label>
      <select name="car-make" id="car-make" value={make} onChange={(e) => {
        setMake(e.target.value);
        setModel("");
        setYear("");
      }}>
      <option value="" disabled>Choose Car Make</option>
      {makes.map(carMake => (
          <option key={carMake} value={carMake}>{carMake}</option>
      ))}
      </select>
      </div>

      <div className='input_field'>
      <label htmlFor="car-model">Car Model</label>
      <select name="car-model" id="car-model" value={model} disabled={!make} onChange={(e) => {
        setModel(e.target.value);
        setYear("");
      }}>
      <option value="" disabled>Choose Car Model</option>
      {models.map(carModel => (
          <option key={carModel} value={carModel}>{carModel}</option>
      ))}
      </select>
      </div >

      <div className='input_field'>
      <label htmlFor="car-year">Car Year</label>
      <select name="car-year" id="car-year" value={year} disabled={!model} onChange={(e) => setYear(e.target.value)}>
      <option value="" disabled>Choose Car Year</option>
      {years.map(carYear => (
          <option key={carYear} value={carYear}>{carYear}</option>
      ))}
      </select>
      </div>

      <div>
      <button className='postreview' onClick={postreview}>Post Review</button>
      </div>
    </div>
    </div>
  )
}
export default PostReview
