class AppView {
    constructor() {
        // Tampilan
        this.loginView = document.getElementById('login-view');
        this.dashboardView = document.getElementById('dashboard-view');
        
        // Elemen Login
        this.loginForm = document.getElementById('login-form');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        
        // Elemen Sidebar & Tab
        this.userDisplay = document.getElementById('user-display');
        this.profileNameDisplay = document.getElementById('profile-name');
        this.logoutBtn = document.getElementById('logout-btn');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // Elemen Pencarian
        this.searchInput = document.getElementById('search-input');
        this.categoryFilter = document.getElementById('category-filter');
        this.searchBtn = document.getElementById('search-btn');
        
        // Tombol Aksi Dasbor User
        this.undoBtn = document.getElementById('undo-btn');
        this.processQueueBtn = document.getElementById('process-queue-btn');
        
        // Wadah Konten Data Structures
        this.booksContainer = document.getElementById('books-container');
        this.borrowedListContainer = document.getElementById('borrowed-list');
        this.queueListContainer = document.getElementById('queue-list');
        
        // Elemen Form Peminjaman Baru
        this.borrowPanel = document.getElementById('borrow-panel');
        this.borrowForm = document.getElementById('borrow-form');
        this.borrowBookId = document.getElementById('borrow-book-id');
        this.borrowBookTitle = document.getElementById('borrow-book-title');
        this.newBorrower = document.getElementById('new-borrower');
        this.newBorrowDate = document.getElementById('new-borrow-date');
        this.newReturnDate = document.getElementById('new-return-date');
        this.cancelBorrowBtn = document.getElementById('cancel-borrow-btn');

        // Elemen Form Edit
        this.editForm = document.getElementById('edit-form');
        this.editPlaceholder = document.getElementById('edit-placeholder');
        this.editBookId = document.getElementById('edit-book-id');
        this.editBorrower = document.getElementById('edit-borrower');
        this.editBorrowDate = document.getElementById('edit-borrow-date');
        this.editReturnDate = document.getElementById('edit-return-date');
        this.cancelEditBtn = document.getElementById('cancel-edit-btn');
        
        // Toast Notifikasi
        this.toast = document.getElementById('toast');
        this.toastTimeout = null;

        // Elemen Chat
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInputField = document.getElementById('chat-input-field');
        this.chatSendBtn = document.getElementById('chat-send-btn');

        // Elemen Modal Jurnal
        this.journalModal = document.getElementById('journal-modal');
        this.closeJournalModalBtn = document.getElementById('close-journal-modal');
        this.journalModalTitle = document.getElementById('journal-modal-title');
        this.journalModalSubtitle = document.getElementById('journal-modal-subtitle');
        this.journalModalContent = document.getElementById('journal-modal-content');

        this.initTabs();
    }

