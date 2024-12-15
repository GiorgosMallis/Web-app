'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useNotes } from '../contexts/NotesContext';
import { useTheme } from '../contexts/ThemeContext';
import ProtectedRoute from '../components/ProtectedRoute';
import NoteEditor from '../components/NoteEditor';
import NoteList from '../components/NoteList';
import { Note } from '../types/note';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [folders, setFolders] = useState<string[]>(['Personal', 'Work', 'Ideas']);
  const [tags, setTags] = useState<string[]>(['Important', 'Todo', 'Project']);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editedFolderName, setEditedFolderName] = useState('');
  const [editedTagName, setEditedTagName] = useState('');
  const { user, logout } = useAuth();
  const { notes, createNote, updateNote, deleteNote, loading } = useNotes();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleCreateNote = async (noteData: { title: string; content: string; folder?: string; tags?: string[] }) => {
    try {
      await createNote({
        ...noteData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleUpdateNote = async (noteData: { title: string; content: string; folder?: string; tags?: string[] }) => {
    if (!selectedNote) return;
    try {
      await updateNote(selectedNote.id, {
        ...noteData,
        updatedAt: Date.now(),
      });
      setSelectedNote(null);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(noteId);
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
    }
  };

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
  };

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      setFolders([...folders, newFolderName.trim()]);
      setNewFolderName('');
      setIsAddingFolder(false);
    }
  };

  const handleAddTag = () => {
    if (newTagName.trim()) {
      setTags([...tags, newTagName.trim()]);
      setNewTagName('');
      setIsAddingTag(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleEditFolder = (folder: string) => {
    setEditingFolder(folder);
    setEditedFolderName(folder);
  };

  const handleEditTag = (tag: string) => {
    setEditingTag(tag);
    setEditedTagName(tag);
  };

  const handleUpdateFolder = async (oldFolder: string, newFolder: string) => {
    if (newFolder.trim() && newFolder !== oldFolder) {
      // Update folder name in the folders list
      setFolders(folders.map(f => f === oldFolder ? newFolder : f));
      
      // Update all notes that use this folder
      const notesToUpdate = notes.filter(note => note.folder === oldFolder);
      for (const note of notesToUpdate) {
        await updateNote(note.id, { folder: newFolder });
      }
    }
    setEditingFolder(null);
  };

  const handleUpdateTag = async (oldTag: string, newTag: string) => {
    if (newTag.trim() && newTag !== oldTag) {
      // Update tag name in the tags list
      setTags(tags.map(t => t === oldTag ? newTag : t));
      
      // Update all notes that use this tag
      const notesToUpdate = notes.filter(note => note.tags?.includes(oldTag));
      for (const note of notesToUpdate) {
        const updatedTags = note.tags?.map(t => t === oldTag ? newTag : t);
        await updateNote(note.id, { tags: updatedTags });
      }
    }
    setEditingTag(null);
  };

  const handleDeleteFolder = async (folder: string) => {
    // Remove folder from the folders list
    setFolders(folders.filter(f => f !== folder));
    
    // Remove folder from all notes that use it
    const notesToUpdate = notes.filter(note => note.folder === folder);
    for (const note of notesToUpdate) {
      await updateNote(note.id, { folder: null });
    }
  };

  const handleDeleteTag = async (tag: string) => {
    // Remove tag from the tags list
    setTags(tags.filter(t => t !== tag));
    
    // Remove tag from all notes that use it
    const notesToUpdate = notes.filter(note => note.tags?.includes(tag));
    for (const note of notesToUpdate) {
      const updatedTags = note.tags?.filter(t => t !== tag);
      await updateNote(note.id, { tags: updatedTags.length ? updatedTags : null });
    }
  };

  return (
    <div className="flex h-screen bg-light-primary dark:bg-dark-primary transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 bg-light-secondary dark:bg-dark-secondary shadow-lg transition-colors duration-200">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-light-text dark:text-dark-text">Notes App</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-light-hover dark:hover:bg-dark-hover transition-colors duration-200"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 text-light-text dark:text-dark-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-light-text dark:text-dark-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              {user && (
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-light-hover dark:hover:bg-dark-hover transition-colors duration-200"
                  title="Log Out"
                >
                  <svg className="w-5 h-5 text-light-text dark:text-dark-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {user && (
            <button
              onClick={() => {
                setSelectedNote(null);
                setIsCreating(true);
              }}
              className="w-full mt-4 bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-text rounded-lg px-4 py-2 hover:bg-light-hover dark:hover:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:ring-offset-2 dark:focus:ring-offset-dark-primary transition-colors duration-200"
            >
              New Note
            </button>
          )}

          {/* Folders Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-light-text dark:text-dark-text">Folders</h2>
              <button
                onClick={() => setIsAddingFolder(true)}
                className="p-1 rounded-full hover:bg-light-hover dark:hover:bg-dark-hover text-light-text/60 dark:text-dark-text/60 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            {isAddingFolder && (
              <div className="mb-2 flex items-center space-x-2">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                  className="flex-1 px-2 py-1 text-sm rounded bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text placeholder-light-text/60 dark:placeholder-dark-text/60 focus:outline-none focus:ring-1 focus:ring-light-accent dark:focus:ring-dark-accent"
                />
                <button
                  onClick={handleAddFolder}
                  className="p-1 rounded hover:bg-light-hover dark:hover:bg-dark-hover text-light-text/60 dark:text-dark-text/60"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            )}
            <div className="space-y-1">
              {folders.map(folder => (
                <div key={folder} className="group flex items-center">
                  {editingFolder === folder ? (
                    <div className="flex-1 flex items-center space-x-2">
                      <input
                        type="text"
                        value={editedFolderName}
                        onChange={(e) => setEditedFolderName(e.target.value)}
                        className="flex-1 px-2 py-1 text-sm rounded bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text focus:outline-none focus:ring-1 focus:ring-light-accent dark:focus:ring-dark-accent"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdateFolder(folder, editedFolderName);
                          } else if (e.key === 'Escape') {
                            setEditingFolder(null);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleUpdateFolder(folder, editedFolderName)}
                        className="p-1 rounded hover:bg-light-hover dark:hover:bg-dark-hover text-light-text/60 dark:text-dark-text/60"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setSelectedFolder(folder === selectedFolder ? null : folder)}
                        className={`flex-1 text-left px-3 py-1.5 rounded text-sm transition-colors duration-200 ${
                          folder === selectedFolder
                            ? 'bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-text'
                            : 'text-light-text/80 dark:text-dark-text/80 hover:bg-light-hover dark:hover:bg-dark-hover'
                        }`}
                      >
                        📁 {folder}
                      </button>
                      <div className="hidden group-hover:flex items-center">
                        <button
                          onClick={() => handleEditFolder(folder)}
                          className="p-1 rounded hover:bg-light-hover dark:hover:bg-dark-hover text-light-text/60 dark:text-dark-text/60"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteFolder(folder)}
                          className="p-1 rounded hover:bg-light-hover dark:hover:bg-dark-hover text-light-text/60 dark:text-dark-text/60"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tags Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-light-text dark:text-dark-text">Tags</h2>
              <button
                onClick={() => setIsAddingTag(true)}
                className="p-1 rounded-full hover:bg-light-hover dark:hover:bg-dark-hover text-light-text/60 dark:text-dark-text/60 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            {isAddingTag && (
              <div className="mb-2 flex items-center space-x-2">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Tag name"
                  className="flex-1 px-2 py-1 text-sm rounded bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text placeholder-light-text/60 dark:placeholder-dark-text/60 focus:outline-none focus:ring-1 focus:ring-light-accent dark:focus:ring-dark-accent"
                />
                <button
                  onClick={handleAddTag}
                  className="p-1 rounded hover:bg-light-hover dark:hover:bg-dark-hover text-light-text/60 dark:text-dark-text/60"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <div key={tag} className="group relative">
                  {editingTag === tag ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editedTagName}
                        onChange={(e) => setEditedTagName(e.target.value)}
                        className="px-2 py-1 text-xs rounded bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text focus:outline-none focus:ring-1 focus:ring-light-accent dark:focus:ring-dark-accent"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdateTag(tag, editedTagName);
                          } else if (e.key === 'Escape') {
                            setEditingTag(null);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleUpdateTag(tag, editedTagName)}
                        className="p-1 rounded hover:bg-light-hover dark:hover:bg-dark-hover text-light-text/60 dark:text-dark-text/60"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleTag(tag)}
                        className={`px-2 py-1 rounded-full text-xs transition-colors duration-200 ${
                          selectedTags.includes(tag)
                            ? 'bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-text'
                            : 'bg-light-primary dark:bg-dark-primary text-light-text/80 dark:text-dark-text/80 hover:bg-light-hover dark:hover:bg-dark-hover'
                        }`}
                      >
                        # {tag}
                      </button>
                      <div className="hidden group-hover:flex items-center absolute -right-1 -top-1 bg-light-primary dark:bg-dark-primary rounded-full shadow-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTag(tag);
                          }}
                          className="p-1 rounded-full hover:bg-light-hover dark:hover:bg-dark-hover text-light-text/60 dark:text-dark-text/60"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTag(tag);
                          }}
                          className="p-1 rounded-full hover:bg-light-hover dark:hover:bg-dark-hover text-light-text/60 dark:text-dark-text/60"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-light-primary dark:bg-dark-primary overflow-auto transition-colors duration-200">
        <div className="max-w-4xl mx-auto">
          {user ? (
            <ProtectedRoute>
              {isCreating ? (
                <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg shadow-lg p-6 transition-colors duration-200">
                  <h2 className="text-2xl font-bold mb-4 text-light-text dark:text-dark-text">Create New Note</h2>
                  <NoteEditor
                    onSave={handleCreateNote}
                    onCancel={() => setIsCreating(false)}
                    folders={folders}
                    tags={tags}
                  />
                </div>
              ) : selectedNote ? (
                <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg shadow-lg p-6 transition-colors duration-200">
                  <h2 className="text-2xl font-bold mb-4 text-light-text dark:text-dark-text">Edit Note</h2>
                  <NoteEditor
                    note={selectedNote}
                    onSave={handleUpdateNote}
                    onCancel={() => setSelectedNote(null)}
                    folders={folders}
                    tags={tags}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-light-primary/50 dark:bg-dark-primary/50 rounded-lg p-6">
                    <NoteList
                      notes={notes}
                      selectedNoteId={selectedNote?.id}
                      onNoteSelect={handleNoteSelect}
                      onNoteDelete={handleDeleteNote}
                    />
                  </div>
                </div>
              )}
            </ProtectedRoute>
          ) : (
            <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg shadow-lg p-6 space-y-4 transition-colors duration-200">
              <h2 className="text-2xl font-bold mb-4 text-light-text dark:text-dark-text">Welcome to Notes App</h2>
              <Link 
                href="/login"
                className="block w-full text-center bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-text rounded-lg px-4 py-2 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors duration-200"
              >
                Log In
              </Link>
              <Link 
                href="/signup"
                className="block w-full text-center bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text rounded-lg px-4 py-2 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors duration-200"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
