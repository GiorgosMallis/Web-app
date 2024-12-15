'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { Note } from '../types/note';

interface NotesContextType {
  notes: Note[];
  loading: boolean;
  createNote: (title: string, content: string) => Promise<Note>;
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

  const createNote = async (title: string, content: string): Promise<Note> => {
    try {
      const newNote = {
        title,
        content,
        userId: user?.uid || 'anonymous',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'notes'), newNote);
      
      const createdNote = {
        id: docRef.id,
        ...newNote,
        createdAt: newNote.createdAt.toDate(),
        updatedAt: newNote.updatedAt.toDate(),
      } as Note;
      
      setNotes(prevNotes => [createdNote, ...prevNotes]);
      return createdNote;
    } catch (err) {
      console.error('Error creating note:', err);
      throw new Error('Failed to create note');
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
