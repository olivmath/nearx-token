import { create } from 'zustand'
import { blockchainQuestions as questions } from '../data/questions'

const useQuizStore = create((set, get) => ({
  currentQuestions: [],
  currentQuestionIndex: 0,
  score: 0,
  answers: [],
  isQuizStarted: false,
  isQuizCompleted: false,
  
  startQuiz: () => {
    // Selecionar 5 perguntas aleatórias
    const shuffled = [...questions].sort(() => 0.5 - Math.random())
    const selectedQuestions = shuffled.slice(0, 5)
    
    set({
      currentQuestions: selectedQuestions,
      currentQuestionIndex: 0,
      score: 0,
      answers: [],
      isQuizStarted: true,
      isQuizCompleted: false
    })
  },
  
  answerQuestion: (selectedAnswer) => {
    const { currentQuestions, currentQuestionIndex, answers } = get()
    const currentQuestion = currentQuestions[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion.correct
    
    const newAnswers = [...answers, {
      question: currentQuestion.question,
      selectedAnswer,
      correctAnswer: currentQuestion.correct,
      isCorrect
    }]
    
    const newScore = get().score + (isCorrect ? 1 : 0)
    
    set({
      answers: newAnswers,
      score: newScore
    })
    
    // Verificar se é a última pergunta
    if (currentQuestionIndex === currentQuestions.length - 1) {
      set({ isQuizCompleted: true })
    } else {
      set({ currentQuestionIndex: currentQuestionIndex + 1 })
    }
  },
  
  resetQuiz: () => {
    set({
      currentQuestions: [],
      currentQuestionIndex: 0,
      score: 0,
      answers: [],
      isQuizStarted: false,
      isQuizCompleted: false
    })
  },
  
  getCurrentQuestion: () => {
    const { currentQuestions, currentQuestionIndex } = get()
    return currentQuestions[currentQuestionIndex]
  }
}))

export default useQuizStore