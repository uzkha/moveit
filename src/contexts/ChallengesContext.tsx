import {createContext, useState, ReactNode, useEffect} from 'react';
import challenges from '../../challenges.json';
import Cookies from 'js-cookie';
import { LevelUpModal } from '../components/LevelUpModal';

interface Challenge{
    type: 'body' | 'eye';
    description: string;
    amount: number;
}

interface ChallengesContextData{
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    activeChalllenge: Challenge;
    experienceToNextLevel: number;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    completeChallenge: () => void;
    closeLevelUpModal: () => void;
}

interface ChallengeProviderProps{
    children: ReactNode;
    level: number
    currentExperience: number
    challengesCompleted: number
}

  

export const ChallengesContext = createContext( {} as ChallengesContextData);


export function ChallengeProvider( {children, ...rest}: ChallengeProviderProps ){

    const [level, setLevel] = useState(rest.level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);
    
    const [activeChalllenge, setActiveChallenge] = useState(null);
    const [isLevelUpModalOpen, SetIsLevelUpModalOpen] = useState(false);

    const experienceToNextLevel = Math.pow( (level + 1) * 4, 2 ); //calculo rpg ne

    useEffect( () => {
        Notification.requestPermission();
    }, [] ); //segundo parametro array vazio, vai ser executado uma unica vez
    
    useEffect( () => {
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', currentExperience.toString());
        Cookies.set('challengesCompleted', challengesCompleted.toString());

    },  [level, currentExperience, challengesCompleted] );
    
    function levelUp(){
        setLevel(level + 1);
        SetIsLevelUpModalOpen(true);
    }


    function closeLevelUpModal(){
        SetIsLevelUpModalOpen(false);
    }

    function startNewChallenge(){
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge);

        new Audio('/notification.mp3').play();

        if(Notification.permission === 'granted' ){
            new Notification('Novo desafio', {
                body: `Valendo ${challenge.amount}xp!`
            })
        }

    }

    function resetChallenge(){
        setActiveChallenge(null);
    }

    function completeChallenge(){
        if(!activeChalllenge){
            return;
        }

        const {amount} = activeChalllenge;

        //let e nao const, let it change, let pode ser alterada
        let finalExperience = currentExperience + amount;

        if(finalExperience >= experienceToNextLevel){
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1 );

    }

    return (

    <ChallengesContext.Provider value={ {level, levelUp, currentExperience, challengesCompleted, 
                                         startNewChallenge, activeChalllenge, resetChallenge,
                                         experienceToNextLevel, completeChallenge, closeLevelUpModal}}>
        {children}
        { isLevelUpModalOpen && <LevelUpModal />}
        
           
    </ChallengesContext.Provider>

    );
}