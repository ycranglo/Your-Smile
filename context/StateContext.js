 import { useState, createContext } from "react";

 //invoke adn export createContext component
 export const Statecontext = createContext()

 export const StateProvider = (props) => {
  //setting up the state
  const [camImage, setCamImage] = useState('')
   
   return (
    <Statecontext.Provider value={[camImage, setCamImage]}>
     {props.children}
    </Statecontext.Provider>
   )
  
 }