    // --- Tab Navigation ---
    initTabs() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Remove active classes
                this.navLinks.forEach(l => l.classList.remove('active'));
                this.tabContents.forEach(t => t.classList.remove('active', 'hidden'));
                this.tabContents.forEach(t => t.style.display = 'none');
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Show target tab
                const targetId = link.getAttribute('data-target');
                const targetTab = document.getElementById(targetId);
                targetTab.style.display = 'block';
                setTimeout(() => targetTab.classList.add('active'), 10);
            });
        });
    }

    // --- Manajemen State UI ---
    showDashboard(username) {
        this.loginView.classList.remove('active');
        setTimeout(() => {
            this.loginView.classList.add('hidden');
            this.dashboardView.classList.remove('hidden');
            void this.dashboardView.offsetWidth;
            this.dashboardView.classList.add('active');
        }, 300);
        
        this.userDisplay.textContent = `Halo, ${username}`;
        if(this.profileNameDisplay) this.profileNameDisplay.textContent = username;
        this.showToast('Berhasil masuk!');
    }

    showLogin() {
        this.dashboardView.classList.remove('active');
        setTimeout(() => {
            this.dashboardView.classList.add('hidden');
            this.loginView.classList.remove('hidden');
            void this.loginView.offsetWidth;
            this.loginView.classList.add('active');
            this.loginForm.reset();
        }, 300);
        
        this.showToast('Berhasil keluar dengan aman');
    }

    showToast(message, isError = false) {
        this.toast.textContent = message;
        if (isError) {
            this.toast.classList.add('error');
        } else {
            this.toast.classList.remove('error');
        }
        
        this.toast.classList.add('show');
        
        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
        }
        
        this.toastTimeout = setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }

    // --- Metode Render ---
    renderBooks(books) {
        this.booksContainer.innerHTML = '';
        
        if (books.length === 0) {
            this.booksContainer.innerHTML = '<p class="placeholder-text">Tidak ada buku ditemukan.</p>';
            return;
        }
        
        books.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card';
            
            let actionHtml = '';
            if (book.available) {
                actionHtml = `<button class="btn btn-primary btn-sm btn-block btn-borrow" data-id="${book.id}" data-title="${book.title}" style="margin-top: 10px;">Pinjam Buku Fisik</button>`;
            }

            card.innerHTML = `
                <div class="book-icon">📖</div>
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
                <div style="margin-bottom: 8px;">
                    <span style="font-size: 11px; padding: 2px 6px; border-radius: 4px; background: var(--secondary-color); color: white;">
                        Kategori: ${book.category}
                    </span>
                </div>
                <span style="font-size: 12px; padding: 4px 8px; border-radius: 4px; background: ${book.available ? 'var(--success-color)' : 'var(--danger-color)'}; color: white; display: inline-block;">
                    ${book.available ? 'Tersedia' : 'Dipinjam'}
                </span>
                ${actionHtml}
            `;
            this.booksContainer.appendChild(card);
        });
    }

    renderBorrowedList(borrowedItems) {
        this.borrowedListContainer.innerHTML = '';
        
        if (borrowedItems.length === 0) {
            this.borrowedListContainer.innerHTML = '<li class="placeholder-text">Belum ada peminjaman aktif.</li>';
            return;
        }
        
        borrowedItems.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-item';
            li.innerHTML = `
                <div class="item-details">
                    <h4>${item.bookTitle}</h4>
                    <p>Peminjam: ${item.borrower}</p>
                    <p>Kembali: ${item.returnDate}</p>
                </div>
                <div class="item-actions">
                    <button class="btn-edit" data-id="${item.id}">Edit</button>
                    <button class="btn-delete" data-id="${item.id}">Kembalikan</button>
                </div>
            `;
            this.borrowedListContainer.appendChild(li);
        });
    }

    renderQueue(queueItems) {
        this.queueListContainer.innerHTML = '';
        
        if (queueItems.length === 0) {
            this.queueListContainer.innerHTML = '<li class="placeholder-text">Antrean reservasi kosong.</li>';
            return;
        }
        
        queueItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'list-item';
            li.innerHTML = `
                <div class="item-details">
                    <h4>${index + 1}. ${item.user}</h4>
                    <p>Menunggu: ${item.bookTitle}</p>
                </div>
            `;
            this.queueListContainer.appendChild(li);
        });
    }

    // --- Penanganan Form ---
    showBorrowForm(bookId, bookTitle) {
        this.borrowPanel.classList.remove('hidden');
        this.borrowBookId.value = bookId;
        this.borrowBookTitle.textContent = `Buku: ${bookTitle}`;
        
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const returnDay = nextWeek.toISOString().split('T')[0];

        this.newBorrowDate.value = today;
        this.newReturnDate.value = returnDay;
    }

    hideBorrowForm() {
        this.borrowPanel.classList.add('hidden');
        this.borrowForm.reset();
    }

    showEditForm(borrowData) {
        this.editPlaceholder.classList.add('hidden');
        this.editForm.classList.remove('hidden');
        
        this.editBookId.value = borrowData.id;
        this.editBorrower.value = borrowData.borrower;
        this.editBorrowDate.value = borrowData.borrowDate;
        this.editReturnDate.value = borrowData.returnDate;
    }

    hideEditForm() {
        this.editForm.classList.add('hidden');
        this.editForm.reset();
        this.editPlaceholder.classList.remove('hidden');
    }

    // --- Binding Event ---
    bindLogin(handler) {
        this.loginForm.addEventListener('submit', event => {
            event.preventDefault();
            handler(this.usernameInput.value, this.passwordInput.value);
        });
    }

    bindLogout(handler) {
        this.logoutBtn.addEventListener('click', () => handler());
    }

    bindSearch(handler) {
        this.searchBtn.addEventListener('click', () => {
            handler(this.searchInput.value, this.categoryFilter.value);
        });
        
        this.searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                handler(this.searchInput.value, this.categoryFilter.value);
            }
        });
        
        this.categoryFilter.addEventListener('change', () => {
            handler(this.searchInput.value, this.categoryFilter.value);
        });
    }

    bindInitiateBorrow(handler) {
        this.booksContainer.addEventListener('click', event => {
            if (event.target.classList.contains('btn-borrow')) {
                const id = parseInt(event.target.getAttribute('data-id'));
                const title = event.target.getAttribute('data-title');
                handler(id, title);
            }
        });
    }

    bindSubmitBorrow(handler) {
        this.borrowForm.addEventListener('submit', event => {
            event.preventDefault();
            const bookId = parseInt(this.borrowBookId.value);
            const borrower = this.newBorrower.value;
            const borrowDate = this.newBorrowDate.value;
            const returnDate = this.newReturnDate.value;
            handler(bookId, borrower, borrowDate, returnDate);
        });
    }

    bindCancelBorrow() {
        this.cancelBorrowBtn.addEventListener('click', () => this.hideBorrowForm());
    }

    bindEditBorrowed(handler) {
        this.borrowedListContainer.addEventListener('click', event => {
            if (event.target.classList.contains('btn-edit')) {
                const id = parseInt(event.target.getAttribute('data-id'));
                handler(id);
            }
        });
    }

    bindReturnBook(handler) {
        this.borrowedListContainer.addEventListener('click', event => {
            if (event.target.classList.contains('btn-delete')) {
                const id = parseInt(event.target.getAttribute('data-id'));
                handler(id);
            }
        });
    }

    bindSaveEdit(handler) {
        this.editForm.addEventListener('submit', event => {
            event.preventDefault();
            const id = parseInt(this.editBookId.value);
            const data = {
                borrower: this.editBorrower.value,
                borrowDate: this.editBorrowDate.value,
                returnDate: this.editReturnDate.value
            };
            handler(id, data);
        });
    }

    bindCancelEdit(handler) {
        this.cancelEditBtn.addEventListener('click', () => {
            this.hideEditForm();
            handler();
        });
    }

    bindProcessQueue(handler) {
        this.processQueueBtn.addEventListener('click', () => handler());
    }

    bindUndoAction(handler) {
        this.undoBtn.addEventListener('click', () => handler());
    }

    // --- Layanan Jurnal & E-Book ---
    bindReadJournal(handler) {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-read-journal')) {
                const listItem = e.target.closest('.list-item');
                const titleEl = listItem.querySelector('.journal-title');
                if (titleEl) {
                    handler(titleEl.textContent.trim());
                }
            }
        });

        if (this.closeJournalModalBtn) {
            this.closeJournalModalBtn.addEventListener('click', () => {
                this.journalModal.classList.add('hidden');
                this.journalModal.style.display = 'none';
            });
        }
    }

    bindReadEbook(handler) {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-read-ebook')) {
                const card = e.target.closest('.book-card');
                const titleEl = card.querySelector('.ebook-title');
                if (titleEl) {
                    handler(titleEl.textContent.trim());
                }
            }
        });
    }

    showJournalModal(title) {
        if (!this.journalModal) return;
        this.journalModalTitle.textContent = title;
        this.journalModalSubtitle.textContent = 'Membaca E-Journal...';
        this.journalModalContent.innerHTML = '<p><em>Sedang memuat teori dan abstrak jurnal...</em></p>';
        this.journalModal.classList.remove('hidden');
        this.journalModal.style.display = 'flex';
    }

    showEbookModal(title) {
        if (!this.journalModal) return;
        this.journalModalTitle.textContent = title;
        this.journalModalSubtitle.textContent = 'Membuka E-Book...';
        this.journalModalContent.innerHTML = '<p><em>Sedang memuat pratinjau bab buku...</em></p>';
        this.journalModal.classList.remove('hidden');
        this.journalModal.style.display = 'flex';
    }

    updateJournalContent(contentHtml) {
        if (!this.journalModalContent) return;
        this.journalModalSubtitle.textContent = 'Dokumen Terbuka (Mode Baca)';
        this.journalModalContent.innerHTML = contentHtml;
    }

    // --- Layanan Interaktif (Chat) ---
    bindChat(handler) {
        if(!this.chatSendBtn) return;
        
        const sendMessage = () => {
            const message = this.chatInputField.value.trim();
            if (message) {
                this.addChatMessage(message, 'user');
                this.chatInputField.value = '';
                handler(message);
            }
        };

        this.chatSendBtn.addEventListener('click', sendMessage);
        this.chatInputField.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    addChatMessage(message, sender = 'bot') {
        if(!this.chatMessages) return;
        
        const msgDiv = document.createElement('div');
        msgDiv.style.padding = '10px 15px';
        msgDiv.style.borderRadius = '8px';
        msgDiv.style.marginBottom = '10px';
        msgDiv.style.maxWidth = '80%';
        msgDiv.style.wordWrap = 'break-word';

        if (sender === 'user') {
            msgDiv.style.background = 'var(--primary-color)';
            msgDiv.style.color = 'white';
            msgDiv.style.alignSelf = 'flex-end';
            msgDiv.innerHTML = `<strong>Anda:</strong> ${message}`;
        } else {
            msgDiv.style.background = 'var(--panel-bg)';
            msgDiv.style.color = 'var(--text-primary)';
            msgDiv.style.alignSelf = 'flex-start';
            // Simple markdown parser for bold
            const formattedMessage = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            msgDiv.innerHTML = `<strong>Asisten AI:</strong> ${formattedMessage}`;
        }

        this.chatMessages.appendChild(msgDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        if(!this.chatMessages) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.id = 'chat-typing-indicator';
        typingDiv.style.padding = '10px 15px';
        typingDiv.style.borderRadius = '8px';
        typingDiv.style.marginBottom = '10px';
        typingDiv.style.maxWidth = '80%';
        typingDiv.style.background = 'var(--panel-bg)';
        typingDiv.style.color = 'var(--text-secondary)';
        typingDiv.style.alignSelf = 'flex-start';
        typingDiv.style.fontStyle = 'italic';
        typingDiv.innerHTML = `Asisten AI sedang mengetik...`;

        this.chatMessages.appendChild(typingDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    removeTypingIndicator() {
        const typingDiv = document.getElementById('chat-typing-indicator');
        if (typingDiv) {
            typingDiv.remove();
        }
    }
}
