'use client';

import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTMA } from '@/components/TMAProvider';
import { Plus, Trash2, Edit2, Film, Users, LayoutDashboard, X } from 'lucide-react';

export default function AdminPage() {
  const { user } = useTMA();
  const [activeTab, setActiveTab] = useState<'movies' | 'users'>('movies');
  const [movies, setMovies] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: 'Action',
    poster_url: '',
    video_url: '',
    is_premium: false,
    release_year: new Date().getFullYear(),
    duration: ''
  });

  // Simple check for admin - in production this should be more robust
  const isAdmin = user?.username === 'davlaatbek09' || user?.id === 114360305069; // Example IDs

  useEffect(() => {
    const q = collection(db, 'movies');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMovies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'movies'), {
        ...formData,
        created_at: serverTimestamp()
      });
      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        genre: 'Action',
        poster_url: '',
        video_url: '',
        is_premium: false,
        release_year: new Date().getFullYear(),
        duration: ''
      });
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this movie?')) {
      await deleteDoc(doc(db, 'movies', id));
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-[var(--tg-theme-button-color)]" />
          Admin Panel
        </h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Movie
        </button>
      </div>

      <div className="flex gap-4 mb-6 border-b border-[var(--tg-theme-secondary-bg-color)]">
        <button 
          onClick={() => setActiveTab('movies')}
          className={`pb-2 px-2 text-sm font-bold transition-colors ${activeTab === 'movies' ? 'border-b-2 border-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-color)]' : 'opacity-50'}`}
        >
          <Film className="w-4 h-4 inline mr-2" /> Movies
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`pb-2 px-2 text-sm font-bold transition-colors ${activeTab === 'users' ? 'border-b-2 border-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-color)]' : 'opacity-50'}`}
        >
          <Users className="w-4 h-4 inline mr-2" /> Users
        </button>
      </div>

      {activeTab === 'movies' ? (
        <div className="space-y-4">
          {movies.map(movie => (
            <div key={movie.id} className="bg-[var(--tg-theme-secondary-bg-color)] p-4 rounded-xl flex items-center gap-4">
              <img src={movie.poster_url} className="w-16 h-24 object-cover rounded-lg" alt="" />
              <div className="flex-1">
                <h3 className="font-bold">{movie.title}</h3>
                <p className="text-xs opacity-60">{movie.genre} • {movie.release_year}</p>
                {movie.is_premium && <span className="text-[10px] text-amber-500 font-bold">PREMIUM</span>}
              </div>
              <div className="flex gap-2">
                <button className="p-2 opacity-50 hover:opacity-100"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(movie.id)} className="p-2 text-red-500 opacity-50 hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 opacity-50">
          <Users className="w-12 h-12 mx-auto mb-4" />
          <p>User management coming soon</p>
        </div>
      )}

      {/* Add Movie Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--tg-theme-bg-color)] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[var(--tg-theme-secondary-bg-color)] flex items-center justify-between">
              <h2 className="font-bold">Add New Movie</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-xs font-bold opacity-50 block mb-1">Title</label>
                <input 
                  required
                  className="w-full p-2 rounded-lg bg-[var(--tg-theme-secondary-bg-color)] border-none"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold opacity-50 block mb-1">Description</label>
                <textarea 
                  required
                  className="w-full p-2 rounded-lg bg-[var(--tg-theme-secondary-bg-color)] border-none h-24"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold opacity-50 block mb-1">Genre</label>
                  <select 
                    className="w-full p-2 rounded-lg bg-[var(--tg-theme-secondary-bg-color)] border-none"
                    value={formData.genre}
                    onChange={e => setFormData({...formData, genre: e.target.value})}
                  >
                    <option>Action</option>
                    <option>Comedy</option>
                    <option>Drama</option>
                    <option>Horror</option>
                    <option>Sci-Fi</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold opacity-50 block mb-1">Year</label>
                  <input 
                    type="number"
                    className="w-full p-2 rounded-lg bg-[var(--tg-theme-secondary-bg-color)] border-none"
                    value={formData.release_year}
                    onChange={e => setFormData({...formData, release_year: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold opacity-50 block mb-1">Poster URL</label>
                <input 
                  required
                  className="w-full p-2 rounded-lg bg-[var(--tg-theme-secondary-bg-color)] border-none"
                  value={formData.poster_url}
                  onChange={e => setFormData({...formData, poster_url: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold opacity-50 block mb-1">Video URL (HLS/MP4)</label>
                <input 
                  required
                  className="w-full p-2 rounded-lg bg-[var(--tg-theme-secondary-bg-color)] border-none"
                  value={formData.video_url}
                  onChange={e => setFormData({...formData, video_url: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="is_premium"
                  checked={formData.is_premium}
                  onChange={e => setFormData({...formData, is_premium: e.target.checked})}
                />
                <label htmlFor="is_premium" className="text-sm font-bold">Premium Movie</label>
              </div>
              <button 
                type="submit"
                className="w-full bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] py-3 rounded-xl font-bold mt-4"
              >
                Save Movie
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
