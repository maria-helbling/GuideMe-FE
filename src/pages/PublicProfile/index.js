//PROFILE page where user info is displayed, edited, deleted depending on host status
import React, { useState, useEffect } from 'react'
import './style.css'
import Wrapper from '../../components/Wrapper'
import Gridx from '../../components/Gridx'
import Cell from '../../components/Cell'
import TagRow from '../../components/TagRow'
import FlipCard from '../../components/FlipCard'
import API from '../../util/API'
import { useLocation } from 'react-router-dom'



function PublicProfile(props) {
    
    let location = useLocation()
    let userId = location.state.userId
    //state holds user data pulled from database
    const [userData, setUserData] = useState({})
    //state holds user's hosted adventures as pulled from database
    const [adventureData, setAdventureData] = useState([])
    // handling showing of tags
    const [tagArr, setTagArr] = useState([])
    //state to check for changes in data to call useEffect and reload data
    //set up page with data
    useEffect(() => {
        //user info
        loadUserData()
        //pull up hosted adventures
        loadUserAdventures(userId)
    }, [])

    //get the user data from database
    const loadUserData = async () => {
        const { data } = await API.getUserProfilebyId(userId);
        setUserData(data);
        setTagArr(data.tags.map(tag=>tag.tagName))
    }

    //get the adventures data from database
    const loadUserAdventures = async (id) => {
        const { data } = await API.getAdventurebyHost(id);
        if (data.length > 0) {
            setAdventureData(data)
        }
    }

    return (
        <>
            <Wrapper>
                <div className="grid-container full">
                    <Gridx classes={'hero-section'} >
                        <Cell size="small-12 bannerdiv">
                            {/* When user clicks on their profile banner picture, a modal is activated to that they can update it */}
                            <img className="bannerimage" src={userData.profileBannerUrl ? userData.profileBannerUrl : "https://images.pexels.com/photos/38136/pexels-photo-38136.jpeg?cs=srgb&dl=pexels-veeterzy-38136.jpg&fm=jpg"} alt={userData.firstName + " " + userData.lastName + "'s profile banner pic"}></img>
                        </Cell>
                    </Gridx>
                    <Gridx classes={'bannerName'}>
                        {/* User data section */}
                        <Cell size={"small-12 medium-6"}>
                            <img style={{height: '15vh',width: '15vh', borderRadius: '50%'}} src={userData.profilePictureUrl ? userData.profilePictureUrl : "https://images.pexels.com/photos/1761282/pexels-photo-1761282.jpeg?cs=srgb&dl=pexels-jake-colvin-1761282.jpg&fm=jpg"} alt={userData.firstName + " " + userData.lastName + "'s profile pic"} type="profilePic" />
                            <h2>{userData.firstName} {userData.lastName}</h2>
                            <p>{userData.location}</p>
                            <p>{userData.bio}</p>
                        </Cell>
                    </Gridx>

                    {(userData.host === false) ? null
                        : (
                            <>
                                <Gridx classes="grid-margin-x">
                                    <TagRow tags={tagArr} />
                                </Gridx>
                                <Gridx classes="Matthew-Stuff grid-margin-x grid-margin-y">
                                    {(adventureData) ? adventureData.map(adventure => (
                                        <Cell key={adventure._id} size={'medium-6 large-4'}>
                                            <FlipCard key={adventure._id} id={adventure._id} delete={false} edit={false} location={adventure.location} number={adventure.number} unit={adventure.unit} difficulty={adventure.difficulty} maxGroupSize={adventure.maxGroupSize} minGroupSize={adventure.minGroupSize} itinerary={adventure.itinerary} img={adventure.adventureImageUrl ? adventure.adventureImageUrl : "https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg?cs=srgb&dl=pexels-francesco-ungaro-1525041.jpg&fm=jpg"} title={adventure.adventureName} host={adventure.hostId.firstName + " " + adventure.hostId.lastName} description={adventure.description} />
                                        </Cell>
                                    )) : null}
                                </Gridx>
                            </>
                        )}
                    {/* END Display tags and adventures related to user, if the user is a host */}
                </div>
            </Wrapper>
        </>
    )
}

export default PublicProfile;