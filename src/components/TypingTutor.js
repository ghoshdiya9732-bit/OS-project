import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, Clock, Target, Award, RotateCcw, Play } from 'lucide-react';

const TypingTutor = () => {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errors, setErrors] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const inputRef = useRef(null);

  const lessons = [
    {
      title: "Basic OS Terms",
      text: "CPU scheduling determines which process gets the CPU time. The scheduler decides the order of execution.",
      difficulty: "Easy"
    },
    {
      title: "FCFS Algorithm",
      text: "First Come First Serve executes processes in arrival order. It is simple but can cause long waiting times.",
      difficulty: "Easy"
    },
    {
      title: "SJF Algorithm", 
      text: "Shortest Job First prioritizes processes with minimum burst time. It minimizes average waiting time.",
      difficulty: "Medium"
    },
    {
      title: "Round Robin",
      text: "Round Robin uses time slicing. Each process gets a fixed time quantum before switching to the next process.",
      difficulty: "Medium"
    },
    {
      title: "Priority Scheduling",
      text: "Priority scheduling assigns priorities to processes. Higher priority processes execute before lower priority ones.",
      difficulty: "Medium"
    },
    {
      title: "Advanced Concepts",
      text: "Context switching saves current process state and loads another process. Preemptive scheduling can interrupt processes.",
      difficulty: "Hard"
    }
  ];

  const currentLessonData = lessons[currentLesson];

  useEffect(() => {
    if (userInput.length === 0 && !isTyping) {
      inputRef.current?.focus();
    }
  }, [userInput, isTyping]);

  const startTyping = () => {
    setStartTime(Date.now());
    setIsTyping(true);
    setIsCompleted(false);
    setErrors(0);
    setCurrentCharIndex(0);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    
    if (!isTyping && value.length > 0) {
      startTyping();
    }

    if (value.length <= currentLessonData.text.length) {
      setUserInput(value);
      setCurrentCharIndex(value.length);

      // Check for errors
      let errorCount = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i] !== currentLessonData.text[i]) {
          errorCount++;
        }
      }
      setErrors(errorCount);

      // Check if completed
      if (value.length === currentLessonData.text.length) {
        setEndTime(Date.now());
        setIsCompleted(true);
        setIsTyping(false);
      }
    }
  };

  const resetLesson = () => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setIsTyping(false);
    setIsCompleted(false);
    setErrors(0);
    setCurrentCharIndex(0);
  };

  const nextLesson = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
      resetLesson();
    }
  };

  const prevLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
      resetLesson();
    }
  };

  const calculateStats = () => {
    if (!startTime || !endTime) return { wpm: 0, accuracy: 0, time: 0 };

    const timeInMinutes = (endTime - startTime) / 60000;
    const wordsTyped = userInput.trim().split(' ').length;
    const wpm = Math.round(wordsTyped / timeInMinutes);
    const accuracy = Math.round(((userInput.length - errors) / userInput.length) * 100);
    const time = Math.round((endTime - startTime) / 1000);

    return { wpm, accuracy, time };
  };

  const stats = calculateStats();

  const renderText = () => {
    return currentLessonData.text.split('').map((char, index) => {
      let className = 'text-lg font-mono ';
      
      if (index < userInput.length) {
        if (userInput[index] === char) {
          className += 'text-green-600 dark:text-green-400';
        } else {
          className += 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
        }
      } else if (index === userInput.length) {
        className += 'bg-blue-500 text-white animate-pulse';
      } else {
        className += 'text-gray-600 dark:text-gray-400';
      }

      return <span key={index} className={className}>{char}</span>;
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 dark:text-green-400';
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'Hard': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Keyboard className="w-6 h-6 mr-2" />
          Typing Tutor
        </h2>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${getDifficultyColor(currentLessonData.difficulty)}`}>
            {currentLessonData.difficulty}
          </span>
        </div>
      </div>

      {/* Lesson Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevLesson}
          disabled={currentLesson === 0}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 text-sm font-medium"
        >
          Previous
        </button>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentLessonData.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Lesson {currentLesson + 1} of {lessons.length}
          </p>
        </div>
        <button
          onClick={nextLesson}
          disabled={currentLesson === lessons.length - 1}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 text-sm font-medium"
        >
          Next
        </button>
      </div>

      {/* Stats Panel */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-1" />
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">WPM</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.wpm}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Award className="w-4 h-4 text-green-600 dark:text-green-400 mr-1" />
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.accuracy}%</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-1" />
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Time</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.time}s</p>
        </div>
      </div>

      {/* Typing Area */}
      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mb-4">
        <div className="mb-4 leading-relaxed">
          {renderText()}
        </div>
        
        <textarea
          ref={inputRef}
          value={userInput}
          onChange={handleInputChange}
          placeholder="Click here and start typing..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
          rows={3}
          disabled={isCompleted}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        {!isTyping && !isCompleted && userInput.length === 0 && (
          <button
            onClick={startTyping}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Start Typing</span>
          </button>
        )}
        
        {isTyping && (
          <button
            onClick={resetLesson}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        )}
        
        {isCompleted && (
          <div className="flex-1 flex space-x-3">
            <button
              onClick={resetLesson}
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            {currentLesson < lessons.length - 1 && (
              <button
                onClick={nextLesson}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700"
              >
                Next Lesson
              </button>
            )}
          </div>
        )}
      </div>

      {/* Completion Message */}
      {isCompleted && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h4 className="text-green-900 dark:text-green-100 font-semibold mb-2">Lesson Completed! 🎉</h4>
          <div className="text-sm text-green-700 dark:text-green-300">
            <p>Speed: {stats.wpm} WPM</p>
            <p>Accuracy: {stats.accuracy}%</p>
            <p>Errors: {errors}</p>
            <p>Time: {stats.time} seconds</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypingTutor;
