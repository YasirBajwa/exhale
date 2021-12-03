/* eslint-disable jsx-a11y/alt-text */
import React, { useState,useEffect } from "react";
import "./../../../container/Layout/Dashboard/exercise.css";
import ExerciseImage from "./../../../assets/images/exe.jpg";
import PlayBtn from "./../../../assets/images/play-btn.png";

import ReactPlayer from "react-player/lazy";
import { submitCompleteExercise,getUserProfile } from'../../../apis/userApi';
import {  errorSwal } from "../../../components/swal/Swal";

function Exercise() {
  const [userProfileData, setUserProfileData] = useState([]);
  const [desc,setDescription] = useState('');
  const [title,setTitle] = useState('');
  const [videoUrl,setVideoUrl] = useState('');
  let [toogle, setToogle] = useState(false);
  let [ImageToggle, setImageToggle] = useState(true);
  let [pressBtn, setPressBtn] = useState(true);

  const playVideo = () => {
    setToogle(true);
    setImageToggle(false);
  };
  const getUserProfileData = async() => {
    let response = await getUserProfile();
    if(response.status === 400){
        response = await response.json();
        errorSwal('oops',response.non_field_errors[0]);
        this.props.loading(false);
    }
    else if(response.status === 200)
    {
        response = await response.json();
        setUserProfileData(response.details.todays_exercise);
    }

  };
  const completeExercise = async() => {

    var formdata = new FormData();
    formdata.append("is_completed", "True");

    let response = await submitCompleteExercise('49', formdata);
    if(response.status === 400){
        response = await response.json();
        errorSwal('oops',response.message);
    }
    else if(response.status === 200)
    {
        response = await response.json();    }
  };
  const pressButton = () => {
    setPressBtn(false);
    completeExercise()
  };
  useEffect(() =>{
    getUserProfileData()
},[])

  return (
    <div>
      {

        userProfileData && userProfileData.map(( dataVal) =>
        
      
      <div className="exercise-wrapper">
        <p>Today Exercise</p>
        {ImageToggle ? (
          <div className="image-container">
            <img className="exe-img" alt="" src={ExerciseImage} />
            <div className="play-btn" onClick={() => playVideo()}>
              <img src={PlayBtn} alt="" className="" width="50px" />
            </div>
          </div>
        ) : null}

        {toogle ? (
          <div className="video-container">
            <ReactPlayer
              playing={true}
              controls={true}
              className="player-wrapper"
              url={`${dataVal.exercise['video']}`}
            />
          </div>
        ) : null}

        <div className="exercise-detail">
          <div className="e-d1">
            <div>
              <h5>Day 20</h5>
              <div>Exrecise 7:   {dataVal.exercise['title']}</div>
            </div>
            <div
              onClick={() => pressButton()}
              className={pressBtn ? "check-btn" : "press-btn"}
            >
              <i
                className={pressBtn ? `fa fa-check` : `fa fa-check fa-checked`}
                aria-hidden="true"
              ></i>
              Mark as complete
            </div>
          </div>
        </div>
        <div className="exercis-overview">
          <div>Overview</div>
          <p>
            {dataVal.exercise['description']}
          </p>
        </div>
      </div>
        )
      }
    </div>
  );
}

export default Exercise;
