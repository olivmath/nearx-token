import React, { useState, useEffect } from 'react';
import { getRandomQuestions } from '../data/questions';
import { useAuth } from '../contexts/AuthContext';
import './Quiz.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const { user, logout } = useAuth();

  const startQuiz = () => {
    const randomQuestions = getRandomQuestions(5);
    setQuestions(randomQuestions);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setQuizStarted(true);
    setAnswers([]);
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    const newAnswers = [...answers, {
      question: questions[currentQuestion].question,
      selected: selectedAnswer,
      correct: questions[currentQuestion].correct,
      isCorrect
    }];
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setShowResult(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnswers([]);
  };

  const getScoreMessage = () => {
    const percentage = (score / 5) * 100;
    if (percentage >= 80) return { message: "🏆 Excelente! Você é um expert em blockchain!", class: "excellent" };
    if (percentage >= 60) return { message: "👍 Muito bom! Você tem um bom conhecimento sobre blockchain.", class: "good" };
    if (percentage >= 40) return { message: "📚 Razoável. Continue estudando sobre blockchain!", class: "average" };
    return { message: "💪 Precisa estudar mais. Não desista, blockchain é fascinante!", class: "poor" };
  };

  if (!quizStarted) {
    return (
      <div className="quiz-container">
        <div className="quiz-welcome">
          <div className="user-info">
            <h2>Bem-vindo, {user?.name || 'Usuário'}! 👋</h2>
            <button onClick={logout} className="logout-btn">Sair</button>
          </div>
          
          <div className="welcome-content">
            <h1>🧠 Quiz Blockchain</h1>
            <p>Teste seus conhecimentos sobre blockchain com 5 perguntas selecionadas aleatoriamente!</p>
            
            <div className="quiz-info">
              <div className="info-card">
                <span className="icon">❓</span>
                <div>
                  <h3>5 Perguntas</h3>
                  <p>Selecionadas aleatoriamente de um banco de 25 questões</p>
                </div>
              </div>
              <div className="info-card">
                <span className="icon">⏱️</span>
                <div>
                  <h3>Sem Limite de Tempo</h3>
                  <p>Responda no seu próprio ritmo</p>
                </div>
              </div>
              <div className="info-card">
                <span className="icon">🏆</span>
                <div>
                  <h3>Pontuação Final</h3>
                  <p>Veja seu desempenho ao final</p>
                </div>
              </div>
            </div>
            
            <button onClick={startQuiz} className="start-quiz-btn">
              🚀 Começar Quiz
            </button>
            
            <div className="stellar-link">
              <p>Explore mais sobre blockchain:</p>
              <a
                href="https://stellarexplorer.io"
                target="_blank"
                rel="noopener noreferrer"
                className="stellar-button"
              >
                🌟 Stellar Explorer
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const scoreInfo = getScoreMessage();
    return (
      <div className="quiz-container">
        <div className="quiz-result">
          <div className="result-header">
            <h1>🎯 Resultado Final</h1>
            <div className={`score-display ${scoreInfo.class}`}>
              <span className="score-number">{score}/5</span>
              <span className="score-percentage">({((score / 5) * 100).toFixed(0)}%)</span>
            </div>
            <p className={`score-message ${scoreInfo.class}`}>{scoreInfo.message}</p>
          </div>

          <div className="answers-review">
            <h3>📋 Revisão das Respostas</h3>
            {answers.map((answer, index) => (
              <div key={index} className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="question-number">Pergunta {index + 1}</div>
                <div className="question-text">{answer.question}</div>
                <div className="answer-status">
                  {answer.isCorrect ? (
                    <span className="correct-badge">✅ Correto</span>
                  ) : (
                    <span className="incorrect-badge">❌ Incorreto</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="result-actions">
            <button onClick={resetQuiz} className="try-again-btn">
              🔄 Tentar Novamente
            </button>
            <button onClick={logout} className="logout-btn">
              👋 Sair
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <div className="progress-info">
            <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
            <span>Pontuação: {score}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="question-section">
          <h2 className="question-text">{currentQ?.question}</h2>
          
          <div className="options-list">
            {currentQ?.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${
                  selectedAnswer === index ? 'selected' : ''
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="quiz-actions">
          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className="next-btn"
          >
            {currentQuestion + 1 === questions.length ? '🏁 Finalizar' : '➡️ Próxima'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;