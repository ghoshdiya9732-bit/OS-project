import React from 'react';

const GanttChart = ({ data, isAnimating = false, currentStep = 0, stepMode = false }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const getProcessColor = (processId) => {
    const colors = [
      'process-cyan',
      'process-green', 
      'process-purple',
      'process-orange',
      'process-red',
      'process-blue',
      'process-yellow',
      'process-pink',
      'process-rainbow'
    ];
    
    const hash = processId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const maxTime = Math.max(...data.map(d => d.endTime));
  const totalWidth = Math.max(800, maxTime * 50);

  return (
    <div className="gantt-chart">
      {/* Time scale */}
      <div className="flex mb-2 text-xs cyber-text-cyan">
        {Array.from({ length: maxTime + 1 }, (_, i) => (
          <div
            key={i}
            className="flex-shrink-0 font-bold"
            style={{ width: `${totalWidth / (maxTime + 1)}px` }}
          >
            {i}
          </div>
        ))}
      </div>

      {/* Gantt timeline */}
      <div className="gantt-timeline" style={{ width: `${totalWidth}px` }}>
        {data.map((item, index) => {
          const duration = item.endTime - item.startTime;
          const width = (duration / maxTime) * totalWidth;
          const left = (item.startTime / maxTime) * totalWidth;
          
          const isActive = stepMode && isAnimating && index === currentStep;
          const isCompleted = stepMode && isAnimating && index < currentStep;
          
          return (
            <div
              key={index}
              className={`process-block ${getProcessColor(item.processId)} text-white step-animation cyber-glow ${
                isActive ? 'active' : ''
              } ${isCompleted ? 'opacity-60' : ''}`}
              style={{
                position: 'absolute',
                left: `${left}px`,
                width: `${width}px`,
                minWidth: '40px'
              }}
            >
              <span className="font-bold text-sm">{item.processId}</span>
              <span className="process-time cyber-text-green font-mono">
                {item.startTime}-{item.endTime}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from(new Set(data.map(d => d.processId))).map(processId => {
          const colorClass = getProcessColor(processId);
          const isRainbow = colorClass === 'process-rainbow';
          return (
            <div key={processId} className="flex items-center space-x-1">
              <div className={`w-4 h-4 rounded ${colorClass} ${isRainbow ? 'cyber-rainbow' : ''}`}></div>
              <span className="text-xs cyber-text font-bold">{processId}</span>
            </div>
          );
        })}
      </div>

      {/* Step indicator */}
      {stepMode && isAnimating && (
        <div className="mt-4 text-center">
          <span className="text-sm cyber-text-magenta font-bold">
            STEP {currentStep + 1} OF {data.length}
          </span>
        </div>
      )}
    </div>
  );
};

export default GanttChart;
