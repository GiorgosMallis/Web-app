'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { Note } from '../types/note';

interface NotesContextType {
  notes: Note[];
  loading: boolean;
  createNote: (note: { title: string; content: string; folder?: string; tags?: string[] }) => Promise<Note>;
  updateNote: (id: string, title: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  error: string | null;
}

const NotesContext = createContext<NotesContextType>({} as NotesContextType);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadNotes();
    } else {
      setNotes([]);
      setLoading(false);
    }
  }, [user]);

  const loadNotes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'notes'));
      const loadedNotes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Note[];
      
      setNotes(loadedNotes);
      setError(null);
    } catch (err) {
      console.error('Error loading notes:', err);
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const createNote = async ({ title, content, folder = 'default', tags = [] }: { 
    title: string; 
    content: string; 
    folder?: string; 
    tags?: string[] 
  }): Promise<Note> => {
    if (!user) {
      throw new Error('Must be logged in to create notes');
    }

    try {
      const now = new Date();
      const noteData = {
        title,
        content,
        folder,
        tags,
        userId: user.uid,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
      };

      const docRef = await addDoc(collection(db, 'notes'), noteData);
      const newNote = {
        id: docRef.id,
        ...noteData,
        createdAt: now,
        updatedAt: now,
      };

      setNotes(prevNotes => [...prevNotes, newNote]);
      setError(null);
      return newNote;
    } catch (err) {
      console.error('Error creating note:', err);
      setError('Failed to create note');
      throw err;
    }
  };

  const updateNote = async (id: string, title: string, content: string) => {
    try {
      const updateData = {
        title,
        content,
        updatedAt: Timestamp.now(),
      };
      
      await updateDoc(doc(db, 'notes', id), updateData);
      
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === id
            ? { ...note, ...updateData, updatedAt: updateData.updatedAt.toDate() }
            : note
        )
      );
    } catch (err) {
      console.error('Error updating note:', err);
      throw new Error('Failed to update note');
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notes', id));
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    } catch (err) {
      console.error('Error deleting note:', err);
      throw new Error('Failed to delete note');
    }
  };

  return (
    <NotesContext.Provider value={{ notes, loading, createNote, updateNote, deleteNote, error }}>
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => useContext(NotesContext);
