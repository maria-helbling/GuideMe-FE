//ADVENTURES this page diplays all adventures subject to search filters

import React, {useState, useEffect} from 'react'
import './style.css'
import Wrapper from '../../components/Wrapper'
import Gridx from '../../components/Gridx'
import Cell from '../../components/Cell'
import FlipCard from '../../components/FlipCard'
import API from '../../util/API'
import { useLocation } from 'react-router-dom'
import {stateLocation} from '../../components/StateLocations'

function Adventures(){
    //tags that show what was searched
    let location = useLocation()
    let tag = location.state.tag
    let stateName = location.state.stateName
    
    //list of relevant adventures
    const [adventures, setAdventures] = useState([])
    const [searchTerm, setSearchTerm] = useState(tag);
    const [searchTermState, setSearchTermState] = useState(stateName);
    const [tags, setTags] = useState([])
    
    
    //load adventures on page load
    useEffect(() => {
        loadAdventures(searchTerm, searchTermState)
    }, [searchTerm, searchTermState])

    
    //get all tags for dropdown
    useEffect(() => {
        API.getTags().then(res => setTags(res.data)).catch(err => console.log(err))
    }, [])
    
    //API call to adventures db
    //Filter adventures based on tags and/or states matching search criteria
    const loadAdventures = async (activity, state) => {
        const {data} = await API.getAllAdventures()
        let adventureArr = [...data]
        if (activity && activity !== 'Activity') {
            adventureArr=adventureArr.filter(adventure=> adventure.tags.map(tag=>tag=tag.tagName).indexOf(activity)>=0)
        }
        if (state && state !== 'Location') {
            adventureArr=adventureArr.filter(adventure=> adventure.stateLocation.indexOf(state)>=0)
        }
        setAdventures(adventureArr)
    }

    return (
        <>
            <Wrapper>
            <div className="calloutAdventures">
                        <h3>Filter adventures by:</h3>
                            {/* The search or host adventure form on home page */}
                            <div className="container searchBoxAdventures">
                                <select onChange={(e) => { setSearchTerm(e.target.value)}} value={searchTerm} className="findAdventureAdventure">
                                    <option>Activity</option>
                                    {tags ? tags.map(tag => <option key={tag._id} value={tag.tagName}>{tag.tagName}</option>) : null}
                                </select>
                                <select onChange={(e) => { setSearchTermState(e.target.value)}} value={searchTermState} className="findAdventureAdventure">
                                    <option>Location</option>
                                    {stateLocation ? stateLocation.map(state=> <option key={stateLocation.indexOf(state)} value={state}>{state}</option>) : null}
                                </select>
                            </div>
                        </div>

                <div className="grid-container full">
                    <Gridx classes={'grid-margin-x grid-margin-y'}>
                        {/* This puts the adventures on the page, see FlipCard for more info */}
                        {(adventures.length)? adventures.map(adventure => 
                        <Cell key={adventure.hostId + " " + adventure._id} size={'medium-6 large-4'}>
                            <FlipCard key={adventure._id} location={adventure.location} stateLocation={adventure.stateLocation} number={adventure.duration.time} unit={adventure.duration.unit} difficulty={adventure.difficulty} maxGroupSize={adventure.maxGroupSize} minGroupSize={adventure.minGroupSize} tags={adventure.tags.map(item=>item.tagName)} itinerary={adventure.itinerary} img={adventure.adventureImageUrl? adventure.adventureImageUrl : "https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg?cs=srgb&dl=pexels-francesco-ungaro-1525041.jpg&fm=jpg"} title={adventure.adventureName} host={adventure.hostId.firstName + " " + adventure.hostId.lastName} description={adventure.description} hostId = {adventure.hostId._id}/>
                        </Cell>
                            ) : <h3 style={{marginTop:"2vh"}}>I can't find any adventures meeting those search terms, please try again</h3>}
                    </Gridx>
                </div>
            </Wrapper>
        </>
    )
}

export default Adventures;



