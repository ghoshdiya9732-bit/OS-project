// FCFS (First Come First Serve) Algorithm
export const fcfs = (processes) => {
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const ganttChart = [];
  const completionTimes = {};
  let currentTime = 0;

  sortedProcesses.forEach(process => {
    if (currentTime < process.arrivalTime) {
      currentTime = process.arrivalTime;
    }
    
    ganttChart.push({
      processId: process.id,
      startTime: currentTime,
      endTime: currentTime + process.burstTime
    });
    
    completionTimes[process.id] = currentTime + process.burstTime;
    currentTime += process.burstTime;
  });

  const metrics = calculateMetrics(processes, completionTimes, ganttChart);
  
  return {
    ganttChart,
    metrics
  };
};

// SJF (Shortest Job First) Algorithm
export const sjf = (processes) => {
  const processesCopy = [...processes];
  const ganttChart = [];
  const completionTimes = {};
  const completed = new Set();
  let currentTime = 0;
  let totalCompleted = 0;

  while (totalCompleted < processesCopy.length) {
    const availableProcesses = processesCopy.filter(p => 
      p.arrivalTime <= currentTime && !completed.has(p.id)
    );

    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }

    const shortestProcess = availableProcesses.reduce((min, p) => 
      p.burstTime < min.burstTime ? p : min
    );

    ganttChart.push({
      processId: shortestProcess.id,
      startTime: currentTime,
      endTime: currentTime + shortestProcess.burstTime
    });

    completionTimes[shortestProcess.id] = currentTime + shortestProcess.burstTime;
    currentTime += shortestProcess.burstTime;
    completed.add(shortestProcess.id);
    totalCompleted++;
  }

  const metrics = calculateMetrics(processes, completionTimes, ganttChart);
  
  return {
    ganttChart,
    metrics
  };
};

// Round Robin Algorithm
export const roundRobin = (processes, timeQuantum) => {
  const queue = [];
  const ganttChart = [];
  const completionTimes = {};
  const remainingTime = {};
  const lastArrival = {};
  
  processes.forEach(process => {
    remainingTime[process.id] = process.burstTime;
    lastArrival[process.id] = process.arrivalTime;
  });

  let currentTime = 0;
  let completedCount = 0;

  // Add initial processes
  processes.forEach(process => {
    if (process.arrivalTime === 0) {
      queue.push(process.id);
    }
  });

  while (completedCount < processes.length) {
    if (queue.length === 0) {
      // Find next arriving process
      const nextProcess = processes
        .filter(p => remainingTime[p.id] > 0)
        .reduce((min, p) => p.arrivalTime < min.arrivalTime ? p : min);
      
      if (nextProcess) {
        currentTime = nextProcess.arrivalTime;
        queue.push(nextProcess.id);
      } else {
        break;
      }
    }

    const currentProcessId = queue.shift();
    const process = processes.find(p => p.id === currentProcessId);
    const timeToExecute = Math.min(timeQuantum, remainingTime[currentProcessId]);

    ganttChart.push({
      processId: currentProcessId,
      startTime: currentTime,
      endTime: currentTime + timeToExecute
    });

    remainingTime[currentProcessId] -= timeToExecute;
    currentTime += timeToExecute;

    // Add newly arrived processes to queue
    processes.forEach(p => {
      if (p.arrivalTime > lastArrival[p.id] && p.arrivalTime <= currentTime && remainingTime[p.id] > 0) {
        queue.push(p.id);
        lastArrival[p.id] = p.arrivalTime;
      }
    });

    if (remainingTime[currentProcessId] === 0) {
      completionTimes[currentProcessId] = currentTime;
      completedCount++;
    } else {
      queue.push(currentProcessId);
    }
  }

  const metrics = calculateMetrics(processes, completionTimes, ganttChart);
  
  return {
    ganttChart,
    metrics
  };
};

// Priority Scheduling Algorithm
export const priorityScheduling = (processes) => {
  const processesCopy = [...processes];
  const ganttChart = [];
  const completionTimes = {};
  const completed = new Set();
  let currentTime = 0;
  let totalCompleted = 0;

  while (totalCompleted < processesCopy.length) {
    const availableProcesses = processesCopy.filter(p => 
      p.arrivalTime <= currentTime && !completed.has(p.id)
    );

    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }

    // Lower priority number means higher priority
    const highestPriorityProcess = availableProcesses.reduce((min, p) => 
      p.priority < min.priority ? p : min
    );

    ganttChart.push({
      processId: highestPriorityProcess.id,
      startTime: currentTime,
      endTime: currentTime + highestPriorityProcess.burstTime
    });

    completionTimes[highestPriorityProcess.id] = currentTime + highestPriorityProcess.burstTime;
    currentTime += highestPriorityProcess.burstTime;
    completed.add(highestPriorityProcess.id);
    totalCompleted++;
  }

  const metrics = calculateMetrics(processes, completionTimes, ganttChart);
  
  return {
    ganttChart,
    metrics
  };
};

// Helper function to calculate performance metrics
const calculateMetrics = (processes, completionTimes, ganttChart) => {
  const processDetails = [];
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;

  processes.forEach(process => {
    const completionTime = completionTimes[process.id];
    const turnaroundTime = completionTime - process.arrivalTime;
    const waitingTime = turnaroundTime - process.burstTime;
    
    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;
    
    processDetails.push({
      id: process.id,
      arrivalTime: process.arrivalTime,
      burstTime: process.burstTime,
      priority: process.priority || 'N/A',
      completionTime,
      turnaroundTime,
      waitingTime
    });
  });

  const averageWaitingTime = totalWaitingTime / processes.length;
  const averageTurnaroundTime = totalTurnaroundTime / processes.length;

  return {
    averageWaitingTime,
    averageTurnaroundTime,
    processDetails,
    totalExecutionTime: Math.max(...Object.values(completionTimes))
  };
};

// Export all algorithms
export const schedulingAlgorithms = {
  fcfs,
  sjf,
  roundRobin,
  priority: priorityScheduling
};
