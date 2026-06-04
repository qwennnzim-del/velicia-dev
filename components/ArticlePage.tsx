import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2, Clock, ChevronRight, Check, Tag } from 'lucide-react';

export interface ArticleData {
  id: number;
  title: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  tag: 'Update' | 'Teknologi' | 'Visi' | 'News' | 'Tutorial';
  content: string; // HTML string for rich text
  excerpt?: string;
}

// Data Artikel Lengkap (Expanded for SEO & Support Pages)
export const BLOG_POSTS: ArticleData[] = [
  {
      id: 4, 
      title: "Velicia Resmi Mengganti Library ke Gen2: Era Baru Kecerdasan AI",
      date: "12 Feb 2026",
      author: "M. Fariz Alfauzi",
      readTime: "3 menit baca",
      tag: "Teknologi",
      image: "/thumbnail-gen2.png", 
      excerpt: "Transformasi fundamental pada mesin kecerdasan kami membawa penalaran mendalam dan efisiensi tinggi.",
      content: `
        <p class="lead">Kami dengan bangga mengumumkan bahwa per hari ini, Velicia AI telah sepenuhnya bermigrasi ke arsitektur <strong>Gen2</strong>. Ini bukan sekadar pembaruan versi, melainkan transformasi fundamental pada mesin kecerdasan kami.</p>

        <h3>Apa yang Baru di Gen2?</h3>
        <p>Gen2 membawa peningkatan drastis dalam tiga aspek utama:</p>
        <ul>
            <li><strong>Deep Reasoning (Penalaran Mendalam):</strong> Velicia kini mampu memecahkan masalah kompleks dengan melakukan proses "berpikir" sebelum menjawab, menghasilkan solusi yang lebih logis dan terstruktur.</li>
            <li><strong>Kecepatan Eksekusi:</strong> Latensi berkurang hingga 40%. Jawaban kini hadir hampir instan tanpa mengorbankan kualitas.</li>
            <li><strong>Efisiensi Token:</strong> Pemrosesan konteks yang lebih hemat memori, memungkinkan percakapan panjang yang lebih koheren tanpa "lupa" detail awal.</li>
        </ul>

        <h3>Dampak Bagi Pengguna</h3>
        <p>Bagi pengguna setia kami, ini berarti pengalaman yang lebih mulus. Baik Anda menggunakan Velicia untuk coding, penulisan kreatif, atau analisis data, Anda akan merasakan respons yang lebih tajam dan manusiawi.</p>

        <blockquote>"Gen2 adalah langkah besar menuju visi kami menciptakan AI yang tidak hanya menjawab, tetapi juga memahami." — Tim Pengembang Velicia.</blockquote>
      `
  },
  {
    id: 101,
    title: "Update Log v1.2: Mode Suara & Analisis Dokumen",
    date: "10 Feb 2026",
    author: "Tim Teknis Velicia",
    readTime: "2 menit baca",
    tag: "Update",
    image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=2000&auto=format&fit=crop",
    excerpt: "Pembaruan Februari membawa fitur Text-to-Speech (TTS) dan kemampuan membaca file PDF/Excel.",
    content: `
      <h3>Apa yang Baru di v1.2?</h3>
      <p>Kami mendengarkan masukan Anda! Versi 1.2 hadir dengan fitur yang paling banyak diminta oleh komunitas pengguna Velicia.</p>
      
      <h4>1. Interaksi Suara (TTS)</h4>
      <p>Velicia kini bisa berbicara! Tekan ikon speaker di bawah setiap pesan balasan untuk mendengarkan jawaban Velicia dalam Bahasa Indonesia yang natural.</p>

      <h4>2. Analisis Dokumen Multi-Format</h4>
      <p>Kini Anda bisa mengunggah file:</p>
      <ul>
        <li><strong>PDF & DOCX:</strong> Untuk ringkasan dokumen legal atau jurnal.</li>
        <li><strong>Excel & CSV:</strong> Untuk analisis data cepat.</li>
      </ul>

      <h4>3. Perbaikan Bug</h4>
      <ul>
        <li>Memperbaiki masalah scroll otomatis pada mobile.</li>
        <li>Optimasi rendering markdown pada tabel.</li>
      </ul>
    `
  },
  {
    id: 100,
    title: "Update Log v1.0: Lahirnya Asisten Digital Nusantara",
    date: "28 Jan 2026",
    author: "M. Fariz Alfauzi",
    readTime: "4 menit baca",
    tag: "Update",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2000&auto=format&fit=crop",
    excerpt: "Rilis publik pertama Velicia AI. Membawa visi kedaulatan digital ke tangan pengguna Indonesia.",
    content: `
      <p>Hari ini menandai tonggak sejarah baru. Velicia v1.0 resmi dirilis ke publik sebagai platform Beta Terbuka.</p>
      
      <h3>Fitur Peluncuran:</h3>
      <ul>
        <li><strong>Chat Cerdas:</strong> Didukung model bahasa yang dioptimalkan untuk Bahasa Indonesia.</li>
        <li><strong>Google Search Integration:</strong> Mendapatkan informasi terkini secara real-time.</li>
        <li><strong>Antarmuka Minimalis:</strong> Fokus pada konten dan kemudahan penggunaan.</li>
      </ul>
      
      <p>Terima kasih kepada para beta tester yang telah membantu kami menyempurnakan versi ini.</p>
    `
  },
  {
    id: 3, 
    title: "Peluncuran Velicia AI Asisten Cerdas Indonesia",
    date: "28 Jan 2026",
    author: "Dwi Putri",
    readTime: "7 menit baca",
    tag: "News",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2000&auto=format&fit=crop",
    excerpt: "Rapat strategis dan roadmap pengembangan Velicia menuju 2028.",
    content: `
      <p class="lead">Hari ini, 28 Januari 2026, menjadi titik awal perjalanan ambisius kami. Dalam rapat strategis tertutup yang dihadiri oleh seluruh jajaran pengembang dan pemangku kepentingan, Velicia AI secara resmi diperkenalkan sebagai proyek unggulan nasional.</p>
      
      <h3>Hasil Rapat & Voting Internal</h3>
      <p>Rapat yang dinotulensikan oleh tim sekretariat hari ini menghasilkan keputusan mutlak. Melalui proses voting yang demokratis namun ketat, nama <strong>"Velicia"</strong> dipilih karena merepresentasikan kecepatan (Velocity) dan kecerdasan (Intelligence) yang berakar pada identitas Indonesia.</p>

      <p>Kami menyepakati visi bersama: <em>Membangun kedaulatan AI tanpa bergantung pada infrastruktur asing.</em></p>
    `
  },
  {
    id: 0,
    title: "Visi Kedaulatan Digital: Mengapa AI Mandiri Penting?",
    date: "12 Okt 2025",
    author: "M. Fariz Alfauzi",
    readTime: "5 menit baca",
    tag: "Visi",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2000&auto=format&fit=crop",
    excerpt: "Mengapa Indonesia membutuhkan infrastruktur AI sendiri? Sebuah opini mendalam.",
    content: `
      <p class="lead">Di tengah gempuran teknologi global, pertanyaannya bukan lagi "apakah kita bisa?", melainkan "kapan kita mandiri?". Velicia AI hadir sebagai jawaban atas tantangan kedaulatan digital Indonesia.</p>
      
      <h3>Tantangan Era Digital</h3>
      <p>Ketergantungan pada penyedia layanan AI asing membawa risiko tersendiri, mulai dari privasi data hingga bias budaya. Model bahasa besar (LLM) yang dilatih dengan data barat seringkali gagal menangkap nuansa lokal, etika, dan konteks sosial masyarakat Indonesia.</p>
      
      <p>Velicia dibangun dengan filosofi <strong>"Dari Indonesia, Untuk Indonesia"</strong>.</p>
    `
  },
  {
    id: 5,
    title: "Tutorial: Mengoptimalkan Prompt untuk Hasil Terbaik",
    date: "15 Feb 2026",
    author: "Tim Edukasi",
    readTime: "5 menit baca",
    tag: "Tutorial",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2000&auto=format&fit=crop",
    excerpt: "Panduan praktis menyusun perintah agar Velicia memberikan jawaban yang paling akurat dan relevan.",
    content: `
      <p>AI hanyalah alat, dan kualias outputnya sangat bergantung pada input Anda. Berikut adalah teknik "Prompt Engineering" sederhana untuk pengguna Velicia.</p>

      <h3>Rumus Prompt Efektif</h3>
      <p>Gunakan struktur: <strong>Konteks + Instruksi + Format Output</strong>.</p>
      <p><em>Contoh Buruk:</em> "Buatkan surat lamaran kerja."</p>
      <p><em>Contoh Baik:</em> "Saya fresh graduate jurusan Akuntansi (Konteks). Buatkan surat lamaran kerja untuk posisi Staff Finance di perusahaan startup (Instruksi). Gunakan bahasa formal namun antusias (Tone)."</p>
    `
  }
];

