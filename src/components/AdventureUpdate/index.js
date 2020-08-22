//update existing adventure details
import React, { useEffect, useState } from "react";
import API from "../../util/API";
import axios from 'axios';
import { Input, TextArea, FormBtn, Dropdown, NumberInput } from "../Form";
import Cell from '../Cell'
import Gridx from '../Gridx'
import Btn from '../Btn'
import TagRow from '../TagRow'
import './style.css'


function AdventureUpdate(props) {
  // modal show hide controls as passed in from parent
  let showHideModal = props.show ? 'reveal d-block' : 'reveal d-none'
  const handleModalClose = () => {
    props.handleModalClose()
  }

  //set initial state of the form Object.
  const [formObject, setFormObject] = useState({})
  //state to facilitate tags adding
  const [dropdownArr, setDropdownArr] = useState([])
  const [dropdownValue, setDropdownValue] = useState('')
  const [tagArr, setTagArr] = useState([])
  const [allTags, setAllTags] = useState([])

  //checks for data when modal visibility setting changes
  useEffect(() => {
    loadInitialData();
  }, [props.show])

  // state to control image
  const [image, setImage] = useState('');
  const onSubmit = e => {
    setImage(e.target.files[0]);
  };

  //populate update form with existing data of that adventure
  async function loadInitialData() {
    let { data } = await API.getAdventurebyId(props.id)
    setFormObject({
      adventureName: data.adventureName,
      description: data.description,
      location: data.location,
      itinerary: data.itinerary,
      time: data.duration ? parseInt(data.duration.time) : 1,
      unit: data.duration ? data.duration.unit : 'hours',
      difficulty: data.difficulty,
      minGroupSize: parseInt(data.minGroupSize),
      maxGroupSize: parseInt(data.maxGroupSize),
      price: parseInt(data.price),
      gearList: data.gearList,
      tags: data.tags ? data.tags.map(tag => tag = tag.tagName) : [],
      adventureImageUrl: data.adventureImageUrl
    })
    //pre-load tags if some have already been chosen
    if (data.tags) {
      const x = data.tags.map(tag => tag.tagName)
      setTagArr(x)
    }
  }

  useEffect(() => {
    //get all tags for tags dropDown and grab just the names of the tags
    API.getTags().then(result => {
      let newArr = result.data
      setAllTags(newArr)
      newArr = newArr.map(item => item = item.tagName)
      setDropdownArr(newArr)
    }).catch(err => console.log(err))
  }, [])

  //input field value controls
  function handleInputChange(event) {

    let name = event.target.name
    let value
    //some db fields need to be numbers
    if (name === "minGroupSize" || name === "maxGroupSize" || name === "price") {
      value = parseInt(event.target.value)
    } else {
      value = event.target.value
    }
    if (name !== 'tags') {

      setFormObject({ ...formObject, [name]: value })
    } else if (tagArr.indexOf(event.target.value) < 0) {
      //if this tag is not already in the tags array, then put it there
      setTagArr([...tagArr, event.target.value])
      setDropdownValue(event.target.value)
    }
  }
  //tag handling
  const handleFilterTags = (e) => {
    let deletedTag = e.target.getAttribute('value')
    setTagArr(tagArr.filter(tag => tag !== deletedTag))
  }
  //===========handle incrementing for number input components=================
  const handleGroupDec = (e) => {
    let name = e.target.name
    let num = formObject[name]
    if (num > 1) num--
    setFormObject({ ...formObject, [name]: num })
  }

  const handleGroupInc = (e) => {
    let name = e.target.name
    let num = formObject[name]
    if (num < 30) num++
    setFormObject({ ...formObject, [name]: num })
  }

  const handlePriceDec = (e) => {
    let name = e.target.name
    let num = formObject[name]
    if (num > 9) num -= 10
    setFormObject({ ...formObject, [name]: num })
  }

  const handlePriceInc = (e) => {
    let name = e.target.name
    let num = formObject[name]
    num += 10
    setFormObject({ ...formObject, [name]: num })
  }
  //===========END handle incrementing for number input components=================

  // handle form submit function
  async function handleFormSubmit(event) {
    event.preventDefault();
    let postObj = { ...formObject }
    //put tags array in here
    postObj.tags = allTags.filter(tag => tagArr.indexOf(tag.tagName) > -1).map(tag => tag._id)
    //set duration info in a format that is needed for database
    postObj.duration = { time: formObject.time, unit: formObject.unit }
    //logic check for group sizing
    if (postObj.maxGroupSize < postObj.minGroupSize) postObj.maxGroupSize = postObj.minGroupSize
    // base url for Cloudinary query and preset needed to upload images
    if (image !== '') {
      const url = 'https://api.cloudinary.com/v1_1/yestoskydiving/image/upload';
      const preset = 'guidemeadventurepic';
      // create new FormData to hold image data
      const formData = new FormData();
      console.log("new FormData initiated")
      // the intended image and the preset are appended to the FormData object
      formData.append('file', image);
      formData.append('upload_preset', preset);
      try {
        // axios call is made to cloudinary url in order to load the FormData object, and awaited response is assigned to variable 'res'
        const res = await axios.post(url, formData);
        console.log("axios calls has been made to cloudinary")
        // from the response received back, the secure url for the image is assigned to variable imageUrl
        const imageUrl = res.data.secure_url;
        console.log("result from cloudinary = " + imageUrl)
        // add imageUrl to postObject
        postObj.adventureImageUrl = imageUrl
      } catch (err) {
        console.error(err);
      }
    }
    API.updateAdventure(postObj, props.id)
      .then(data => {
        //TODO: do we really need a notification that the adventure has been updated?
        // alert('Adventure updated!')
        setFormObject({
          adventureName: '',
          description: '',
          location: '',
          itinerary: '',
          time: 1,
          unit: 'hours',
          difficulty: '',
          minGroupSize: '',
          maxGroupSize: '',
          price: '',
          gearList: '',
          tags: [],
          adventureImageUrl: ''
        })
        handleModalClose();
      }).catch(err => console.log(err))
  }

  return (
    <div className={showHideModal} id="adventureModal1">
      <h1>Update your Adventure</h1>
      <p className="lead">You can update features here</p>
      <div className="grid-container fluid">
        <Gridx>
          <Cell size="">
            <form>
              <Input
                onChange={handleInputChange}
                name="adventureName"
                placeholder="Adventure:"
                value={formObject.adventureName}
              />
              <TextArea
                onChange={handleInputChange}
                name="description"
                placeholder="Description:"
                value={formObject.description}
              />
              <Input
                onChange={handleInputChange}
                name="location"
                placeholder="Location:"
                value={formObject.location}
              />
              <TextArea
                onChange={handleInputChange}
                name="itinerary"
                placeholder="Itinerary:"
                value={formObject.itinerary}
              />
              <label for="time" >Duration info</label>
              <NumberInput
                decrement={handleGroupDec}
                increment={handleGroupInc}
                name="time"
                value={formObject.time}
              />
              <Dropdown
                onChange={handleInputChange}
                name="unit"
                value={formObject.unit}
                options={["hours", "days", "weeks", "months", "eternity"]}
              />
              <label for="difficulty" >Difficulty</label>
              <Dropdown
                onChange={handleInputChange}
                name="difficulty"
                value={formObject.difficulty}
                options={["Easy", "Intermediate", "Hard", "Extreme", "Death wish"]}
              />
              <label for="minGroupSize" >Min Group Size</label>
              <NumberInput
                decrement={handleGroupDec}
                increment={handleGroupInc}
                name="minGroupSize"
                placeholder="Min. Group Size:"
                value={formObject.minGroupSize}
              />
              <label for="maxGroupSize" >Max Group Size</label>
              <NumberInput
                decrement={handleGroupDec}
                increment={handleGroupInc}
                name="maxGroupSize"
                value={Math.max(formObject.maxGroupSize, formObject.minGroupSize)}
              />
              <label for="price" >Price in $</label>
              <NumberInput
                decrement={handlePriceDec}
                increment={handlePriceInc}
                name="price"
                value={formObject.price}
              />
              <Input
                onChange={handleInputChange}
                name="gearList"
                placeholder="Gear Need:"
                value={formObject.gearList}
              />
              <TagRow edit={true} tags={tagArr} filterTags={handleFilterTags} />
              <Dropdown
                intro={'Edit tags for your adventure'}
                onChange={handleInputChange}
                name="tags"
                options={dropdownArr}
                value={dropdownValue}
              />
              <Input
                onChange={onSubmit}
                classes={"button adventure-image-upload"}
                name={"image"}
                type={"file"}
                text={"Update Image"}
              />
              <FormBtn
                onClick={handleFormSubmit}>
                Update Adventure
                </FormBtn>
              {/* close modal */}
              <Btn classes={"close-button"} handleClick={handleModalClose} aria-label={"Close modal"} type={"button"} text={<span aria-hidden="true">&times;</span>} />
            </form>
          </Cell>
        </Gridx>
      </div>
    </div>
  );
}


export default AdventureUpdate;