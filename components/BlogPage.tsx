
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, ArrowRight, Zap, BookOpen } from 'lucide-react';
import { BLOG_POSTS } from './ArticlePage';

const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'All' | 'Update' | 'Teknologi' | 'Tutorial'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const onBack = () => navigate(-1);
  const onReadArticle = (id: number) => navigate(`/article/${id}`);

  // Determine Featured Post (Always the latest Tech or News)
  const featuredPost = BLOG_POSTS.find(p => p.tag === 'Teknologi' || p.tag === 'News') || BLOG_POSTS[0];
  const showFeatured = filter === 'All' && !searchQuery && featuredPost;

  const filteredPosts = BLOG_POSTS.filter(post => {
    // Filter Logic
    const matchesCategory = filter === 'All' || 
                            post.tag === filter || 
                            (filter === 'Teknologi' && (post.tag === 'News' || post.tag === 'Visi'));
                            
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Exclude featured post from grid if it's already shown at the top
    const isFeatured = showFeatured && post.id === featuredPost.id;

    return matchesCategory && matchesSearch && !isFeatured;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 h-16 flex items-center px-4 md:px-6 justify-between transition-all">
         <div className="flex items-center gap-4">
             <button 
               onClick={onBack}
               className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
             >
                <ArrowLeft size={20} />
             </button>
             <div className="flex items-center gap-2">
                <img src="/logo-app.png" alt="Logo" className="h-8 w-auto object-contain" />
                <span className="font-bold text-lg tracking-tight hidden md:block">Velicia Blog</span>
             </div>
         </div>
      </nav>

      <main className="pt-24 pb-20 max-w-6xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                Pusat Informasi & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Edukasi AI</span>
            </h1>
            <p className="text-lg text-gray-500 font-medium">
                Temukan artikel terbaru tentang teknologi Gen2, tutorial penggunaan, dan catatan pembaruan Velicia.
            </p>
        </div>

        {/* Featured Post (Only shown if no search/filter active) */}
        {showFeatured && (
            <div 
                onClick={() => onReadArticle(featuredPost.id)}
                className="relative rounded-[2.5rem] overflow-hidden bg-black text-white mb-16 cursor-pointer group shadow-2xl animate-in fade-in zoom-in-95 duration-700 transform transition-transform hover:scale-[1.01]"
            >
                <div className="absolute inset-0 opacity-60">
                    <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end h-[500px] md:h-[600px] max-w-4xl">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-xs font-bold uppercase tracking-widest mb-4 w-fit">
                        {featuredPost.tag}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black leading-tight mb-4 group-hover:text-pink-400 transition-colors">
                        {featuredPost.title}
                    </h2>
                    <p className="text-gray-300 text-lg md:text-xl line-clamp-2 mb-6 max-w-2xl">
                        {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-2 font-bold text-sm">
                        Baca Selengkapnya <ArrowRight size={16} />
                    </div>
                </div>
            </div>
        )}

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 sticky top-20 z-40 bg-[#FAFAFA]/95 backdrop-blur-sm py-4 border-b border-transparent md:border-gray-200/50">
            {/* Filter Tabs */}
            <div className="flex p-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto no-scrollbar w-full md:w-auto">
                {['All', 'Teknologi', 'Update', 'Tutorial'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${filter === f ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        {f === 'All' ? 'Semua' : f}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Cari artikel..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-medium text-sm"
                />
            </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, i) => (
                <div 
                    key={post.id} 
                    onClick={() => onReadArticle(post.id)}
                    className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full animate-in fade-in slide-in-from-bottom-8"
                    style={{ animationDelay: `${i * 100}ms` }}
                >
                    <div className="h-48 overflow-hidden relative">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-4 left-4">
                             <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm border ${
                                 post.tag === 'Update' ? 'bg-green-100 text-green-700 border-green-200' :
                                 post.tag === 'Tutorial' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                 'bg-white text-gray-900 border-gray-100'
                             }`}>
                                {post.tag}
                             </span>
                        </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-3 text-xs font-bold text-gray-400 mb-3">
                            <span className="flex items-center gap-1"><Calendar size={12}/> {post.date}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>{post.readTime}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-purple-600 transition-colors line-clamp-2">
                            {post.title}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4 flex-1">
                            {post.excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-bold text-purple-600 group-hover:gap-3 transition-all mt-auto">
                            Baca Artikel <ArrowRight size={14} />
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {filteredPosts.length === 0 && (
            <div className="text-center py-20 animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Search size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Artikel tidak ditemukan</h3>
                <p className="text-gray-500 max-w-xs mx-auto mt-2">Coba kata kunci lain atau ganti filter kategori.</p>
                {/* Reset Filter Button */}
                {(searchQuery || filter !== 'All') && (
                    <button 
                        onClick={() => { setSearchQuery(''); setFilter('All'); }}
                        className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-black transition-colors"
                    >
                        Reset Filter
                    </button>
                )}
            </div>
        )}

      </main>
    </div>
  );
};

export default BlogPage;