const AuthorCard: React.FC<{ author: string, role: string }> = ({ author, role }) => (
  <div className="mt-12 p-6 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-3xl flex items-center gap-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
    <div className="absolute -top-6 -right-6 p-2 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
       <img src="/logo-app.png" className="h-32 w-auto" alt="Watermark" />
    </div>
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-black text-2xl z-10 shadow-lg shadow-blue-200">
       {author.charAt(0)}
    </div>
    <div className="z-10">
       <div className="flex items-center gap-2 mb-1">
         <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
         <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Penulis Resmi</span>
       </div>
       <h3 className="text-xl font-black text-gray-900 leading-none mb-1.5">{author}</h3>
       <p className="text-sm font-bold text-gray-500">{role}</p>
    </div>
  </div>
);

const ArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{id: string}>();
  const articleId = Number(id);
  const article = BLOG_POSTS.find(p => p.id === articleId) || BLOG_POSTS[0];
  const [copied, setCopied] = useState(false);

  const onBack = () => navigate(-1);
  const onReadArticle = (newId: number) => navigate(`/article/${newId}`);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [articleId]);

  const handleShare = async () => {
      const shareData = {
          title: article.title,
          text: `Baca artikel ini di Velicia AI: ${article.title}`,
          url: window.location.href 
      };

      if (navigator.share) {
          try {
              await navigator.share(shareData);
          } catch (err) {
              console.log('Error sharing', err);
          }
      } else {
          navigator.clipboard.writeText(`${article.title} - Baca di Velicia AI`);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      {/* Navbar Minimalis */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 h-16 flex items-center px-4 md:px-6 justify-between transition-all">
         <button 
           onClick={onBack}
           className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-2 pr-4"
         >
            <ArrowLeft size={20} />
            <span className="font-bold text-sm">Kembali</span>
         </button>
         <div className="flex items-center gap-2">
            <img src="/logo-app.png" alt="Logo" className="h-8 w-auto object-contain" />
            <span className="font-bold text-lg tracking-tight text-gray-900">Velicia</span>
         </div>
         <button 
            onClick={handleShare}
            className="p-2 text-gray-400 hover:text-[#7928CA] transition-colors relative"
         >
            {copied ? <Check size={20} className="text-green-500"/> : <Share2 size={20} />}
         </button>
      </nav>

      <main className="pt-24 max-w-3xl mx-auto px-6">
        {/* Header Artikel */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
              <span className={`px-2 py-1 rounded-md border text-[10px] ${
                  article.tag === 'Update' ? 'bg-green-50 text-green-700 border-green-100' : 
                  article.tag === 'Teknologi' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                  'bg-purple-50 text-purple-700 border-purple-100'
              }`}>
                {article.tag}
              </span>
              <span className="flex items-center gap-1"><Calendar size={12}/> {article.date}</span>
              <span className="flex items-center gap-1"><Clock size={12}/> {article.readTime}</span>
           </div>
           
           <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tight pb-1">
             {article.title}
           </h1>

           <div className="flex items-center gap-3 pb-8 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600">
                 <User size={20} />
              </div>
              <div>
                 <div className="text-sm font-bold text-gray-900">{article.author}</div>
                 <div className="text-xs text-gray-500 font-medium">Velicia AI Team</div>
              </div>
           </div>
        </div>

        {/* Gambar Utama */}
        <div className="rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 mb-10 aspect-video relative animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
           <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        {/* Konten Artikel */}
        <article className="prose prose-lg prose-slate max-w-none 
           prose-headings:font-black prose-headings:tracking-tight prose-headings:text-gray-900
           prose-p:text-gray-600 prose-p:leading-relaxed prose-p:font-medium
           prose-strong:text-gray-900 prose-strong:font-bold
           prose-blockquote:border-l-4 prose-blockquote:border-[#FF0080] prose-blockquote:text-xl prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-gray-800 prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:pr-4
           prose-li:text-gray-600 prose-li:font-medium
           prose-img:rounded-2xl
           animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200
        ">
           <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>

        {/* Author Card Component */}
        <AuthorCard author={article.author} role="Velicia AI Contributor" />

        {/* Footer Artikel */}
        <div className="mt-16 pt-10 border-t border-gray-100">
           <h3 className="text-xl font-bold mb-6">Artikel Lainnya</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BLOG_POSTS.filter(p => p.id !== article.id).slice(0, 2).map((post) => (
                 <button 
                    key={post.id} 
                    onClick={() => {
                        window.scrollTo(0,0);
                        onReadArticle(post.id); 
                    }}
                    className="flex gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all text-left group"
                 >
                    <img src={post.image} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
                    <div>
                       <div className="text-[10px] font-bold text-[#7928CA] uppercase mb-1">{post.tag}</div>
                       <h4 className="font-bold text-gray-900 leading-tight mb-1 group-hover:text-[#FF0080] transition-colors line-clamp-2">{post.title}</h4>
                       <div className="text-xs text-gray-400 font-medium">{post.readTime}</div>
                    </div>
                 </button>
              ))}
           </div>
        </div>
      </main>
    </div>
  );
};

export default ArticlePage;