import React, { useState } from 'react';
import { Plus, Search, Calendar, BookOpen, Edit, Trash2, Download, Filter } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: 'excellent' | 'good' | 'neutral' | 'difficult' | 'challenging';
  category: 'business' | 'personal' | 'goals' | 'reflection' | 'ideas';
}

export default function JournalManager() {
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>('journal-entries', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 'neutral' as JournalEntry['mood'],
    category: 'business' as JournalEntry['category']
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'neutral': return 'bg-gray-100 text-gray-800';
      case 'difficult': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'excellent': return '🌟';
      case 'good': return '😊';
      case 'neutral': return '😐';
      case 'difficult': return '😔';
      case 'challenging': return '😰';
      default: return '😐';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'business': return 'bg-blue-100 text-blue-800';
      case 'personal': return 'bg-purple-100 text-purple-800';
      case 'goals': return 'bg-green-100 text-green-800';
      case 'reflection': return 'bg-orange-100 text-orange-800';
      case 'ideas': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddEntry = () => {
    if (newEntry.title.trim() && newEntry.content.trim()) {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        ...newEntry
      };
      setEntries([entry, ...entries]);
      setNewEntry({
        title: '',
        content: '',
        mood: 'neutral',
        category: 'business'
      });
      setShowNewEntryModal(false);
    }
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Journal d'entreprise</h1>
          <p className="text-gray-600">Notez vos réflexions, idées et ressentis</p>
        </div>
        
        <button
          onClick={() => setShowNewEntryModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 flex items-center gap-2"
        >
          <Plus size={20} />
          Nouvelle entrée
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total entrées</p>
              <p className="text-2xl font-bold text-gray-900">{entries.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <BookOpen className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Ce mois</p>
              <p className="text-2xl font-bold text-gray-900">
                {entries.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Calendar className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Humeur moyenne</p>
              <p className="text-2xl font-bold text-gray-900">😊</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <span className="text-yellow-600 text-2xl">🌟</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Série actuelle</p>
              <p className="text-2xl font-bold text-gray-900">7 jours</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <span className="text-purple-600 text-2xl">🔥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher dans vos entrées..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes catégories</option>
            <option value="business">Business</option>
            <option value="personal">Personnel</option>
            <option value="goals">Objectifs</option>
            <option value="reflection">Réflexion</option>
            <option value="ideas">Idées</option>
          </select>
          
          <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            <Download size={20} />
            Exporter
          </button>
        </div>
      </div>

      {/* Journal Entries */}
      <div className="space-y-6">
        {filteredEntries.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune entrée trouvée</h3>
            <p className="text-gray-600 mb-6">Commencez à écrire vos réflexions et idées</p>
            <button
              onClick={() => setShowNewEntryModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Créer ma première entrée
            </button>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{entry.title}</h3>
                    <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>{formatDate(entry.date)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(entry.category)}`}>
                      {entry.category === 'business' ? 'Business' :
                       entry.category === 'personal' ? 'Personnel' :
                       entry.category === 'goals' ? 'Objectifs' :
                       entry.category === 'reflection' ? 'Réflexion' : 'Idées'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(entry.mood)}`}>
                      {entry.mood === 'excellent' ? 'Excellent' :
                       entry.mood === 'good' ? 'Bien' :
                       entry.mood === 'neutral' ? 'Neutre' :
                       entry.mood === 'difficult' ? 'Difficile' : 'Challengeant'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Entry Modal */}
      {showNewEntryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nouvelle entrée</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                <input
                  type="text"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Donnez un titre à votre entrée..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                  <select
                    value={newEntry.category}
                    onChange={(e) => setNewEntry({...newEntry, category: e.target.value as JournalEntry['category']})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="business">Business</option>
                    <option value="personal">Personnel</option>
                    <option value="goals">Objectifs</option>
                    <option value="reflection">Réflexion</option>
                    <option value="ideas">Idées</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Humeur</label>
                  <select
                    value={newEntry.mood}
                    onChange={(e) => setNewEntry({...newEntry, mood: e.target.value as JournalEntry['mood']})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="excellent">🌟 Excellent</option>
                    <option value="good">😊 Bien</option>
                    <option value="neutral">😐 Neutre</option>
                    <option value="difficult">😔 Difficile</option>
                    <option value="challenging">😰 Challengeant</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contenu</label>
                <textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                  rows={8}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Écrivez vos pensées, réflexions, idées..."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNewEntryModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddEntry}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}