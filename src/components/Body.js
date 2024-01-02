
import React, { useState, useEffect } from 'react';
import '../App.css';
const Body = () => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timer, setTimer] = useState(5); 
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch('https://opentdb.com/api.php?amount=10');
        const data = await response.json();
        setQuestions(
          data.results.map((question, index) => ({
            id: index,
            question: question.question,
            correct_answer: question.correct_answer,
            options: [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5),
          }))
        );
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }
    fetchQuestions();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        clearInterval(interval);
        handleNextQuestion();
      }
    }, 1000); 

    return () => clearInterval(interval);
  }, [timer]);

  const handleSelectAnswer = (selectedAnswer) => {
    setUserAnswers({ ...userAnswers, [currentQuestion]: selectedAnswer });
    clearInterval(timer);
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimer(5); 
    } else {
      const userScore = calculateScore();
      setScore(userScore);
      setQuizCompleted(true);
      setCurrentQuestion(-1); 
    }
  };

  const handleSkipQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimer(5);
    } else {
      handleNextQuestion();
    }
  };

  const calculateScore = () => {
    let userScore = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correct_answer) {
        userScore++;
      }
    });
    return userScore;
  };

  const handleRetakeQuiz = () => {
    setQuizCompleted(false);
    setUserAnswers({});
    setScore(0);
    setCurrentQuestion(0);
  };

  return (
   
    <div className='quizContainer'>
      {questions.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <>
          {quizCompleted ? (
            <div className='resultContainer'>
              <p className='score'>Your final score is: {score}</p>
              <button className='retake' onClick={handleRetakeQuiz}>Retake Quiz</button>
            </div>
          ) : (
            <div className='questionContainer' key={currentQuestion}>
              <h3>Question {currentQuestion + 1}</h3>
              <p>{questions[currentQuestion].question}</p>
              <p className='leftTime'>Time left: {timer} seconds</p>
               <div className="options-container"> 
                {questions[currentQuestion].options.map((option, i) => (
                  <button
                    key={i}
                    className="option-button" 
                    onClick={() => handleSelectAnswer(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button className='skip' onClick={handleSkipQuestion}>Skip</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Body;

