
import { CompletedChallenges } from "../components/CompletedChallenges";
import { Countdown } from "../components/Countdown";
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from "../components/Profile";
import styles from '../styles/pages/Home.module.css';
import Head from 'next/head';
import { ChallengeBox } from "../components/ChallengeBox";
import { CountdownProvider } from "../contexts/CountdownContext";
import { GetServerSideProps } from 'next';
import { ChallengeProvider } from "../contexts/ChallengesContext";

interface HomeProps{
  level: number
  currentExperience: number
  challengesCompleted: number
}

export default function Home(props) {
  return (
    <ChallengeProvider level={props.level} currentExperience={props.currentExperience} challengesCompleted={props.challengesCompleted}>    
      <div className={styles.container}>
        
        <Head>
          <title>Inicio | move.it</title>
        </Head>

        <ExperienceBar />
        <CountdownProvider>
          <section>
            <div>
              <Profile />
              <CompletedChallenges />
              <Countdown />
            </div>
            <div>
              <ChallengeBox />
            </div>
          </section>
        </CountdownProvider>
      </div>    
    </ChallengeProvider>
  );
}


//next vai rodar antes de construir a tela, antes da function home
//executa na camada next, que roda um server node intermediario ao react
export const getServerSideProps: GetServerSideProps = async (ctx) => {

    const {level, currentExperience, challengesCompleted} = ctx.req.cookies;
      
    return {
        props: {
          level: Number(level),
          currentExperience: Number(currentExperience), 
          challengesCompleted: Number(challengesCompleted)
        }
    }
}

