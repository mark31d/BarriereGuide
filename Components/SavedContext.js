// contexts/SavedContext.js

import React, { createContext, useState, useCallback } from 'react';

// 1) Создаём контекст и экспортируем его
export const SavedContext = createContext({
  saved: [],
  addPlace: () => {},
  removePlace: () => {},
});

/**
 * 2) Провайдер, оборачивает всё приложение и даёт доступ к saved-локациям
 */
export function SavedProvider({ children }) {
  const [saved, setSaved] = useState([]);

  /**
   * Добавить локацию в сохранённые
   * @param {{ id: string, name: string, desc: string, lat: number, lng: number, img: any }} place
   */
  const addPlace = useCallback(place => {
    setSaved(prev => {
      // если уже есть — не добавляем
      if (prev.some(p => p.id === place.id)) return prev;
      return [...prev, place];
    });
  }, []);

  /**
   * Убрать локацию из сохранённых по id
   * @param {string} placeId
   */
  const removePlace = useCallback(placeId => {
    setSaved(prev => prev.filter(p => p.id !== placeId));
  }, []);

  return (
    <SavedContext.Provider value={{ saved, addPlace, removePlace }}>
      {children}
    </SavedContext.Provider>
  );
}
