// Components/contexts/DiaryContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DiaryContext = createContext();

export function DiaryProvider({ children }) {
  const [entries, setEntries] = useState([]);

  // при старте загружаем сохранённые записи
  useEffect(() => {
    AsyncStorage.getItem('diaryEntries').then(json => {
      if (json) setEntries(JSON.parse(json));
    });
  }, []);

  // сохраняем в сторедж при изменении
  useEffect(() => {
    AsyncStorage.setItem('diaryEntries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = entry => {
    setEntries(prev => [entry, ...prev]);
  };

  const updateEntry = (id, updates) => {
    setEntries(prev =>
      prev.map(e => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const removeEntry = id => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  return (
    <DiaryContext.Provider
      value={{ entries, addEntry, updateEntry, removeEntry }}
    >
      {children}
    </DiaryContext.Provider>
  );
}
