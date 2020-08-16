//PROFILE page where user info is displayed, edited, deleted depending on host status
import React, {useState, useEffect} from 'react'
import {Redirect} from 'react-router-dom'
import './style.css'
import Wrapper from '../../components/Wrapper'
import Gridx from '../../components/Gridx'
import Cell from '../../components/Cell'
import TagRow from '../../components/TagRow'
import Btn from '../../components/Btn'
import FlipCard from '../../components/FlipCard'
import Adventure from '../../components/Adventure'
import AdventureUpdate from '../../components/AdventureUpdate'
import UserUpdate from '../../components/UserUpdate'
import API from '../../util/API'
import ImageForm from '../../components/ImageForm'
import Messages from '../../components/Messages'



function Profile (props) {
    //tells the TopBar what page to display at top
    const {handlePageChange}=props
    handlePageChange("Profile")
    //state holds user data pulled from database
    const [userData, setUserData] = useState({})
    //state holds user's hosted adventures as pulled from database
    const [adventureData, setAdventureData] = useState([])
    //state to check for changes in data
    const [change, setChange] = useState(false)
    //all the below states are boolean states to control modals opening and closong, when true, modal is visible, when false modal is hidden
    const [modalAdventure, setModalAdventure]= useState(false)
    const [modalAdventureUpdate, setModalAdventureUpdate]= useState({visible:false, id:''})
    const [modalUser, setModalUser]= useState(false)
    const [modalImage, setModalImage]= useState(false)
    //modal states end ================================================

    //set up page with data
    //TODO: look into this more, to see how to reload the info when a new adventure is created, an adventure is updated, userprofile is updated etc
    useEffect(() => {
        //user info
        loadUserData()
        //get user id from session data to pull up hosted adventures
        //TODO:check if host first and then pull up adventures? useEffect for that?
        API.getSessionData().then(res => {
            let id = res.data.id
            //pull up hosted adventures
            loadUserAdventures(id)
        }).catch(err => console.log(err))
    }, [change])

    //get the user data from database
    const loadUserData = async () => {
        const {data} = await API.getUserbyId();
        if (data.host) {props.setHostState()} 
        setUserData(data);
    }

    //get the advetures data from database
    const loadUserAdventures = async (id)=>{
        const {data} = await API.getAdventurebyHost(id);
        if (data.length>0){
            
            console.log(data)
            setAdventureData(data)
        }
    }
    
    //delete this user account
    const handleDeleteUser = () => {
        API.deleteUser().then(()=>{
            props.setLoginState()
            props.setHostState()
            setChange(!change)
            return <Redirect to='/'/>
        }).catch(err => console.log(err))
    }
    
    //delete the adventure -- this method is passed into the FlipCard component because the delete button lives on the FlipCard
    const handleDeleteAdventure = (e) => {
        e.stopPropagation()
        let id = e.target.getAttribute('data-id')
        API.deleteAdventure(id).then(()=>setChange(!change)).catch(err=>console.log(err))
    }
    
    //become host button just currently updates status on database,this is what happens here
    //TODO:reload page when this change happens to check for adventures and tags
    const handleBecomeHost= () => {
        props.setHostState()
        let hostObj = {host:true, verified:true}
        API.updateUser(hostObj).then(()=>setChange(!change)).catch(err=>console.log(err))
    }

    //start of modals section ============================================================
    //methods to open all the various modals
    const handleCreateAdventureClick = () => {
        //create adventure modal open
        setModalAdventure(true);
    }
    const handleUpdateAdventureClick = (e) => {
        //update adventuer modal open -- this method is passed into the FlipCard since the update adventure btn lives there
        let id = e.target.getAttribute('data-id')
        //this state includes the adventure id of the adventure whoes FLipCard was clicked to know which adventure we are updating
        setModalAdventureUpdate({visible:true, id:id});   
    }
    const handleUpdateUserClick = () => {
        //update user info modal open
        setModalUser(true);
    }
    const handleUpdateImageClick = () => {
        //update image modal open
        setModalImage(true);
    }
    //methods to close the various modals
    const  handleModalAdventureClose = () => {
        //create adventure modal close
    setModalAdventure(false)
    setChange(!change)
    }
    const  handleModalAdventureUpdateClose = () => {
        //update adventure modal close
    setModalAdventureUpdate({...modalAdventureUpdate, visible:false})
    setChange(!change)
    }
    const  handleModalUserClose = () => {
        //update user modal close
    setModalUser(false)
    setChange(!change)
    }
    const  handleModalImageClose = () => {
        //update image modal close
    setModalImage(false)
    setChange(!change)
    }
    //end of modals section =============================================================
    

    return(
        <>
        <Wrapper>
            <div className="grid-container full">
                <Messages />
                <Gridx classes={'hero-section'}>
                    <Cell size={'hero-section-text'}>
                        <h2 className="text-center">{userData.firstName} {userData.lastName}</h2>
                    </Cell>
                </Gridx>
                <Gridx>
                    {/* User data section */}
                    <Cell size={"small-6 medium-4"}>
                        <img id="profilePic" onClick={handleUpdateImageClick} src={userData.profilePictureUrl} alt={userData.firstName + " " + userData.lastName} />
                    </Cell>
                    <Cell size={"small-6 medium-8"}>
                        <p>{userData.bio}</p>
                    </Cell>
                    <Cell size={""}>
                        <p>{userData.location}</p>
                    </Cell>
                </Gridx>
                
                {/* Image update modal ============================== */}
                <ImageForm show={modalImage}  handleModalClose={handleModalImageClose}/>
                {/* END Image update modal ============================== */}

                {/* Display tags and adventures related to user, if the user is a host */}
                {(userData.host=== false) ? null 
                :(
                    <>
                <Gridx classes="grid-margin-x">
                    <TagRow tags={userData.tags}/>
                </Gridx>
                <Gridx classes="grid-margin-x">
                    {(adventureData)? adventureData.map(adventure => (
                        <Cell key={adventure._id} size={'medium-6 large-4'}>
                            <FlipCard key={adventure._id} id={adventure._id} delete={true} deleteClick={handleDeleteAdventure} edit={true} editClick={handleUpdateAdventureClick} location={adventure.location} number={adventure.number} unit={adventure.unit} difficulty={adventure.difficulty} maxGroupSize={adventure.maxGroupSize} minGroupSize={adventure.minGroupSize} itinerary={adventure.itinerary} img={"https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg?cs=srgb&dl=pexels-francesco-ungaro-1525041.jpg&fm=jpg"} title={adventure.adventureName} host={adventure.hostId.firstName + " " + adventure.hostId.lastName} description={adventure.description}/>
                        </Cell>
                    )) : null}
                </Gridx>
                </>
                )}
                {/* END Display tags and adventures related to user, if the user is a host */}

                {/* CRUD buttons for user and adventure, all except delete btn, open a modal */}
                <Gridx classes={''}>
                    {props.host ? 
                    <Cell size={'medium-4'}>
                        <Btn classes={'button'} handleClick={handleCreateAdventureClick} text={'Create an adventure'}/>
                    </Cell>
                    :
                    <Cell size={'medium-4'}>
                        <Btn classes={'button'} handleClick={handleBecomeHost} text={'Become a guide'}/>
                    </Cell>
                    }
                    <Cell size={'medium-4'}>
                        <Btn classes={'button'} handleClick={handleUpdateUserClick} text={'Update my data'}/>
                    </Cell>
                    <Cell size={'medium-4'}>
                        {/* TODO:create a modal that asks "are you sure?" for the delete account button */}
                        <Btn classes={'alert button'} handleClick={handleDeleteUser} text={'Delete my account'}/>
                    </Cell>
                </Gridx>
                {/* END CRUD buttons for user and adventure */}

                {/* Modals live here */}
                <Adventure show={modalAdventure} handleModalClose={handleModalAdventureClose}/>
                <UserUpdate show={modalUser} handleModalClose={handleModalUserClose}/>
                <AdventureUpdate show={modalAdventureUpdate.visible} handleModalClose={handleModalAdventureUpdateClose} id={modalAdventureUpdate.id}/>
                {/* END Modals live here */}

            </div>
        </Wrapper>
        </>
    )    
}

export default Profile