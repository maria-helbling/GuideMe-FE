import React, { useState } from "react";
import API from "../../util/API";
import { Input, TextArea, FormBtn } from "../Form";
import Cell from '../Cell'
import Gridx from '../Gridx'
import Btn from '../Btn'
import './style.css'


function AdventureUpdate(props) {
  // Setting our component's initial state
  let showHideModal = props.show ? 'reveal d-block' : 'reveal d-none'
  // update the initial state to provide values for
  // the controls in the form (use empty strings)
  const handleModalClose = () => {
    props.handleModalClose()
  }

  const [formObject, setFormObject] = useState({ 
    tags: '' })



  function handleInputChange(event) {
    // add code to control the components here
    let name = event.target.name
    let value
    if (name==="minGroupSize" || name==="maxGroupSize" || name==="price" ){
      value = parseInt(event.target.value)
    } else {
      value=event.target.value
    }
    setFormObject({ ...formObject, [name]: value })
  }

  async function handleFormSubmit(event) {
    // add code here to post a new adventure to the api
    event.preventDefault();

    let postObj = {...formObject}
    // if (postObj.tags.lenght) {postObj.tags=postObj.tags.split(', ')}
    console.log(postObj)
    API.updateAdventure(postObj, props.id)
      .then(data => {
        alert('Adventure updated!')
        setFormObject({ 
          adventureName: '', 
          description: '', 
          location: '', 
          itinerary: '',  
          difficulty: '', 
          minGroupSize: '', 
          maxGroupSize: '', 
          price: '', 
          gearList: '', 
          tags: '' })
          handleModalClose();
      }).catch(err=> console.log(err))
  }

  // function deleteAdventure(id) {
  // add code here to remove a adventures using API
  //  API.deleteAdventure(id)
  //   .then(data => {
  //     loadAdventures();
  //     setFormObject({adventureName: '', hostId: '', usersOnAdventure: '[]', description: '', location: '', itinerary: '', duration: '', difficulty: '', minGroupSize: '', maxGroupSize: '', price: '', gearList: '', tags: ''})
  //   })
  // }

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
            {/* <Input
              onChange={handleInputChange}
              name="duration"
              placeholder="Duration:"
              value={formObject.duration}
            /> */}
            <Input
              onChange={handleInputChange}
              name="difficulty"
              placeholder="Difficulty:"
              value={formObject.difficulty}
            />
            <Input
              onChange={handleInputChange}
              name="minGroupSize"
              placeholder="Min. Group Size:"
              value={formObject.minGroupSize}
            />
            <Input
              onChange={handleInputChange}
              name="maxGroupSize"
              placeholder="Max. Group Size:"
              value={formObject.maxGroupSize}
            />
            <Input
              onChange={handleInputChange}
              name="price"
              placeholder="Price:"
              value={formObject.price}
            />
            <Input
              onChange={handleInputChange}
              name="gearList"
              placeholder="Gear Need:"
              value={formObject.gearList}
            />
            <Input
              onChange={handleInputChange}
              name="tags"
              placeholder="Tags:"
              value={formObject.tags}
            />
            <FormBtn
              onClick={handleFormSubmit}>
                Update Adventure
                </FormBtn>
                <Btn classes={"close-button"} handleClick={handleModalClose} aria-label={"Close modal"} type={"button"} text={<span aria-hidden="true">&times;</span>}/>
          </form>
        </Cell>
      </Gridx>
    </div>
    </div>
  );
}


export default AdventureUpdate;