import { Children, createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextData{
    minutes : number;
    seconds: number; 
    hasFinished: boolean; 
    isActive: boolean 
    startCountDown: () => void;
    resetCountdown: () => void;
}

interface CountdownProviderProps{
    children: ReactNode;
}

let countdownTimeout: NodeJS.Timeout;
const timeSprint = 25;

export const CountdownContext = createContext( { } as CountdownContextData);

export function CountdownProvider( {children} : CountdownProviderProps){

    const { startNewChallenge } = useContext(ChallengesContext); 

    const [time, setTime] = useState(timeSprint * 60);
    const [isActive, setIsActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);
     
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    function startCountDown(){
        setIsActive(true);
    }

    function resetCountdown(){
        clearTimeout(countdownTimeout);
        setIsActive(false);
        setTime(timeSprint * 60);
        setHasFinished(false);
    }

    useEffect( () => {
        if(isActive && time > 0){
            countdownTimeout = setTimeout( () => {
                setTime(time - 1);
            }, 1000)
        }else if(isActive && time == 0){
            setHasFinished(true);
            setIsActive(false);
            startNewChallenge();
        }
    }, [isActive, time])


    return (
        <CountdownContext.Provider value={ { minutes, seconds, hasFinished , isActive, startCountDown, resetCountdown} }>
            {children}
        </CountdownContext.Provider>
    )
}