'use client';

import { Note } from '../types/note';

interface NoteListProps {
  notes: Note[];
  selectedNoteId?: string;
  onNoteSelect: (note: Note) => void;
  onNoteDelete: (noteId: string) => Promise<void>;
}

export default function NoteList({
  notes,
  selectedNoteId,
  onNoteSelect,
  onNoteDelete,
}: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No notes yet. Create your first note!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <div
          key={note.id}
          className={`p-4 rounded-lg cursor-pointer shadow-sm transition-all duration-200 ${
            selectedNoteId === note.id
              ? 'bg-light-hover dark:bg-dark-hover ring-2 ring-light-accent dark:ring-dark-accent'
              : 'bg-light-accent dark:bg-dark-accent hover:shadow-md hover:translate-y-[-1px]'
          }`}
          onClick={() => onNoteSelect(note)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-light-text dark:text-dark-text text-sm mb-1">{note.title}</h3>
              <p className="text-xs text-light-text/80 dark:text-dark-text/80 truncate">{note.content}</p>
              <div className="mt-2 flex items-center space-x-2">
                {note.folder && (
                  <span className="inline-flex items-center text-xs text-light-text/60 dark:text-dark-text/60">
                    <span className="mr-1">📁</span> {note.folder}
                  </span>
                )}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex items-center space-x-1">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-light-text/60 dark:text-dark-text/60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-light-text/60 dark:text-dark-text/60">
                Last updated: {new Date(note.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this note?')) {
                  onNoteDelete(note.id);
                }
              }}
              className="p-1 ml-2 rounded hover:bg-light-hover dark:hover:bg-dark-hover text-light-text/60 dark:text-dark-text/60 hover:text-light-text dark:hover:text-dark-text transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
