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
