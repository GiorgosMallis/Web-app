import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';
import { Note } from '../types/Note';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'notes'),
      where('userId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Note[];
      setNotes(notesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const createNote = async (noteData: Omit<Note, 'id' | 'userId'>) => {
    if (!user) throw new Error('User must be logged in to create notes');

    const noteRef = await addDoc(collection(db, 'notes'), {
      ...noteData,
      userId: user.uid,
    });

    return noteRef.id;
  };

  const updateNote = async (noteId: string, noteData: Partial<Omit<Note, 'id' | 'userId'>>) => {
    if (!user) throw new Error('User must be logged in to update notes');

    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, noteData);
  };

  const deleteNote = async (noteId: string) => {
    if (!user) throw new Error('User must be logged in to delete notes');

    const noteRef = doc(db, 'notes', noteId);
    await deleteDoc(noteRef);
  };

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
  };
}
