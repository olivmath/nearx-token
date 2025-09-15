import React, { useState } from 'react'
import useAuthStore from '../store/authStore'
import useQuizStore from '../store/quizStore'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'

const Quiz = () => {
  const { user, logout } = useAuthStore()
  const {
    currentQuestions,
    currentQuestionIndex,
    score,
    answers,
    isQuizStarted,
    isQuizCompleted,
    startQuiz,
    answerQuestion,
    resetQuiz,
    getCurrentQuestion
  } = useQuizStore()
  
  const [selectedAnswer, setSelectedAnswer] = useState('')

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer) {
      answerQuestion(selectedAnswer)
      setSelectedAnswer('')
    }
  }

  const handleResetQuiz = () => {
    resetQuiz()
    setSelectedAnswer('')
  }



  if (!isQuizStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary to-accent p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">🧠 Blockchain Quiz</CardTitle>
            <CardDescription>Bem-vindo, <strong>{user?.username}</strong>!</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground">
              Teste seus conhecimentos sobre blockchain com 5 perguntas selecionadas aleatoriamente.
            </p>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-accent border border-border rounded-lg">
                <span className="text-2xl">📊</span>
                <span className="text-sm font-medium">5 perguntas aleatórias</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-accent border border-border rounded-lg">
                <span className="text-2xl">⏱️</span>
                <span className="text-sm font-medium">Sem limite de tempo</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-accent border border-border rounded-lg">
                <span className="text-2xl">🏆</span>
                <span className="text-sm font-medium">Pontuação no final</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-3">
            <Button onClick={startQuiz} className="w-full">
              🚀 Começar Quiz
            </Button>
            <Button onClick={logout} variant="outline" className="w-full">
              🚪 Sair
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (isQuizCompleted) {
    const percentage = Math.round((score / currentQuestions.length) * 100)
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary to-accent p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">🎯 Resultado do Quiz</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-primary text-primary-foreground rounded-full text-4xl font-bold mb-4">
                {score}/{currentQuestions.length}
              </div>
              <p className="text-2xl font-semibold">{percentage}%</p>
            </div>
            
            <div className="text-center">
              {percentage >= 80 && <p className="text-primary font-semibold">🌟 Excelente! Você domina blockchain!</p>}
              {percentage >= 60 && percentage < 80 && <p className="text-primary font-semibold">👍 Bom trabalho! Continue estudando!</p>}
              {percentage >= 40 && percentage < 60 && <p className="text-muted-foreground font-semibold">📚 Você está no caminho certo!</p>}
              {percentage < 40 && <p className="text-destructive font-semibold">💪 Continue estudando blockchain!</p>}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">📋 Revisão das Respostas</h3>
              {answers.map((answer, index) => (
                <div key={index} className={`p-4 rounded-lg border-2 ${
                  answer.isCorrect ? 'bg-accent border-primary/30' : 'bg-accent border-destructive/30'
                }`}>
                  <p className="font-medium mb-2"><strong>Q{index + 1}:</strong> {answer.question}</p>
                  <p className="text-sm mb-1">
                    <span className="font-medium">Sua resposta:</span> {answer.selectedAnswer}
                    {answer.isCorrect ? ' ✅' : ' ❌'}
                  </p>
                  {!answer.isCorrect && (
                    <p className="text-sm text-primary font-medium">
                      <span className="font-medium">Resposta correta:</span> {answer.correctAnswer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-3">
            <div className="flex space-x-3 w-full">
              <Button onClick={handleResetQuiz} className="flex-1">
                🔄 Fazer Novo Quiz
              </Button>
              <Button onClick={logout} variant="outline" className="flex-1">
                🚪 Sair
              </Button>
            </div>
            <a 
              href="https://stellar.expert" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
              🌟 Explore Stellar Network
            </a>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const currentQuestion = getCurrentQuestion()
  
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary to-accent p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">
              Pergunta {currentQuestionIndex + 1} de {currentQuestions.length}
            </span>
            <span className="text-sm font-medium">Pontuação: {score}</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
            ></div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === option ? "default" : "outline"}
                className="w-full justify-start text-left h-auto p-4"
                onClick={() => handleAnswerSelect(option)}
              >
                <span className="font-bold mr-3">{String.fromCharCode(65 + index)}</span>
                <span>{option}</span>
              </Button>
            ))}
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={handleNextQuestion} 
            disabled={!selectedAnswer}
            className="w-full"
          >
            {currentQuestionIndex === currentQuestions.length - 1 ? '🏁 Finalizar' : '➡️ Próxima'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
};

export default Quiz;