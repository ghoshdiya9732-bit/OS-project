<<<<<<< HEAD
# OS-project
=======
# CPU Scheduling Simulator

A comprehensive educational tool for understanding CPU scheduling algorithms with real-time visualizations and performance metrics.

## Features

### 🖥️ Core Features
- **Multiple Scheduling Algorithms**:
  - FCFS (First Come First Serve)
  - SJF (Shortest Job First)
  - Round Robin
  - Priority Scheduling
- **Dynamic Process Input**: Add processes with custom arrival times, burst times, and priorities
- **Real-time Gantt Chart**: Visual representation of process execution order
- **Performance Metrics**: Calculate average waiting time, turnaround time, and CPU utilization

### 📱 Responsive Design
- **Mobile View**: Native app-like experience with bottom navigation
- **Desktop View**: Professional layout with sidebar navigation
- **Dark/Light Mode**: Toggle between themes for comfortable viewing

### 🎯 Educational Features
- **Step-by-step Execution**: Animated process execution for better understanding
- **Export Results**: Download simulation results as JSON
- **Sample Data**: Quick-start with pre-configured process sets
- **Performance Analysis**: Detailed metrics and efficiency calculations

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cpu-scheduling-simulator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Adding Processes
1. Enter Process ID (e.g., P1, P2)
2. Specify Arrival Time (when process arrives)
3. Set Burst Time (execution time required)
4. Add Priority (optional, for priority scheduling)

### Running Simulation
1. Select a scheduling algorithm
2. For Round Robin, adjust the Time Quantum
3. Click "Run Simulation" to execute
4. View Gantt Chart and performance metrics

### Step Mode
Enable step-by-step execution to see processes execute one at a time with animations.

## Algorithms Explained

### FCFS (First Come First Serve)
- Processes execute in order of arrival
- No preemption
- Simple but can lead to long waiting times

### SJF (Shortest Job First)
- Shortest burst time processes execute first
- Minimizes average waiting time
- May cause starvation for long processes

### Round Robin
- Time-slicing with fixed quantum
- Fair scheduling among all processes
- Good for interactive systems

### Priority Scheduling
- Higher priority processes execute first
- Can be preemptive or non-preemptive
- Risk of starvation for low-priority processes

## Performance Metrics

- **Waiting Time**: Time spent in ready queue
- **Turnaround Time**: Total time from arrival to completion
- **CPU Utilization**: Percentage of time CPU is busy
- **Throughput**: Number of processes completed per time unit

## Export Functionality

Export simulation results including:
- Algorithm used and parameters
- Process details
- Gantt chart data
- Performance metrics

## Technologies Used

- **React**: Frontend framework
- **Tailwind CSS**: Styling and responsive design
- **Lucide React**: Icons
- **JavaScript**: Algorithm implementations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Educational Purpose

This simulator is designed for:
- Operating Systems lab experiments
- Understanding scheduling concepts
- Visual learning through simulation
- Algorithm comparison and analysis

Perfect for students learning OS concepts and preparing for viva examinations!
>>>>>>> 2cc4628 (1st commit)
