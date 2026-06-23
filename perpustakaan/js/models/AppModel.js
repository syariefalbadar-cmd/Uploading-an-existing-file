class AppModel {
    constructor() {
        // Struktur Data (Data Structures)
        
        // 1. Array: Katalog buku (Bisa memuat kategori: Sejarah, Novel, dll)
        this.booksArray = [
            // Kategori: Sejarah
            { id: 1, title: 'Sejarah Nasional Indonesia Jilid 1', author: 'Sartono Kartodirdjo', category: 'Sejarah', available: true },
            { id: 2, title: 'Sejarah Nasional Indonesia Jilid 2', author: 'Sartono Kartodirdjo', category: 'Sejarah', available: true },
            { id: 3, title: 'Sapiens: Riwayat Singkat Umat Manusia', author: 'Yuval Noah Harari', category: 'Sejarah', available: true },
            { id: 4, title: 'Guns, Germs, and Steel', author: 'Jared Diamond', category: 'Sejarah', available: true },
            { id: 5, title: 'Nusantara: Sejarah Indonesia', author: 'Bernard H.M. Vlekke', category: 'Sejarah', available: true },
            { id: 6, title: 'A People\'s History of the World', author: 'Chris Harman', category: 'Sejarah', available: true },
            { id: 7, title: 'Homo Deus: Masa Depan Umat Manusia', author: 'Yuval Noah Harari', category: 'Sejarah', available: true },
            { id: 8, title: 'Sejarah Dunia yang Disembunyikan', author: 'Jonathan Black', category: 'Sejarah', available: true },

            // Kategori: Novel
            { id: 9, title: 'Laskar Pelangi', author: 'Andrea Hirata', category: 'Novel', available: true },
            { id: 10, title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', category: 'Novel', available: true },
            { id: 11, title: 'Ronggeng Dukuh Paruk', author: 'Ahmad Tohari', category: 'Novel', available: true },
            { id: 12, title: 'Cantik Itu Luka', author: 'Eka Kurniawan', category: 'Novel', available: true },
            { id: 13, title: 'Gadis Kretek', author: 'Ratih Kumala', category: 'Novel', available: true },
            { id: 14, title: 'Pulang', author: 'Leila S. Chudori', category: 'Novel', available: true },
            { id: 15, title: 'Laut Bercerita', author: 'Leila S. Chudori', category: 'Novel', available: true },
            { id: 16, title: 'Supernova: Ksatria, Puteri, dan Bintang Jatuh', author: 'Dee Lestari', category: 'Novel', available: true },

            // Kategori: Pengembangan Diri
            { id: 17, title: 'Filosofi Teras', author: 'Henry Manampiring', category: 'Pengembangan Diri', available: false },
            { id: 18, title: 'Atomic Habits', author: 'James Clear', category: 'Pengembangan Diri', available: true },
            { id: 19, title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson', category: 'Pengembangan Diri', available: true },
            { id: 20, title: 'Bicara Itu Ada Seninya', author: 'Oh Su Hyang', category: 'Pengembangan Diri', available: true },
            { id: 21, title: 'Sebuah Seni untuk Bersikap Bodo Amat', author: 'Mark Manson', category: 'Pengembangan Diri', available: true },
            { id: 22, title: 'Berani Tidak Disukai', author: 'Ichiro Kishimi', category: 'Pengembangan Diri', available: true },
            { id: 23, title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', category: 'Pengembangan Diri', available: true },
            { id: 24, title: 'Rich Dad Poor Dad', author: 'Robert T. Kiyosaki', category: 'Pengembangan Diri', available: true },

            // Kategori: Sains
            { id: 25, title: 'Kosmos', author: 'Carl Sagan', category: 'Sains', available: true },
            { id: 26, title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Sains', available: true },
            { id: 27, title: 'The Selfish Gene', author: 'Richard Dawkins', category: 'Sains', available: true },
            { id: 28, title: 'Fisika Kuantum untuk Pemula', author: 'John Gribbin', category: 'Sains', available: true },
            { id: 29, title: 'Asal Usul Spesies (The Origin of Species)', author: 'Charles Darwin', category: 'Sains', available: true },
            { id: 30, title: 'Bumi yang Gelisah', author: 'Richard Fortey', category: 'Sains', available: true },
            { id: 31, title: 'Misteri Alam Semesta', author: 'Neil deGrasse Tyson', category: 'Sains', available: true },
            { id: 32, title: 'Sejarah Waktu', author: 'Stephen Hawking', category: 'Sains', available: true }
        ];
        
        // 2. Linked List: Peminjaman Aktif
        this.borrowedList = new LinkedList();
        
        // Data awal peminjaman (Mock Data)
        this.borrowedList.append({
            id: 101,
            bookId: 5,
            bookTitle: 'Filosofi Teras',
            borrower: 'Budi Santoso',
            borrowDate: '2023-10-01',
            returnDate: '2023-10-15'
        });

        // 3. Queue: Antrean untuk buku populer
        this.reservationQueue = new Queue();
        this.reservationQueue.enqueue({ id: 201, user: 'Siti Aminah', bookId: 1, bookTitle: 'Sejarah Nasional Indonesia' });
        this.reservationQueue.enqueue({ id: 202, user: 'Ahmad Dahlan', bookId: 2, bookTitle: 'Laskar Pelangi' });

        // 4. Stack: Riwayat Edit (untuk fitur Undo/Batal)
        this.editHistoryStack = new Stack();
        
        // Status Pengguna
        this.currentUser = null;
    }

    login(username, password) {
        if (username.length > 0 && password.length > 0) {
            this.currentUser = username;
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser = null;
    }

    // --- Operasi Array ---
    searchBooks(query, categoryFilter = '') {
        let results = this.booksArray;
        
        if (categoryFilter) {
            results = results.filter(book => book.category === categoryFilter);
        }
        
        if (query) {
            const lowerQuery = query.toLowerCase();
            results = results.filter(book => 
                book.title.toLowerCase().includes(lowerQuery) || 
                book.author.toLowerCase().includes(lowerQuery) ||
                book.category.toLowerCase().includes(lowerQuery)
            );
        }
        
        return results;
    }

    getBookById(id) {
        return this.booksArray.find(b => b.id === id);
    }

    // --- Peminjaman Buku Baru ---
    borrowBook(bookId, borrower, borrowDate, returnDate) {
        const book = this.getBookById(bookId);
        if (book && book.available) {
            const newBorrowId = Date.now();
            
            this.borrowedList.append({
                id: newBorrowId,
                bookId: book.id,
                bookTitle: book.title,
                borrower: borrower,
                borrowDate: borrowDate,
                returnDate: returnDate
            });
            
            // Perbarui status ketersediaan di Array
            book.available = false;
            return true;
        }
        return false;
    }

    // --- Operasi Linked List ---
    getBorrowedBooks() {
        return this.borrowedList.toArray();
    }

    getBorrowedBookById(id) {
        return this.borrowedList.findById(id);
    }

    updateBorrowedBook(id, newDetails) {
        const originalData = { ...this.borrowedList.findById(id) };
        if (originalData && Object.keys(originalData).length > 0) {
            // Push data lama ke Stack untuk fitur Undo
            this.editHistoryStack.push({
                action: 'EDIT_BORROW',
                id: id,
                previousData: originalData
            });
            
            // Perbarui Linked List
            return this.borrowedList.updateById(id, newDetails);
        }
        return false;
    }

    returnBook(id) {
        const removed = this.borrowedList.removeById(id);
        if (removed) {
            // Perbarui status di Array
            const book = this.booksArray.find(b => b.id === removed.bookId);
            if (book) book.available = true;
            return removed;
        }
        return null;
    }

    // --- Operasi Queue (Antrean) ---
    getQueue() {
        return this.reservationQueue.toArray();
    }

    processNextInQueue() {
        if (this.reservationQueue.isEmpty()) return null;
        
        const nextReservation = this.reservationQueue.dequeue();
        
        // Simulasi proses peminjaman
        const newBorrowId = Date.now();
        const borrowDate = new Date().toISOString().split('T')[0];
        
        // Tanggal kembali 14 hari kemudian
        const returnDateObj = new Date();
        returnDateObj.setDate(returnDateObj.getDate() + 14);
        const returnDate = returnDateObj.toISOString().split('T')[0];
        
        this.borrowedList.append({
            id: newBorrowId,
            bookId: nextReservation.bookId,
            bookTitle: nextReservation.bookTitle,
            borrower: nextReservation.user,
            borrowDate: borrowDate,
            returnDate: returnDate
        });
        
        // Perbarui Array
        const book = this.booksArray.find(b => b.id === nextReservation.bookId);
        if (book) book.available = false;

        return nextReservation;
    }

    // --- Operasi Stack (Undo) ---
    undoLastAction() {
        if (this.editHistoryStack.isEmpty()) return null;
        
        const lastAction = this.editHistoryStack.pop();
        
        if (lastAction.action === 'EDIT_BORROW') {
            // Kembalikan perubahan di Linked List
            this.borrowedList.updateById(lastAction.id, lastAction.previousData);
            return lastAction;
        }
        
        return null;
    }
}
