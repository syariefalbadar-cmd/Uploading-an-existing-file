// --- Stack Implementation ---
// Used for Undo history
class Stack {
    constructor() {
        this.items = [];
    }
    
    push(element) {
        this.items.push(element);
    }
    
    pop() {
        if (this.isEmpty()) return null;
        return this.items.pop();
    }
    
    peek() {
        if (this.isEmpty()) return null;
        return this.items[this.items.length - 1];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
}

// --- Queue Implementation ---
// Used for book reservations
class Queue {
    constructor() {
        this.items = [];
    }
    
    enqueue(element) {
        this.items.push(element);
    }
    
    dequeue() {
        if (this.isEmpty()) return null;
        return this.items.shift();
    }
    
    front() {
        if (this.isEmpty()) return null;
        return this.items[0];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
    
    toArray() {
        return [...this.items];
    }
}

// --- Linked List Implementation ---
// Used for active borrowed books
class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
    
    // Add to the end
    append(data) {
        const newNode = new Node(data);
        
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }
    
    // Remove by ID
    removeById(id) {
        let current = this.head;
        let previous = null;
        
        while (current) {
            if (current.data.id === id) {
                if (!previous) {
                    this.head = current.next;
                } else {
                    previous.next = current.next;
                }
                this.size--;
                return current.data;
            }
            previous = current;
            current = current.next;
        }
        return null;
    }
    
    // Find by ID
    findById(id) {
        let current = this.head;
        while (current) {
            if (current.data.id === id) {
                return current.data;
            }
            current = current.next;
        }
        return null;
    }
    
    // Update by ID
    updateById(id, newData) {
        let current = this.head;
        while (current) {
            if (current.data.id === id) {
                current.data = { ...current.data, ...newData };
                return true;
            }
            current = current.next;
        }
        return false;
    }
    
    // Get all items as array (for rendering)
    toArray() {
        const arr = [];
        let current = this.head;
        while (current) {
            arr.push(current.data);
            current = current.next;
        }
        return arr;
    }
}
