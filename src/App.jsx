import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, StopCircle, History, Settings, Coffee, TrendingUp } from 'lucide-react';

const WORK_LOCATION = "Strada Exemplu nr. 123, București";

const TimeTrackerApp = () => {
  const [isAtWork, setIsAtWork] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [pauseStartTime, setPauseStartTime] = useState(null);
  const [totalPauseTime, setTotalPauseTime] = useState(0);
  const [pauseHistory, setPauseHistory] = useState([]);
  const [workRecords, setWorkRecords] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeView, setActiveView] = useState('main');

  useEffect(() => {
    const savedData = localStorage.getItem('workTimeData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setWorkRecords(parsed.workRecords || []);
        if (parsed.currentSession) {
          setIsAtWork(parsed.currentSession.isAtWork || false);
          setIsPaused(parsed.currentSession.isPaused || false);
          setStartTime(parsed.currentSession.startTime ? new Date(parsed.currentSession.startTime) : null);
          setPauseStartTime(parsed.currentSession.pauseStartTime ? new Date(parsed.currentSession.pauseStartTime) : null);
          setTotalPauseTime(parsed.currentSession.totalPauseTime || 0);
          setPauseHistory(parsed.currentSession.pauseHistory || []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
  }, []);

  useEffect(() => {
    const data = {
      workRecords,
      currentSession: {
        isAtWork,
        isPaused,
        startTime: startTime ? startTime.toISOString() : null,
        pauseStartTime: pauseStartTime ? pauseStartTime.toISOString() : null,
        totalPauseTime,
        pauseHistory
      }
    };
    localStorage.setItem('workTimeData', JSON.stringify(data));
  }, [isAtWork, isPaused, startTime, pauseStartTime, totalPauseTime, pauseHistory, workRecords]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDigitalTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentSessionTime = () => {
    if (!startTime) return 0;
    const current = isPaused ? pauseStartTime : currentTime;
    return Math.floor((current - startTime) / 1000) - totalPauseTime;
  };

  const getCurrentPauseTime = () => {
    if (!isPaused || !pauseStartTime) return totalPauseTime;
    const currentPause = Math.floor((currentTime - pauseStartTime) / 1000);
    return totalPauseTime + currentPause;
  };

  const startWork = () => {
    setIsAtWork(true);
    setStartTime(new Date());
    setTotalPauseTime(0);
    setIsPaused(false);
    setPauseHistory([]);
  };

  const pauseWork = () => {
    setIsPaused(true);
    const now = new Date();
    setPauseStartTime(now);
    setPauseHistory([...pauseHistory, {
      start: now.toLocaleTimeString('ro-RO', {hour: '2-digit', minute: '2-digit'}),
      date: now.toISOString().split('T')[0]
    }]);
  };

  const resumeWork = () => {
    if (isPaused && pauseStartTime) {
      const pauseEnd = new Date();
      const pauseDuration = Math.floor((pauseEnd - pauseStartTime) / 1000);
      setTotalPauseTime(totalPauseTime + pauseDuration);
      setIsPaused(false);
      
      const updatedHistory = [...pauseHistory];
      if (updatedHistory.length > 0) {
        updatedHistory[updatedHistory.length - 1].end = pauseEnd.toLocaleTimeString('ro-RO', {hour: '2-digit', minute: '2-digit'});
        updatedHistory[updatedHistory.length - 1].duration = pauseDuration;
      }
      setPauseHistory(updatedHistory);
      setPauseStartTime(null);
    }
  };

  const endWork = () => {
    const endTime = new Date();
    const workDuration = getCurrentSessionTime();
    const pauseDuration = totalPauseTime;
    
    const record = {
      date: new Date().toISOString().split('T')[0],
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      workDuration,
      pauseDuration,
      pauseHistory,
      location: WORK_LOCATION
    };
    
    setWorkRecords([...workRecords, record]);
    setIsAtWork(false);
    setIsPaused(false);
    setStartTime(null);
    setPauseStartTime(null);
    setTotalPauseTime(0);
    setPauseHistory([]);
  };

  const resetCurrentSession = () => {
    if (window.confirm('Ești sigur că vrei să resetezi sesiunea curentă?')) {
      setIsAtWork(false);
      setIsPaused(false);
      setStartTime(null);
      setPauseStartTime(null);
      setTotalPauseTime(0);
      setPauseHistory([]);
    }
  };

  const clearAllData = () => {
    if (window.confirm('ATENȚIE! Această acțiune va șterge TOATE datele și istoricul. Ești sigur?')) {
      localStorage.removeItem('workTimeData');
      setWorkRecords([]);
      resetCurrentSession();
    }
  };

  const getMonthlyData = () => {
    const monthlyData = {};
    workRecords.forEach(record => {
      const date = new Date(record.startTime);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          name: monthName,
          totalWork: 0,
          totalPause: 0,
          workDays: 0,
          days: {}
        };
      }
      
      monthlyData[monthKey].totalWork += record.workDuration;
      monthlyData[monthKey].totalPause += record.pauseDuration;
      monthlyData[monthKey].workDays++;
    });
    return monthlyData;
  };

  const MainView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Clock className="w-8 h-8 text-red-400" />
            <h1 className="text-3xl font-bold">TIME TRACKER</h1>
          </div>
          <p className="text-sm text-gray-400">📍 {WORK_LOCATION}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-2xl">
          {!isAtWork ? (
            <div className="text-center">
              <div className="text-5xl mb-3">📊</div>
              <p className="text-gray-300 text-lg mb-2">NU EȘTI LA MUNCĂ</p>
              <p className="text-gray-500 text-sm">Apasă pentru a începe</p>
            </div>
          ) : isPaused ? (
            <div className="text-center">
              <div className="text-5xl mb-3">⏸️</div>
              <p className="text-yellow-400 text-lg mb-4">ÎN PAUZĂ</p>
              <div className="text-4xl font-bold mb-4">{formatDigitalTime(getCurrentSessionTime())}</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">⏰ Lucrat:</span>
                  <span className="font-semibold">{formatDuration(getCurrentSessionTime())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">☕ Pauză curentă:</span>
                  <span className="font-semibold">{formatDuration(Math.floor((currentTime - pauseStartTime) / 1000))}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-5xl mb-3">🟢</div>
              <p className="text-green-400 text-lg mb-4">LUCRU ACTIV</p>
              <div className="text-4xl font-bold mb-4">{formatDigitalTime(getCurrentSessionTime())}</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">🕐 Start:</span>
                  <span className="font-semibold">{startTime?.toLocaleTimeString('ro-RO', {hour: '2-digit', minute: '2-digit'})}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">⏸️ Pauze totale:</span>
                  <span className="font-semibold">{formatDuration(totalPauseTime)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3 mb-6">
          {!isAtWork ? (
            <button
              onClick={startWork}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition"
            >
              <Play className="w-5 h-5" />
              Începe Lucrul
            </button>
          ) : isPaused ? (
            <button
              onClick={resumeWork}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition"
            >
              <Play className="w-5 h-5" />
              Reia Lucrul
            </button>
          ) : (
            <>
              <button
                onClick={pauseWork}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition"
              >
                <Pause className="w-5 h-5" />
                Pauză
              </button>
              <button
                onClick={endWork}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition"
              >
                <StopCircle className="w-5 h-5" />
                Încheie Programul
              </button>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setActiveView('history')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <History className="w-4 h-4" />
            Istoric
          </button>
          <button
            onClick={() => setActiveView('settings')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <Settings className="w-4 h-4" />
            Setări
          </button>
        </div>

        <div className="text-center mt-6 text-sm text-gray-400">
          {currentTime.toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          <br />
          {currentTime.toLocaleTimeString('ro-RO')}
        </div>
      </div>
    </div>
  );

  const HistoryView = () => {
    const monthlyData = getMonthlyData();
    const sortedMonths = Object.keys(monthlyData).sort().reverse();

    if (workRecords.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-6">
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setActiveView('main')}
              className="mb-6 text-gray-400 hover:text-white flex items-center gap-2"
            >
              ← Înapoi
            </button>
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-xl">Nu există înregistrări</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-6">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setActiveView('main')}
            className="mb-6 text-gray-400 hover:text-white flex items-center gap-2"
          >
            ← Înapoi
          </button>
          
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Istoric Lunar
          </h2>

          <div className="space-y-4">
            {sortedMonths.map(monthKey => {
              const month = monthlyData[monthKey];
              const avgWork = month.totalWork / month.workDays;
              return (
                <div key={monthKey} className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                  <h3 className="text-lg font-bold mb-3">{month.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">⏱️ Total lucrat:</span>
                      <span className="font-semibold">{formatDuration(month.totalWork)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">⏸️ Total pauze:</span>
                      <span className="font-semibold">{formatDuration(month.totalPause)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">📈 Medie/zi:</span>
                      <span className="font-semibold">{formatDuration(avgWork)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">📅 Zile lucrate:</span>
                      <span className="font-semibold">{month.workDays}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const SettingsView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-6">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => setActiveView('main')}
          className="mb-6 text-gray-400 hover:text-white flex items-center gap-2"
        >
          ← Înapoi
        </button>
        
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Setări
        </h2>

        <div className="space-y-4">
          <button
            onClick={resetCurrentSession}
            className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-white font-semibold py-4 px-6 rounded-xl transition"
          >
            🔄 Resetează Sesiunea Curentă
          </button>
          
          <button
            onClick={clearAllData}
            className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-white font-semibold py-4 px-6 rounded-xl transition"
          >
            🗑️ Șterge Toate Datele
          </button>
        </div>

        <div className="mt-8 p-4 bg-white/5 rounded-xl text-sm text-gray-400">
          <p className="font-semibold mb-2">ℹ️ Informații:</p>
          <p>• Sesiuni totale: {workRecords.length}</p>
          <p>• Status sesiune: {isAtWork ? (isPaused ? 'În pauză' : 'Activ') : 'Inactiv'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {activeView === 'main' && <MainView />}
      {activeView === 'history' && <HistoryView />}
      {activeView === 'settings' && <SettingsView />}
    </>
  );
};

export default TimeTrackerApp;
