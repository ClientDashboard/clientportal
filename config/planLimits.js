// config/planLimits.js

module.exports = {
  basic: {
    price: 19.99,             // $19.99 per month
    maxClients: 10,           // Up to 10 clients
    backupDays: 1,            // 1 day backup retention
    maxPDFForms: 5,           // 5 PDF form creations to HTML per client
    customURLAllowed: false,  // No custom URL allowed
    maxTasks: 5               // 5 tasks creation per client
  },
  standard: {
    price: 59.99,             // $59.99 per month
    maxClients: 20,           // Up to 20 clients
    backupDays: 14,           // 14 day backup retention
    maxPDFForms: 10,          // 10 PDF form creations to HTML per client
    customURLAllowed: true,   // Custom URL allowed
    maxTasks: 10              // 10 tasks creation per client
  },
  pro: {
    price: 139.95,            // $139.95 per month
    maxClients: Infinity,     // Unlimited clients
    backupDays: 30,           // 30 day backup retention
    maxPDFForms: Infinity,    // Unlimited PDF form creations
    customURLAllowed: true,   // Custom URL allowed
    maxTasks: Infinity        // Unlimited tasks creation per client
  }
};
