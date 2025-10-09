// main.js - versiune browser/Capacitor a scriptului tău (simplificată)
const WORK_LOCATION = "Strada Exemplu nr. 123, București";

class TimeTracker {
  constructor() {
    this.loadState();
    this.bindUI();
    this.updateLoop();
  }

  loadState(){
    try {
      const raw = localStorage.getItem('workTimeData');
      if(raw){ 
        const p = JSON.parse(raw);
        this.workRecords = p.workRecords || [];
        const s = p.currentSession || {};
        this.isAtWork = !!s.isAtWork;
        this.isPaused = !!s.isPaused;
        this.startTime = s.startTime ? new Date(s.startTime) : null;
        this.pauseStartTime = s.pauseStartTime ? new Date(s.pauseStartTime) : null;
        this.totalPauseTime = s.totalPauseTime || 0;
        this.pauseHistory = s.pauseHistory || [];
      } else this.resetToDefault();
    } catch(e){ this.resetToDefault(); }
  }

  resetToDefault(){
    this.isAtWork = false; this.isPaused = false;
    this.startTime = null; this.pauseStartTime = null;
    this.totalPauseTime = 0; this.workRecords = []; this.pauseHistory = [];
    this.saveState();
  }

  saveState(){
    const data = {
      workRecords: this.workRecords,
      currentSession: {
        isAtWork: this.isAtWork,
        isPaused: this.isPaused,
        startTime: this.startTime ? this.startTime.toISOString() : null,
        pauseStartTime: this.pauseStartTime ? this.pauseStartTime.toISOString() : null,
        totalPauseTime: this.totalPauseTime,
        pauseHistory: this.pauseHistory
      }
    };
    localStorage.setItem('workTimeData', JSON.stringify(data));
  }

  formatDigitalTime(seconds){
    const h = Math.floor(seconds/3600).toString().padStart(2,'0');
    const m = Math.floor((seconds%3600)/60).toString().padStart(2,'0');
    const s = (seconds%60).toString().padStart(2,'0');
    return `${h}:${m}:${s}`;
  }

  getCurrentSessionTime(){
    if(!this.startTime) return 0;
    const current = this.isPaused ? this.pauseStartTime : new Date();
    return Math.floor((current - this.startTime)/1000) - this.totalPauseTime;
  }

  getCurrentPauseTime(){
    if(!this.isPaused || !this.pauseStartTime) return this.totalPauseTime;
    return this.totalPauseTime + Math.floor((new Date() - this.pauseStartTime)/1000);
  }

  bindUI(){
    document.getElementById('start').addEventListener('click', ()=>this.startWork());
    document.getElementById('pause').addEventListener('click', ()=>this.pauseWork());
    document.getElementById('resume').addEventListener('click', ()=>this.resumeWork());
    document.getElementById('end').addEventListener('click', ()=>this.endWork());
  }

  startWork(){
    if(this.isAtWork) return;
    this.isAtWork = true;
    this.isPaused = false;
    this.startTime = new Date();
    this.totalPauseTime = 0; this.pauseHistory = [];
    this.saveState(); this.render();
  }

  pauseWork(){
    if(!this.isAtWork || this.isPaused) return;
    this.isPaused = true; this.pauseStartTime = new Date();
    this.pauseHistory.push({start: this.pauseStartTime.toISOString(), date: new Date().toISOString().split('T')[0]});
    this.saveState(); this.render();
  }

  resumeWork(){
    if(!this.isPaused) return;
    const end = new Date();
    const dur = Math.floor((end - this.pauseStartTime)/1000);
    this.totalPauseTime += dur;
    this.isPaused = false;
    this.pauseHistory[this.pauseHistory.length-1].end = end.toISOString();
    this.pauseHistory[this.pauseHistory.length-1].duration = dur;
    this.pauseStartTime = null;
    this.saveState(); this.render();
  }

  endWork(){
    if(!this.isAtWork) return;
    const end = new Date();
    const workDuration = this.getCurrentSessionTime();
    const record = {
      date: new Date().toISOString().split('T')[0],
      startTime: this.startTime.toISOString(),
      endTime: end.toISOString(),
      workDuration, pauseDuration: this.totalPauseTime, pauseHistory: this.pauseHistory, location: WORK_LOCATION
    };
    this.workRecords.push(record);
    this.isAtWork = false; this.isPaused = false; this.startTime = null; this.pauseStartTime = null; this.totalPauseTime = 0; this.pauseHistory = [];
    this.saveState(); this.render();
    alert('Program încheiat: ' + this.formatDigitalTime(workDuration));
  }

  render(){
    const status = document.getElementById('status');
    const timer = document.getElementById('timer');
    if(!this.isAtWork) status.textContent = 'Nu ești la muncă';
    else if(this.isPaused) status.textContent = 'ÎN PAUZĂ';
    else status.textContent = 'LUCRU ACTIV';
    timer.textContent = this.formatDigitalTime(this.getCurrentSessionTime());
  }

  updateLoop(){
    this.render();
    setInterval(()=>this.render(), 1000);
  }
}

window.tracker = new TimeTracker();
