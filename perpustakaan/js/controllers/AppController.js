class AppController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Binding Event dari View ke Handler Controller
        this.view.bindLogin(this.handleLogin.bind(this));
        this.view.bindLogout(this.handleLogout.bind(this));
        this.view.bindSearch(this.handleSearch.bind(this));
        
        // Peminjaman Baru
        this.view.bindInitiateBorrow(this.handleInitiateBorrow.bind(this));
        this.view.bindSubmitBorrow(this.handleSubmitBorrow.bind(this));
        this.view.bindCancelBorrow();

        // Edit dan Kembali
        this.view.bindEditBorrowed(this.handleEditBorrowed.bind(this));
        this.view.bindReturnBook(this.handleReturnBook.bind(this));
        this.view.bindSaveEdit(this.handleSaveEdit.bind(this));
        this.view.bindCancelEdit(this.handleCancelEdit.bind(this));
        
        // Aksi Tambahan
        this.view.bindProcessQueue(this.handleProcessQueue.bind(this));
        this.view.bindUndoAction(this.handleUndoAction.bind(this));
        
        // Layanan Interaktif Chat
        this.view.bindChat(this.handleChat.bind(this));

        // Jurnal Download/Baca & E-Book
        this.view.bindReadJournal(this.handleReadJournal.bind(this));
        this.view.bindReadEbook(this.handleReadEbook.bind(this));

        // Muat Data Awal
        this.refreshData();
    }

    refreshData() {
        this.view.renderBooks(this.model.searchBooks(''));
        this.view.renderBorrowedList(this.model.getBorrowedBooks());
        this.view.renderQueue(this.model.getQueue());
    }

    handleLogin(username, password) {
        if (this.model.login(username, password)) {
            this.view.showDashboard(username);
            this.refreshData();
        } else {
            this.view.showToast('Kredensial tidak valid. Masukkan teks apa saja.', true);
        }
    }

    handleLogout() {
        this.model.logout();
        this.view.showLogin();
    }

    handleSearch(query, category) {
        const results = this.model.searchBooks(query, category);
        this.view.renderBooks(results);
        this.view.showToast(`Pencarian selesai. Ditemukan ${results.length} buku.`);
    }

    handleInitiateBorrow(bookId, bookTitle) {
        this.view.showBorrowForm(bookId, bookTitle);
    }

    handleSubmitBorrow(bookId, borrower, borrowDate, returnDate) {
        const success = this.model.borrowBook(bookId, borrower, borrowDate, returnDate);
        if (success) {
            this.view.hideBorrowForm();
            this.refreshData();
            this.view.showToast(`Buku berhasil dipinjam dan dimasukkan ke Linked List.`);
        } else {
            this.view.showToast('Gagal meminjam buku. Mungkin sudah dipinjam.', true);
        }
    }

    handleEditBorrowed(id) {
        const bookData = this.model.getBorrowedBookById(id);
        if (bookData) {
            this.view.showEditForm(bookData);
        }
    }

    handleReturnBook(id) {
        const returned = this.model.returnBook(id);
        if (returned) {
            this.refreshData();
            this.view.showToast(`Buku "${returned.bookTitle}" berhasil dikembalikan.`);
        }
    }

    handleSaveEdit(id, newDetails) {
        const success = this.model.updateBorrowedBook(id, newDetails);
        if (success) {
            this.view.hideEditForm();
            this.refreshData();
            this.view.showToast('Perubahan disimpan. Riwayat lama masuk ke Stack (Undo).');
        } else {
            this.view.showToast('Gagal memperbarui data.', true);
        }
    }

    handleCancelEdit() {
        // Cukup menyembunyikan form melalui View binding internal
    }

    handleProcessQueue() {
        if (this.model.reservationQueue.isEmpty()) {
            this.view.showToast('Antrean kosong!', true);
            return;
        }
        
        const processed = this.model.processNextInQueue();
        if (processed) {
            this.refreshData();
            this.view.showToast(`Antrean diproses: ${processed.user} meminjam "${processed.bookTitle}".`);
        }
    }

    handleUndoAction() {
        const undone = this.model.undoLastAction();
        if (undone) {
            this.refreshData();
            this.view.showToast('Aksi dibatalkan (Pop dari Stack). Data dikembalikan.');
        } else {
            this.view.showToast('Tidak ada aksi yang bisa dibatalkan di Stack.', true);
        }
    }

    async handleChat(message) {
        this.view.showTypingIndicator();

        try {
            // Context injection for the AI
            const context = "Anda adalah E-Library AI, seorang asisten perpustakaan virtual yang cerdas, ramah, dan profesional. Anda bertugas membantu penjaga perpustakaan mengelola buku, memberi ide koleksi buku baru, dan memberikan informasi seputar literatur. Jawablah secara singkat dan padat dalam Bahasa Indonesia. Jika ditanya tentang koleksi, sebutkan bahwa saat ini ada Sejarah, Novel, Pengembangan Diri, dan Sains.";
            
            // Build the prompt
            const prompt = encodeURIComponent(`${context}\n\nUser: ${message}\nE-Library AI:`);
            
            // Fetch from free AI endpoint
            const response = await fetch(`https://text.pollinations.ai/${prompt}`);
            
            if (!response.ok) throw new Error("API Network Error");
            
            const textResponse = await response.text();
            
            this.view.removeTypingIndicator();
            this.view.addChatMessage(textResponse, 'bot');
            
        } catch (error) {
            // Fallback if no internet or API is down
            console.warn("AI API failed, using local fallback.", error);
            
            const lowerMsg = message.toLowerCase();
            let response = '';

            setTimeout(() => {
                if (lowerMsg.includes('ide') || lowerMsg.includes('tambah') || lowerMsg.includes('rekomendasi')) {
                    const randomCategories = ['Novel', 'Sejarah', 'Pengembangan Diri', 'Sains'];
                    const randomCat = randomCategories[Math.floor(Math.random() * randomCategories.length)];
                    const categoryBooks = this.model.searchBooks('', randomCat);
                    
                    if (categoryBooks.length > 0) {
                        const randomBook = categoryBooks[Math.floor(Math.random() * categoryBooks.length)];
                        response = `Saya merekomendasikan Anda untuk mengeksplorasi kategori **${randomCat}**. Sebagai referensi, buku seperti **"${randomBook.title}"** sangat digemari saat ini. Ada genre spesifik yang Anda butuhkan?`;
                    } else {
                        response = 'Coba tambahkan literatur klasik atau fiksi ilmiah yang sedang tren minggu ini!';
                    }
                } else if (lowerMsg.includes('kategori')) {
                    response = 'Saat ini perpustakaan memiliki kategori: Sejarah, Novel, Pengembangan Diri, dan Sains. Ingin info lebih spesifik?';
                } else if (lowerMsg.includes('halo') || lowerMsg.includes('hai')) {
                    response = 'Halo, Pustakawan! Saya Asisten AI Perpustakaan Anda. Ada yang bisa saya bantu terkait pengelolaan hari ini?';
                } else if (lowerMsg.includes('peminjam') || lowerMsg.includes('laporan')) {
                    const totalBorrowed = this.model.getBorrowedBooks().length;
                    response = `Laporan kilat: Terdapat **${totalBorrowed}** buku yang berstatus sedang dipinjam saat ini. Anda dapat mengecek detailnya di tab "Katalog Buku Fisik".`;
                } else {
                    response = 'Baik. Saya di sini untuk membantu memberikan rekomendasi, mengidentifikasi tren bacaan, atau memandu Anda dalam sistem perpustakaan ini.';
                }

                this.view.removeTypingIndicator();
                this.view.addChatMessage(response, 'bot');
            }, 800);
        }
    }

    handleReadJournal(title) {
        this.view.showJournalModal(title);
        
        // Simulate download/loading delay
        setTimeout(() => {
            let theoryContent = '';
            
            // Generate theoretical content based on the title
            if (title.includes('Struktur Data')) {
                theoryContent = `
                    <h4>1. Abstrak</h4>
                    <p>Struktur data merupakan komponen esensial dalam pengembangan aplikasi modern, termasuk aplikasi berbasis web (frontend maupun backend). Penelitian ini berfokus pada implementasi Array, Stack, Queue, dan Linked List menggunakan JavaScript murni.</p>
                    <hr>
                    <h4>2. Landasan Teori</h4>
                    <p><strong>Array</strong> digunakan untuk menyimpan sekumpulan objek dalam indeks terstruktur. Dalam web, ini dipakai untuk katalog dan filter (seperti metode <em>.filter()</em> dan <em>.find()</em>).<br><br>
                    <strong>Linked List</strong> sangat efisien untuk operasi penyisipan dan penghapusan dinamis tanpa menggeser elemen memori, digunakan secara luas untuk mencatat status objek (seperti daftar buku yang sedang dipinjam).<br><br>
                    <strong>Queue (Antrean)</strong> mengadopsi prinsip <em>FIFO (First In First Out)</em>. Teori ini diimplementasikan untuk sistem reservasi buku, di mana pengunjung pertama akan dilayani pertama.<br><br>
                    <strong>Stack (Tumpukan)</strong> mengadopsi prinsip <em>LIFO (Last In First Out)</em>. Konsep ini digunakan untuk manajemen state, contoh konkritnya adalah fitur <em>Undo (Ctrl+Z)</em> untuk membatalkan pengeditan data.</p>
                    <hr>
                    <h4>3. Kesimpulan</h4>
                    <p>Penggunaan struktur data kustom dalam JavaScript memberikan fleksibilitas tanpa harus bergantung pada pustaka eksternal, membuat web lebih cepat dan pengelolaan memori lebih efisien pada aplikasi berarsitektur MVC.</p>
                `;
            } else if (title.includes('MVC')) {
                theoryContent = `
                    <h4>1. Konsep Model-View-Controller (MVC)</h4>
                    <p>MVC adalah pola arsitektur perangkat lunak yang memisahkan aplikasi menjadi tiga komponen logika utama: Model, View, dan Controller. Setiap komponen dibangun untuk menangani aspek pengembangan tertentu.</p>
                    <ul>
                        <li><strong>Model:</strong> Mengelola struktur data, logika dasar, dan aturan aplikasi.</li>
                        <li><strong>View:</strong> Menangani presentasi data dan elemen antarmuka pengguna (UI/DOM).</li>
                        <li><strong>Controller:</strong> Berperan sebagai jembatan yang menerima input (event) dari View, memprosesnya melalui Model, dan memperbarui View kembali.</li>
                    </ul>
                    <p>Dalam JavaScript Vanilla, MVC membantu menjaga kode tetap rapi (Separation of Concerns) sehingga aplikasi mudah dirawat (maintainable).</p>
                `;
            } else if (title.includes('Kecerdasan Buatan')) {
                theoryContent = `
                    <h4>1. Integrasi Generative AI</h4>
                    <p>Kecerdasan Buatan (AI) tipe generatif seperti LLM (Large Language Models) memungkinkan sistem untuk mensimulasikan percakapan mirip manusia. Alih-alih merespons dengan kata kunci kaku (if-else statis), AI menggunakan pemrosesan bahasa alami (NLP) untuk memahami maksud (intent) dan memberikan jawaban kontekstual.</p>
                    <p>Implementasi AI melalui REST API (seperti text.pollinations.ai) memungkinkan aplikasi frontend-only memiliki kapabilitas cerdas tanpa harus melatih model sendiri secara lokal.</p>
                `;
            } else {
                theoryContent = `
                    <h4>1. Ringkasan Dokumen</h4>
                    <p>Artikel ini membahas perkembangan terbaru dalam ranah teknologi informasi, berfokus pada integrasi sistem yang efisien dan optimalisasi algoritma perangkat lunak.</p>
                    <h4>2. Pembahasan Utama</h4>
                    <p>Penerapan praktik terbaik (best practices) mencakup pemisahan logika bisnis dari UI, penerapan pola desain yang teruji, dan penggunaan struktur arsitektur yang menjamin skalabilitas aplikasi pada saat menangani ratusan hingga ribuan entri data.</p>
                    <h4>3. Hasil</h4>
                    <p>Pendekatan terstruktur terbukti memangkas waktu load aplikasi dan meminimalkan kebocoran memori (memory leak) di sisi browser pengguna.</p>
                `;
            }
            
            this.view.updateJournalContent(theoryContent);
        }, 1200); // 1.2 detik delay agar terlihat seperti benar-benar mengunduh dan membaca
    }

    handleReadEbook(title) {
        this.view.showEbookModal(title);
        
        // Simulate e-book opening delay
        setTimeout(() => {
            let ebookContent = '';
            
            if (title.toLowerCase().includes('javascript') || title.toLowerCase().includes('react')) {
                ebookContent = `
                    <h4>Bab 1: Pendahuluan Pemrograman Web Dasar</h4>
                    <p>JavaScript adalah bahasa pemrograman tingkat tinggi dan dinamis yang memberikan nyawa pada halaman web. Berbeda dengan HTML yang memberikan kerangka dan CSS yang mengatur tampilan, JavaScript memungkinkan interaktivitas.</p>
                    <p><strong>Topik Pembahasan:</strong></p>
                    <ul>
                        <li>Konsep Variabel, Konstanta, dan Scope (Let, Const, Var)</li>
                        <li>Fungsi asinkron (Async/Await) dan Pengelolaan DOM</li>
                        <li>Implementasi modern Web Frameworks</li>
                    </ul>
                    <hr>
                    <p style="text-align:center;"><em>-- Pratinjau Bab 1 Selesai --<br>Untuk membaca buku lengkap, Anda harus berlangganan versi premium.</em></p>
                `;
            } else if (title.toLowerCase().includes('ui/ux') || title.toLowerCase().includes('css')) {
                ebookContent = `
                    <h4>Bab 1: Filosofi Desain Antarmuka Pengguna</h4>
                    <p>UI (User Interface) dan UX (User Experience) bukan hanya tentang membuat aplikasi terlihat menarik, tetapi bagaimana membuatnya mudah dipahami dan digunakan secara intuitif oleh pengguna.</p>
                    <p><strong>Topik Pembahasan:</strong></p>
                    <ul>
                        <li>Tipografi dan Psikologi Warna</li>
                        <li>Sistem Grid, Flexbox, dan Tata Letak Responsif</li>
                        <li>Prototyping, Wireframing, dan Pengujian Pengguna</li>
                    </ul>
                    <hr>
                    <p style="text-align:center;"><em>-- Pratinjau Bab 1 Selesai --<br>Dapatkan akses penuh untuk membaca bab selanjutnya.</em></p>
                `;
            } else if (title.toLowerCase().includes('python') || title.toLowerCase().includes('machine learning')) {
                ebookContent = `
                    <h4>Bab 1: Pengantar Algoritma dan Komputasi</h4>
                    <p>Python telah menjadi standar industri untuk analisis data, kecerdasan buatan, dan komputasi sains berkat sintaksnya yang elegan dan komunitas yang masif.</p>
                    <p><strong>Topik Pembahasan:</strong></p>
                    <ul>
                        <li>Pengolahan Data Frame (Pandas) dan NumPy</li>
                        <li>Algoritma Dasar Pembelajaran Mesin (Supervised vs Unsupervised)</li>
                        <li>Prediksi Pola Data menggunakan Model Regresi Linear</li>
                    </ul>
                    <hr>
                    <p style="text-align:center;"><em>-- Pratinjau Bab 1 Selesai --<br>Akses seluruh bab dengan mendaftar sebagai anggota penuh.</em></p>
                `;
            } else {
                ebookContent = `
                    <h4>Kata Pengantar dan Pendahuluan</h4>
                    <p>Buku ini dirancang sebagai referensi komprehensif untuk memahami fundamental hingga tingkat mahir dalam bidang yang bersangkutan. Bab awal ini akan memperkenalkan Anda pada terminologi dasar, konsep inti, dan relevansi subjek dalam industri teknologi modern.</p>
                    <hr>
                    <p style="text-align:center;"><em>-- Pratinjau E-Book Gratis Selesai --<br>Silakan bergabung menjadi anggota premium perpustakaan untuk membaca hingga tamat.</em></p>
                `;
            }
            
            this.view.updateJournalContent(ebookContent);
        }, 1500); // 1.5 detik loading buku
    }
}
