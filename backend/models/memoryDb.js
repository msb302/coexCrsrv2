/**
 * In-memory database implementation for COEx application
 * This serves as our data store for the MVP
 */

class MemoryDatabase {
  constructor() {
    // Initialize data structures
    this.users = [];
    this.products = [];
    this.orders = [];
    this.payments = [];
    this.deliveries = [];
    this.notifications = [];
    
    // Counter for IDs
    this.counters = {
      users: 1,
      products: 1,
      orders: 1,
      payments: 1,
      deliveries: 1,
      notifications: 1
    };
    
    // Seed the database with initial data
    this.seedDatabase();
  }
  
  // User methods
  createUser(userData) {
    try {
      console.log('Creating user with data:', { ...userData, password: '[REDACTED]' });
      
      // Validate required fields
      if (!userData.username || !userData.password || !userData.email || !userData.role) {
        throw new Error('Missing required fields: username, password, email, and role are required');
      }
      
      // Check if user already exists
      if (this.getUserByUsername(userData.username)) {
        throw new Error('User with this username already exists');
      }
      
      const user = {
        id: this.counters.users++,
        createdAt: new Date(),
        ...userData
      };
      
      // Store the user with password
      this.users.push(user);
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  getUserById(id) {
    const user = this.users.find(u => u.id === parseInt(id));
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }
  
  getUserByUsername(username) {
    return this.users.find(u => u.username === username);
  }
  
  updateUser(id, userData) {
    const index = this.users.findIndex(u => u.id === parseInt(id));
    if (index !== -1) {
      this.users[index] = {...this.users[index], ...userData};
      const { password, ...userWithoutPassword } = this.users[index];
      return userWithoutPassword;
    }
    return null;
  }
  
  // Get users by role
  getUsersByRole(role) {
    return this.users
      .filter(u => u.role === role)
      .map(({password, ...userWithoutPassword}) => userWithoutPassword);
  }
  
  // Product methods
  createProduct(productData) {
    const product = {
      id: this.counters.products++,
      createdAt: new Date(),
      ...productData
    };
    this.products.push(product);
    return product;
  }
  
  getProducts() {
    return [...this.products];
  }
  
  getProductById(id) {
    return this.products.find(p => p.id === parseInt(id));
  }
  
  // Order methods
  createOrder(orderData) {
    const order = {
      id: this.counters.orders++,
      createdAt: new Date(),
      status: 'pending',
      ...orderData
    };
    this.orders.push(order);
    return order;
  }
  
  getOrders() {
    return [...this.orders];
  }
  
  getOrderById(id) {
    return this.orders.find(o => o.id === parseInt(id));
  }
  
  getOrdersByPharmacy(pharmacyId) {
    return this.orders.filter(o => o.pharmacyId === parseInt(pharmacyId));
  }
  
  getOrdersByDistributor(distributorId) {
    return this.orders.filter(o => o.distributorId === parseInt(distributorId));
  }
  
  updateOrderStatus(id, status) {
    const index = this.orders.findIndex(o => o.id === parseInt(id));
    if (index !== -1) {
      this.orders[index].status = status;
      this.orders[index].updatedAt = new Date();
      return this.orders[index];
    }
    return null;
  }
  
  // Payment methods
  createPayment(paymentData) {
    const payment = {
      id: this.counters.payments++,
      createdAt: new Date(),
      status: 'pending',
      ...paymentData
    };
    this.payments.push(payment);
    return payment;
  }
  
  getPayments() {
    return [...this.payments];
  }
  
  getPaymentById(id) {
    return this.payments.find(p => p.id === parseInt(id));
  }
  
  getPaymentsByPharmacy(pharmacyId) {
    return this.payments.filter(p => p.pharmacyId === parseInt(pharmacyId));
  }
  
  updatePaymentStatus(id, status) {
    const index = this.payments.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      this.payments[index].status = status;
      this.payments[index].updatedAt = new Date();
      return this.payments[index];
    }
    return null;
  }
  
  // Delivery methods
  createDelivery(deliveryData) {
    const delivery = {
      id: this.counters.deliveries++,
      createdAt: new Date(),
      status: 'scheduled',
      ...deliveryData
    };
    this.deliveries.push(delivery);
    return delivery;
  }
  
  updateDeliveryStatus(id, status, confirmationData = {}) {
    const index = this.deliveries.findIndex(d => d.id === parseInt(id));
    if (index !== -1) {
      this.deliveries[index].status = status;
      this.deliveries[index].updatedAt = new Date();
      this.deliveries[index].confirmation = {
        ...this.deliveries[index].confirmation,
        ...confirmationData
      };
      return this.deliveries[index];
    }
    return null;
  }
  
  // Notification methods
  createNotification(notificationData) {
    // Check for duplicate notifications
    const isDuplicate = this.notifications.some(n => 
      n.userId === notificationData.userId && 
      n.title === notificationData.title && 
      n.message === notificationData.message &&
      n.type === notificationData.type &&
      // Only consider it a duplicate if it's within the last 5 minutes
      (new Date() - new Date(n.createdAt)) < 5 * 60 * 1000
    );

    if (isDuplicate) {
      return null; // Don't create duplicate notifications
    }

    const notification = {
      id: this.counters.notifications++,
      createdAt: new Date(),
      read: false,
      ...notificationData
    };
    this.notifications.push(notification);
    return notification;
  }
  
  getNotificationsByUserId(userId) {
    return this.notifications
      .filter(n => n.userId === parseInt(userId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest first
  }
  
  markNotificationAsRead(id, userId) {
    const index = this.notifications.findIndex(n => 
      n.id === parseInt(id) && n.userId === parseInt(userId)
    );
    if (index !== -1) {
      this.notifications[index].read = true;
      this.notifications[index].readAt = new Date();
      return this.notifications[index];
    }
    return null;
  }

  markAllNotificationsAsRead(userId) {
    this.notifications.forEach(notification => {
      if (notification.userId === parseInt(userId)) {
        notification.read = true;
        notification.readAt = new Date();
      }
    });
  }

  clearAllNotifications(userId) {
    this.notifications = this.notifications.filter(
      n => n.userId !== parseInt(userId)
    );
  }
  
  // Check if pharmacy exceeds credit limit
  isExceedingCreditLimit(pharmacyId) {
    const pharmacy = this.getUserById(pharmacyId);
    if (!pharmacy || pharmacy.role !== 'pharmacy') return true;
    
    // Get all pending payments
    const pendingPaymentsTotal = this.payments
      .filter(p => p.pharmacyId === parseInt(pharmacyId) && p.status === 'pending')
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    return pendingPaymentsTotal > (pharmacy.creditLimit || 0);
  }
  
  // Seed method to populate initial data
  seedDatabase() {
    // Create demo users first
    const users = [
      {
        username: 'admin',
        password: 'admin123',
        name: 'Admin User',
        email: 'admin@coex.com',
        phoneNumber: '+962 7 9876 5432',
        role: 'admin',
        businessName: 'COEx Admin'
      },
      {
        username: 'dist1',
        password: 'dist123',
        name: 'Mohammed Distributor',
        email: 'dist1@jopharma.com',
        phoneNumber: '+962 7 8765 4321',
        role: 'distributor',
        businessName: 'JoPharma Distribution',
        businessType: 'Pharmaceutical Distributor'
      },
      {
        username: 'dist2',
        password: 'dist123',
        name: 'Sara Distributor',
        email: 'dist2@arabmed.com',
        phoneNumber: '+962 7 8765 1234',
        role: 'distributor',
        businessName: 'ArabMed Supplies',
        businessType: 'Manufacturer & Distributor'
      },
      {
        username: 'dist3',
        password: 'dist123',
        name: 'Khalid Distributor',
        email: 'dist3@medeast.com',
        phoneNumber: '+962 7 9871 2345',
        role: 'distributor',
        businessName: 'MedEast Distribution',
        businessType: 'Pharmaceutical Distributor'
      },
      {
        username: 'pharm1',
        password: 'pharm123',
        name: 'Ahmad Pharmacy',
        email: 'pharm1@alshifa.com',
        phoneNumber: '+962 7 1234 5678',
        role: 'pharmacy',
        businessName: 'Al-Shifa Pharmacy',
        address: 'Amman, Jordan - 7th Circle',
        creditLimit: 5000
      },
      {
        username: 'pharm2',
        password: 'pharm123',
        name: 'Layla Pharmacy',
        email: 'pharm2@alhayat.com',
        phoneNumber: '+962 7 2345 6789',
        role: 'pharmacy',
        businessName: 'Al-Hayat Medical Center',
        address: 'Irbid, Jordan - University Street',
        creditLimit: 3000
      },
      {
        username: 'pharm3',
        password: 'pharm123',
        name: 'Omar Pharmacy',
        email: 'pharm3@amman.com',
        phoneNumber: '+962 7 3456 7890',
        role: 'pharmacy',
        businessName: 'Amman Modern Pharmacy',
        address: 'Zarqa, Jordan - Main Street',
        creditLimit: 2500
      }
    ];
    
    // Add the users - using direct array manipulation to bypass password hashing
    // This is only for seeding demo data
    users.forEach(user => {
      const newUser = {
        id: this.counters.users++,
        createdAt: new Date(),
        ...user
      };
      this.users.push(newUser);
    });
    
    // Add demo pharmaceutical products (all prices in JD - Jordanian Dinar)
    const products = [
      { 
        name: 'Amoxicillin 500mg', 
        description: 'Antibiotic capsules for bacterial infections', 
        price: 12.50, 
        category: 'Antibiotics', 
        manufacturer: 'JoPharma', 
        sku: 'AMX500', 
        stockQuantity: 500,
        distributorId: 2  // JoPharma Distribution
      },
      { 
        name: 'Lisinopril 10mg', 
        description: 'Blood pressure medication for hypertension', 
        price: 8.75, 
        category: 'Cardiovascular', 
        manufacturer: 'MedEast', 
        sku: 'LIS10', 
        stockQuantity: 300,
        distributorId: 4  // MedEast Distribution
      },
      { 
        name: 'Metformin 850mg', 
        description: 'Oral diabetes medication for type 2 diabetes', 
        price: 6.90, 
        category: 'Diabetes', 
        manufacturer: 'JoPharma', 
        sku: 'MET850', 
        stockQuantity: 400,
        distributorId: 2  // JoPharma Distribution
      },
      { 
        name: 'Paracetamol 500mg', 
        description: 'Pain reliever and fever reducer', 
        price: 3.25, 
        category: 'Pain Relief', 
        manufacturer: 'ArabMed', 
        sku: 'PAR500', 
        stockQuantity: 1000,
        distributorId: 3  // ArabMed Supplies
      },
      { 
        name: 'Salbutamol Inhaler', 
        description: 'Bronchodilator for asthma relief', 
        price: 15.75, 
        category: 'Respiratory', 
        manufacturer: 'MedEast', 
        sku: 'SAL100', 
        stockQuantity: 200,
        distributorId: 4  // MedEast Distribution
      },
      { 
        name: 'Omeprazole 20mg', 
        description: 'Proton pump inhibitor for acid reflux and ulcers', 
        price: 9.50, 
        category: 'Gastrointestinal', 
        manufacturer: 'ArabMed', 
        sku: 'OME20', 
        stockQuantity: 350,
        distributorId: 3  // ArabMed Supplies
      },
      { 
        name: 'Simvastatin 20mg', 
        description: 'Cholesterol-lowering medication', 
        price: 11.25, 
        category: 'Cardiovascular', 
        manufacturer: 'JoPharma', 
        sku: 'SIM20', 
        stockQuantity: 280,
        distributorId: 2  // JoPharma Distribution
      },
      { 
        name: 'Atorvastatin 10mg', 
        description: 'Potent cholesterol-lowering medication', 
        price: 13.80, 
        category: 'Cardiovascular', 
        manufacturer: 'MedEast', 
        sku: 'ATO10', 
        stockQuantity: 320,
        distributorId: 4  // MedEast Distribution
      },
      { 
        name: 'Ciprofloxacin 500mg', 
        description: 'Broad-spectrum antibiotic tablets', 
        price: 14.50, 
        category: 'Antibiotics', 
        manufacturer: 'ArabMed', 
        sku: 'CIP500', 
        stockQuantity: 250,
        distributorId: 3  // ArabMed Supplies
      },
      { 
        name: 'Diazepam 5mg', 
        description: 'Anti-anxiety and muscle relaxant medication', 
        price: 7.30, 
        category: 'Psychiatric', 
        manufacturer: 'JoPharma', 
        sku: 'DIA5', 
        stockQuantity: 180,
        distributorId: 2  // JoPharma Distribution
      },
      { 
        name: 'Aspirin 100mg', 
        description: 'Blood thinner for cardiovascular health', 
        price: 4.20, 
        category: 'Cardiovascular', 
        manufacturer: 'ArabMed', 
        sku: 'ASP100', 
        stockQuantity: 600,
        distributorId: 3  // ArabMed Supplies
      },
      { 
        name: 'Insulin Glargine', 
        description: 'Long-acting insulin for diabetes', 
        price: 45.00, 
        category: 'Diabetes', 
        manufacturer: 'MedEast', 
        sku: 'INS300', 
        stockQuantity: 150,
        distributorId: 4  // MedEast Distribution
      }
    ];
    
    // Add the products
    products.forEach(product => this.createProduct(product));
    
    // Create some demo orders
    const orders = [
      {
        pharmacyId: 5, // Al-Shifa Pharmacy
        pharmacyName: 'Al-Shifa Pharmacy',
        distributorId: 2, // JoPharma Distribution
        distributorName: 'JoPharma Distribution',
        status: 'delivered',
        items: [
          { productId: 1, name: 'Amoxicillin 500mg', quantity: 5, price: 12.50, total: 62.50 },
          { productId: 7, name: 'Simvastatin 20mg', quantity: 3, price: 11.25, total: 33.75 }
        ],
        totalAmount: 96.25,
        notes: 'Need delivery during morning hours',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
      },
      {
        pharmacyId: 5, // Al-Shifa Pharmacy
        pharmacyName: 'Al-Shifa Pharmacy',
        distributorId: 3, // ArabMed Supplies
        distributorName: 'ArabMed Supplies',
        status: 'delivered',
        items: [
          { productId: 4, name: 'Paracetamol 500mg', quantity: 10, price: 3.25, total: 32.50 },
          { productId: 6, name: 'Omeprazole 20mg', quantity: 4, price: 9.50, total: 38.00 }
        ],
        totalAmount: 70.50,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
      },
      {
        pharmacyId: 6, // Al-Hayat Medical Center
        pharmacyName: 'Al-Hayat Medical Center',
        distributorId: 4, // MedEast Distribution
        distributorName: 'MedEast Distribution',
        status: 'shipped',
        items: [
          { productId: 2, name: 'Lisinopril 10mg', quantity: 6, price: 8.75, total: 52.50 },
          { productId: 5, name: 'Salbutamol Inhaler', quantity: 3, price: 15.75, total: 47.25 }
        ],
        totalAmount: 99.75,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        pharmacyId: 7, // Amman Modern Pharmacy
        pharmacyName: 'Amman Modern Pharmacy',
        distributorId: 2, // JoPharma Distribution
        distributorName: 'JoPharma Distribution',
        status: 'pending',
        items: [
          { productId: 3, name: 'Metformin 850mg', quantity: 8, price: 6.90, total: 55.20 },
          { productId: 10, name: 'Diazepam 5mg', quantity: 2, price: 7.30, total: 14.60 }
        ],
        totalAmount: 69.80,
        notes: 'Urgent order - please process ASAP',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        pharmacyId: 5, // Al-Shifa Pharmacy
        pharmacyName: 'Al-Shifa Pharmacy',
        distributorId: 4, // MedEast Distribution
        distributorName: 'MedEast Distribution',
        status: 'accepted',
        items: [
          { productId: 8, name: 'Atorvastatin 10mg', quantity: 4, price: 13.80, total: 55.20 },
          { productId: 12, name: 'Insulin Glargine', quantity: 2, price: 45.00, total: 90.00 }
        ],
        totalAmount: 145.20,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    ];
    
    // Add the orders
    orders.forEach(order => this.createOrder(order));
    
    // Create some demo payments
    const payments = [
      {
        pharmacyId: 5, // Al-Shifa Pharmacy
        pharmacyName: 'Al-Shifa Pharmacy',
        distributorId: 2, // JoPharma Distribution
        distributorName: 'JoPharma Distribution',
        orderId: 1,
        amount: 96.25,
        status: 'cleared',
        checkImagePath: '/uploads/check1.jpg',
        notes: 'Payment for order #1',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) // 12 days ago
      },
      {
        pharmacyId: 5, // Al-Shifa Pharmacy
        pharmacyName: 'Al-Shifa Pharmacy',
        distributorId: 3, // ArabMed Supplies
        distributorName: 'ArabMed Supplies',
        orderId: 2,
        amount: 70.50,
        status: 'pending',
        checkImagePath: '/uploads/check2.jpg',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Due in 5 days
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) // 8 days ago
      },
      {
        pharmacyId: 6, // Al-Hayat Medical Center
        pharmacyName: 'Al-Hayat Medical Center',
        distributorId: 4, // MedEast Distribution
        distributorName: 'MedEast Distribution',
        amount: 150.00,
        status: 'processed',
        checkImagePath: '/uploads/check3.jpg',
        notes: 'Advance payment',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Due in 10 days
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    ];
    
    // Add the payments
    payments.forEach(payment => this.createPayment(payment));
    
    // Create some demo deliveries
    const deliveries = [
      {
        orderId: 1,
        pharmacyId: 5, // Al-Shifa Pharmacy
        pharmacyName: 'Al-Shifa Pharmacy',
        distributorId: 2, // JoPharma Distribution
        distributorName: 'JoPharma Distribution',
        status: 'delivered',
        deliveryType: 'scheduled',
        scheduledDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000), // 13 days ago
        confirmation: {
          signatureImagePath: '/uploads/signature1.jpg',
          confirmedBy: 'Ahmad Pharmacy',
          confirmedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000) // 13 days ago
        },
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
      },
      {
        orderId: 2,
        pharmacyId: 5, // Al-Shifa Pharmacy
        pharmacyName: 'Al-Shifa Pharmacy',
        distributorId: 3, // ArabMed Supplies
        distributorName: 'ArabMed Supplies',
        status: 'delivered',
        deliveryType: 'pickup',
        confirmation: {
          signatureImagePath: '/uploads/signature2.jpg',
          confirmedBy: 'Ahmad Pharmacy',
          confirmedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) // 9 days ago
        },
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
      },
      {
        orderId: 3,
        pharmacyId: 6, // Al-Hayat Medical Center
        pharmacyName: 'Al-Hayat Medical Center',
        distributorId: 4, // MedEast Distribution
        distributorName: 'MedEast Distribution',
        status: 'in_transit',
        deliveryType: 'scheduled',
        scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        notes: 'Please call 30 minutes before delivery',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    ];
    
    // Add the deliveries
    deliveries.forEach(delivery => this.createDelivery(delivery));
    
    // Create some demo notifications
    const notifications = [
      {
        userId: 5, // Al-Shifa Pharmacy
        title: 'Order Delivered',
        message: 'Your order #1 has been delivered successfully.',
        type: 'order_status',
        read: true,
        createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000) // 13 days ago
      },
      {
        userId: 2, // JoPharma Distribution
        title: 'New Order Received',
        message: 'You have received a new order #4 from Amman Modern Pharmacy.',
        type: 'new_order',
        read: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        userId: 5, // Al-Shifa Pharmacy
        title: 'Payment Due Reminder',
        message: 'Payment for order #2 is due in 5 days.',
        type: 'payment_reminder',
        read: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        userId: 4, // MedEast Distribution
        title: 'Order Status Updated',
        message: 'Order #3 status has been updated to "Shipped".',
        type: 'order_status',
        read: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    ];
    
    // Add the notifications
    notifications.forEach(notification => this.createNotification(notification));
  }
}

// Create and export the database instance
const memoryDb = new MemoryDatabase();

// Export all methods
module.exports = {
  // User methods
  createUser: memoryDb.createUser.bind(memoryDb),
  getUserById: memoryDb.getUserById.bind(memoryDb),
  getUserByUsername: memoryDb.getUserByUsername.bind(memoryDb),
  updateUser: memoryDb.updateUser.bind(memoryDb),
  getUsersByRole: memoryDb.getUsersByRole.bind(memoryDb),
  
  // Product methods
  createProduct: memoryDb.createProduct.bind(memoryDb),
  getProducts: memoryDb.getProducts.bind(memoryDb),
  getProductById: memoryDb.getProductById.bind(memoryDb),
  
  // Order methods
  createOrder: memoryDb.createOrder.bind(memoryDb),
  getOrders: memoryDb.getOrders.bind(memoryDb),
  getOrderById: memoryDb.getOrderById.bind(memoryDb),
  getOrdersByPharmacy: memoryDb.getOrdersByPharmacy.bind(memoryDb),
  getOrdersByDistributor: memoryDb.getOrdersByDistributor.bind(memoryDb),
  updateOrderStatus: memoryDb.updateOrderStatus.bind(memoryDb),
  
  // Payment methods
  createPayment: memoryDb.createPayment.bind(memoryDb),
  getPayments: memoryDb.getPayments.bind(memoryDb),
  getPaymentById: memoryDb.getPaymentById.bind(memoryDb),
  getPaymentsByPharmacy: memoryDb.getPaymentsByPharmacy.bind(memoryDb),
  updatePaymentStatus: memoryDb.updatePaymentStatus.bind(memoryDb),
  
  // Delivery methods
  createDelivery: memoryDb.createDelivery.bind(memoryDb),
  updateDeliveryStatus: memoryDb.updateDeliveryStatus.bind(memoryDb),
  
  // Notification methods
  createNotification: memoryDb.createNotification.bind(memoryDb),
  getNotificationsByUserId: memoryDb.getNotificationsByUserId.bind(memoryDb),
  markNotificationAsRead: memoryDb.markNotificationAsRead.bind(memoryDb),
  markAllNotificationsAsRead: memoryDb.markAllNotificationsAsRead.bind(memoryDb),
  clearAllNotifications: memoryDb.clearAllNotifications.bind(memoryDb),
  
  // Credit limit check
  isExceedingCreditLimit: memoryDb.isExceedingCreditLimit.bind(memoryDb)
};
