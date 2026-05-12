import { useState, useEffect, useCallback } from 'react';
import { supabase, type DiaryEntry, type Mood } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import {
  BookOpen, Plus, LogOut, Trash2, ChevronLeft,
  Save, Calendar, Smile, Frown, Meh, Zap, CloudRain
} from 'lucide-react';

const MOODS: { value: Mood; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'happy',   label: 'Радость',  icon: <Smile className="w-4 h-4" />,     color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { value: 'excited', label: 'Кайф',     icon: <Zap className="w-4 h-4" />,        color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { value: 'neutral', label: 'Норм',     icon: <Meh className="w-4 h-4" />,        color: 'text-stone-600 bg-stone-50 border-stone-200' },
  { value: 'anxious', label: 'Тревога',  icon: <CloudRain className="w-4 h-4" />, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { value: 'sad',     label: 'Грусть',   icon: <Frown className="w-4 h-4" />,      color: 'text-slate-600 bg-slate-50 border-slate-200' },
];

const moodMap = Object.fromEntries(MOODS.map(m => [m.value, m]));

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('ru-RU', {
    hour: '2-digit', minute: '2-digit',
  });
}

interface EditorProps {
  entry: Partial<DiaryEntry> | null;
  onSave: (title: string, content: string, mood: Mood) => Promise<void>;
  onBack: () => void;
  saving: boolean;
}

function Editor({ entry, onSave, onBack, saving }: EditorProps) {
  const [title, setTitle] = useState(entry?.title ?? '');
  const [content, setContent] = useState(entry?.content ?? '');
  const [mood, setMood] = useState<Mood>(entry?.mood ?? 'neutral');

  const handleSave = () => onSave(title, content, mood);

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Назад
        </button>
        <button
          onClick={handleSave}
          disabled={saving || !title.trim()}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-xl transition shadow-sm"
        >
          {saving
            ? <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            : <Save className="w-3.5 h-3.5" />
          }
          Сохранить
        </button>
      </div>

      {/* Mood picker */}
      <div className="px-6 py-4 border-b border-stone-100">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-3">Настроение</p>
        <div className="flex gap-2 flex-wrap">
          {MOODS.map(m => (
            <button
              key={m.value}
              onClick={() => setMood(m.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all duration-150 ${
                mood === m.value ? m.color + ' ring-2 ring-offset-1 ring-current/30' : 'text-stone-500 bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              {m.icon}
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Заголовок..."
        className="mx-6 mt-6 text-2xl font-bold text-stone-900 placeholder-stone-300 bg-transparent border-none outline-none"
      />

      {/* Content */}
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Что сегодня происходило..."
        className="flex-1 mx-6 mt-4 mb-6 text-stone-700 placeholder-stone-300 bg-transparent border-none outline-none resize-none text-base leading-relaxed"
      />
    </div>
  );
}

interface Props {
  user: User;
}

export default function DiaryApp({ user }: Props) {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<DiaryEntry | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchEntries = useCallback(async () => {
    const { data } = await supabase
      .from('diary_entries')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setEntries(data as DiaryEntry[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleNew = () => {
    setSelected(null);
    setIsNew(true);
  };

  const handleSelect = (entry: DiaryEntry) => {
    setSelected(entry);
    setIsNew(false);
  };

  const handleBack = () => {
    setSelected(null);
    setIsNew(false);
  };

  const handleSave = async (title: string, content: string, mood: Mood) => {
    if (!title.trim()) return;
    setSaving(true);

    if (isNew) {
      const { data, error } = await supabase
        .from('diary_entries')
        .insert({ title, content, mood, user_id: user.id })
        .select()
        .single();
      if (!error && data) {
        setEntries(prev => [data as DiaryEntry, ...prev]);
        setSelected(data as DiaryEntry);
        setIsNew(false);
      }
    } else if (selected) {
      const { data, error } = await supabase
        .from('diary_entries')
        .update({ title, content, mood, updated_at: new Date().toISOString() })
        .eq('id', selected.id)
        .select()
        .single();
      if (!error && data) {
        const updated = data as DiaryEntry;
        setEntries(prev => prev.map(e => e.id === updated.id ? updated : e));
        setSelected(updated);
      }
    }

    setSaving(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.from('diary_entries').delete().eq('id', id);
    setEntries(prev => prev.filter(e => e.id !== id));
    if (selected?.id === id) handleBack();
  };

  const showEditor = isNew || selected !== null;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <span className="font-bold text-stone-900 text-lg">Дневник</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-stone-400 hidden sm:block">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-red-500 transition px-2 py-1 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 flex-1 py-6">
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden flex" style={{ minHeight: '70vh' }}>
          {/* Sidebar */}
          <div className={`w-full sm:w-72 flex-shrink-0 border-r border-stone-100 flex flex-col ${showEditor ? 'hidden sm:flex' : 'flex'}`}>
            {/* Sidebar header */}
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-stone-700">
                {entries.length > 0 ? `${entries.length} записей` : 'Нет записей'}
              </span>
              <button
                onClick={handleNew}
                className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Новая
              </button>
            </div>

            {/* Entry list */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-5 h-5 border-2 border-stone-200 border-t-amber-500 rounded-full animate-spin" />
                </div>
              ) : entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center px-6">
                  <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center mb-3">
                    <BookOpen className="w-6 h-6 text-stone-400" />
                  </div>
                  <p className="text-sm font-medium text-stone-600">Пока пусто</p>
                  <p className="text-xs text-stone-400 mt-1">Напиши первую запись</p>
                </div>
              ) : (
                entries.map(entry => {
                  const m = moodMap[entry.mood];
                  return (
                    <button
                      key={entry.id}
                      onClick={() => handleSelect(entry)}
                      className={`w-full text-left px-4 py-3.5 border-b border-stone-50 hover:bg-stone-50 transition group relative ${selected?.id === entry.id ? 'bg-amber-50 border-l-2 border-l-amber-400' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-stone-800 truncate flex-1 leading-snug">
                          {entry.title || 'Без названия'}
                        </p>
                        <button
                          onClick={(e) => handleDelete(entry.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 transition flex-shrink-0 mt-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-stone-400 mt-1 truncate leading-relaxed">
                        {entry.content || 'Нет текста'}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${m?.color ?? ''}`}>
                          {m?.icon}
                          {m?.label}
                        </span>
                        <span className="text-xs text-stone-300 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(entry.created_at)}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Editor panel */}
          {showEditor ? (
            <div className="flex-1 flex flex-col">
              <Editor
                entry={isNew ? null : selected}
                onSave={handleSave}
                onBack={handleBack}
                saving={saving}
              />
            </div>
          ) : (
            <div className="hidden sm:flex flex-1 items-center justify-center flex-col text-center px-8">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-amber-400" />
              </div>
              <p className="text-stone-600 font-medium">Выбери запись или создай новую</p>
              <p className="text-stone-400 text-sm mt-1">Твои мысли никуда не денутся</p>
              <button
                onClick={handleNew}
                className="mt-6 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Написать
              </button>
            </div>
          )}
        </div>

        {/* Stats bar */}
        {entries.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {MOODS.map(m => {
              const count = entries.filter(e => e.mood === m.value).length;
              return (
                <div key={m.value} className={`flex items-center gap-2 px-4 py-3 rounded-xl border bg-white ${count > 0 ? m.color : 'text-stone-400 border-stone-100'}`}>
                  {m.icon}
                  <span className="text-sm font-medium">{count}</span>
                  <span className="text-xs">{m.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Last entry time */}
        {selected && (
          <p className="text-xs text-stone-400 text-right mt-3">
            Последнее изменение: {formatDate(selected.updated_at)} в {formatTime(selected.updated_at)}
          </p>
        )}
      </div>
    </div>
  );
}
