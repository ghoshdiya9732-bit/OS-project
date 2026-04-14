import React, { useState, useEffect } from 'react';

const TypingAnimation = ({ texts, speed = 100, className = '', cursorType = 'blink' }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  const getCursorClass = () => {
    switch(cursorType) {
      case 'rainbow': return 'cursor-rainbow';
      case 'glow': return 'cursor-glow';
      case 'pulse': return 'cursor-pulse';
      case 'type': return 'cursor-type';
      default: return 'cursor-blink';
    }
  };

  useEffect(() => {
    const currentFullText = texts[currentTextIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        // Typing
        if (charIndex < currentFullText.length) {
          setCurrentText(prev => prev + currentFullText[charIndex]);
          setCharIndex(prev => prev + 1);
        } else {
          // Finished typing, pause before deleting
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        // Deleting
        if (charIndex > 0) {
          setCurrentText(prev => prev.slice(0, -1));
          setCharIndex(prev => prev - 1);
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, currentTextIndex, texts, speed]);

  return (
    <span className={className}>
      {currentText}
      <span className={`basic-cursor ${getCursorClass()}`}></span>
    </span>
  );
};

export default TypingAnimation;
