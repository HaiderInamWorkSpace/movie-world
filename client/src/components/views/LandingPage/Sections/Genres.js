import React from "react"
import { Dropdown, Selection } from 'react-dropdown-now';
import 'react-dropdown-now/style.css';

// normal usage
function Genres(props){

    
    return (
        <div>
        <Dropdown
        placeholder="Genre"
        className="my-className"
        options={[
            {label: 'Action' , value: 28}, 
            {label: 'Comedy' , value: 35}, 
            {label: 'Horror' , value: 27}, 
            {label: 'Romance' , value: 10749}, 
            {label: 'Mystery' , value: 9648}, 
            {label: 'Sci-Fi' , value: 878}, 
            {label: 'Western' , value: 37}, 
            {label: 'Animation' , value: 16}, 
            {label: 'TV Movie' , value: 10770}
            ]}
        value="one"
        onChange={(value) => console.log('change!', value)}
        // onSelect={(genre) => console.log('selected!', genre.value)} // always fires once a selection happens even if there is no change
        onSelect={(genre) => props.handleChange(genre.value)} // always fires once a selection happens even if there is no change
        onClose={(closedBySelection) => console.log('closedBySelection?:', closedBySelection)}
        onOpen={() => console.log('open!')}
        /></div>
    )
}

export default Genres