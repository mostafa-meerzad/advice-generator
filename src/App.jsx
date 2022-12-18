import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import desktopImg from "./assets/pattern-divider-desktop.svg";

import mobileImg from "./assets/pattern-divider-mobile.svg";
import Dice from "./Dice";
// color for hover effect
const neonGreen = "hsl(150, 100%, 66%)";

function App() {
  const [adviceId, setAdviceId] = useState(0);
  const [advice, setAdvice] = useState("");
  const [isTextAnimating, setIsTextAnimating] = useState(true);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rotate, setRotate] = useState(0);
  const getAdvice = () => {
    setIsTextAnimating(false);
    setIsLoading(true);

    fetch("https://api.adviceslip.com/advice")
      .then((res) => res.json())
      .then(({ slip: { id, advice } }) => {
        setAdvice("”" + advice + "“");
        setAdviceId(id);
        setIsTextAnimating(true);
        setIsLoading(false);
      })
      .catch(() => {
        setError(true);
        setIsTextAnimating(true);
        setIsLoading(false);
      });
  };

  const sentenceVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03, ease: "easeIn" }
    }
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      scale: 0
    },
    visible: {
      opacity: 1,
      scale: 1
    }
  };

  useEffect(() => {
    getAdvice();
  }, []);

  return (
    <main className="advice">
      <h1 className="advice__id">Advice #{adviceId}</h1>
      <motion.p
        className="advice__text"
        variants={sentenceVariants}
        initial="hidden"
        animate={isTextAnimating ? "visible" : {}}
      >
        {error
          ? "An error occurred".split("").map((letter, index) => {
              return (
                <motion.span variants={letterVariants} key={index}>
                  {letter}
                </motion.span>
              );
            })
          : advice.split("").map((letter, index) => {
              return (
                <motion.span variants={letterVariants} key={index}>
                  {letter}
                </motion.span>
              );
            })}
      </motion.p>

      <picture className="advice__divider">
        <source srcSet={mobileImg} media="(min-width:375px)" />
        <source srcSet={desktopImg} media="(min-width:1440px)" />
        <img src={mobileImg} alt="" />
      </picture>
      <motion.button
        onClick={() => {
          getAdvice();
          setIsLoading(!isLoading);
          setRotate(rotate + 180);
        }}
        whileHover={{
          boxShadow: `0 0 30px ${neonGreen}`,
          transition: { duration: 0.01 }
        }}
        className="advice__btn"
        initial={null}
        animate={{
          rotate: rotate,
          transition: { duration: 0.6, ease: "backInOut" }
        }}
        data-loading={isLoading ? "loading" : ""}
        whileTap={{ scale: 0.9, transition: { duration: 0, ease: "linear" } }}
      >
        {<Dice />}
      </motion.button>
    </main>
  );
}

export default App;
