import React, { useState, useEffect, useRef } from 'react';
import { Zap, Clock, Trophy, Target, Play, RotateCcw } from 'lucide-react';

const TypingGame = () => {
  const [gameState, setGameState] = useState('idle'); // idle, playing, completed
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentWord, setCurrentWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [typedWords, setTypedWords] = useState([]);
  const [errors, setErrors] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const schedulingWords = [
    'process', 'cpu', 'schedule', 'algorithm', 'fcfs', 'sjf', 'priority',
    'quantum', 'burst', 'arrival', 'waiting', 'turnaround', 'context',
    'switching', 'preemptive', 'nonpreemptive', 'queue', 'ready', 'running',
    'terminated', 'dispatcher', 'latency', 'throughput', 'utilization',
    'gantt', 'chart', 'time', 'slice', 'roundrobin', 'starvation', 'aging'
  ];

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, gameState]);

  useEffect(() => {
    generateNewWord();
  }, []);

  const generateNewWord = () => {
    const randomWord = schedulingWords[Math.floor(Math.random() * schedulingWords.length)];
    setCurrentWord(randomWord);
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(60);
    setTypedWords([]);
    setErrors(0);
    setUserInput('');
    generateNewWord();
    inputRef.current?.focus();
  };

  const endGame = () => {
    setGameState('completed');
    if (score > highScore) {
      setHighScore(score);
    }
  };

  const resetGame = () => {
    setGameState('idle');
    setScore(0);
    setTimeLeft(60);
    setUserInput('');
    setTypedWords([]);
    setErrors(0);
    generateNewWord();
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);

    if (value.endsWith(' ')) {
      checkWord(value.trim());
    }
  };

  const checkWord = (typedWord) => {
    if (typedWord === currentWord) {
      const points = currentWord.length * 10;
      setScore(score + points);
      setTypedWords([...typedWords, { word: currentWord, correct: true }]);
    } else {
      setErrors(errors + 1);
      setTypedWords([...typedWords, { word: typedWord, correct: false }]);
    }
    setUserInput('');
    generateNewWord();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && userInput.trim()) {
      checkWord(userInput.trim());
    }
  };

  const getAccuracy = () => {
    const totalWords = typedWords.length;
    if (totalWords === 0) return 100;
    const correctWords = typedWords.filter(w => w.correct).length;
    return Math.round((correctWords / totalWords) * 100);
  };

  const getWPM = () => {
    const timeElapsed = 60 - timeLeft;
    if (timeElapsed === 0) return 0;
    const wordsTyped = typedWords.filter(w => w.correct).length;
    return Math.round((wordsTyped / timeElapsed) * 60);
  };

  const renderWordDisplay = () => {
    return currentWord.split('').map((char, index) => {
      let className = 'text-2xl font-bold ';
      
      if (index < userInput.length) {
        if (userInput[index] === char) {
          className += 'text-green-600 dark:text-green-400';
        } else {
          className += 'text-red-600 dark:text-red-400';
        }
      } else if (index === userInput.length) {
        className += 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400';
      } else {
        className += 'text-gray-600 dark:text-gray-400';
      }

      return <span key={index} className={className}>{char}</span>;
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Zap className="w-6 h-6 mr-2 text-yellow-500" />
          Typing Challenge
        </h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <span className="text-gray-600 dark:text-gray-400">High Score:</span>
            <span className="ml-1 font-bold text-yellow-600 dark:text-yellow-400">{highScore}</span>
          </div>
        </div>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Trophy className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-1" />
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Score</span>
          </div>
          <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{score}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-4 h-4 text-green-600 dark:text-green-400 mr-1" />
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">WPM</span>
          </div>
          <p className="text-xl font-bold text-green-900 dark:text-green-100">{getWPM()}</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-1" />
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Time</span>
          </div>
          <p className="text-xl font-bold text-purple-900 dark:text-purple-100">{timeLeft}s</p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">Accuracy</span>
          </div>
          <p className="text-xl font-bold text-orange-900 dark:text-orange-100">{getAccuracy()}%</p>
        </div>
      </div>

      {/* Game Area */}
      {gameState === 'idle' && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Ready to test your typing speed?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Type OS and CPU scheduling related words as fast as you can!
          </p>
          <button
            onClick={startGame}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center space-x-2 mx-auto"
          >
            <Play className="w-5 h-5" />
            <span>Start Game</span>
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div>
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-6 mb-4">
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">
                {renderWordDisplay()}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Type the word above</p>
            </div>
            
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="w-full p-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-center"
              placeholder="Start typing..."
              autoFocus
            />
          </div>

          {/* Recent Words */}
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Recent Words:</h4>
            <div className="flex flex-wrap gap-2">
              {typedWords.slice(-5).map((item, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded text-sm ${
                    item.correct
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                  }`}
                >
                  {item.word}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {gameState === 'completed' && (
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Game Over! 🎮</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Final Score</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{score}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Words Typed</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                {typedWords.filter(w => w.correct).length}
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
            <p>Speed: {getWPM()} WPM</p>
            <p>Accuracy: {getAccuracy()}%</p>
            <p>Errors: {errors}</p>
            {score > highScore && <p className="text-green-600 dark:text-green-400 font-bold">🎉 New High Score!</p>}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={startGame}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Play Again</span>
            </button>
            <button
              onClick={resetGame}
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypingGame;
