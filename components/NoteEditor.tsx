'use client';

import { useState, useEffect } from 'react';
import { Note } from '../types/note';

interface NoteEditorProps {
  note?: Note;
  onSave: (noteData: { title: string; content: string; folder?: string; tags?: string[] }) => Promise<void>;
  onCancel?: () => void;
  folders: string[];
  tags: string[];
}

export default function NoteEditor({ note, onSave, onCancel, folders, tags }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [folder, setFolder] = useState(note?.folder || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(note?.tags || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setFolder(note.folder || '');
      setSelectedTags(note.tags || []);
    }
  }, [note]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const noteData = {
        title: title.trim(),
        content: content.trim(),
        folder: folder || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      };
      
      await onSave(noteData);
      if (onCancel) onCancel();
    } catch (err) {
      setError('Failed to save note. Please try again.');
      console.error('Error saving note:', err);
    } finally {
      setSaving(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text placeholder-light-text/60 dark:placeholder-dark-text/60 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-colors duration-200"
          disabled={saving}
        />
        <textarea
          placeholder="Note Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="w-full px-4 py-2 rounded-lg bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text placeholder-light-text/60 dark:placeholder-dark-text/60 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-colors duration-200 resize-none"
          disabled={saving}
        />

        {/* Folder Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-light-text dark:text-dark-text">
            Folder
          </label>
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-colors duration-200"
            disabled={saving}
          >
            <option value="">No Folder</option>
            {folders.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* Tags Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-light-text dark:text-dark-text">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                type="button"
                className={`px-2 py-1 rounded-full text-xs transition-colors duration-200 ${
                  selectedTags.includes(tag)
                    ? 'bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-text'
                    : 'bg-light-primary dark:bg-dark-primary text-light-text/80 dark:text-dark-text/80 hover:bg-light-hover dark:hover:bg-dark-hover'
                }`}
                disabled={saving}
              >
                # {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text hover:bg-light-hover dark:hover:bg-dark-hover transition-colors duration-200"
              disabled={saving}
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-text hover:bg-light-hover dark:hover:bg-dark-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            disabled={saving}
          >
            {saving ? 'Saving...' : note ? 'Update Note' : 'Create Note'}
          </button>
        </div>
      </div>
    </form>
  );
}
