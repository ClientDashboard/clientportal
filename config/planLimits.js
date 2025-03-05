// config/planLimits.js

const planLimits = {
  basic: {
    name: "Basic",
    price: { amount: 19.99, currency: "USD" }, // More readable price format
    maxClients: 10,           
    backupDays: 1,            
    maxPDFForms: 5,           
    customURLAllowed: false,  
    maxTasks: 5               
  },
  standard: {
    name: "Standard",
    price: { amount: 59.99, currency: "USD" },
    maxClients: 20,           
    backupDays: 14,           
    maxPDFForms: 10,          
    customURLAllowed: true,   
    maxTasks: 10              
  },
  pro: {
    name: "Pro",
    price: { amount: 139.95, currency: "USD" },
    maxClients: 9999,       // Large number instead of Infinity
    backupDays: 30,         
    maxPDFForms: 9999,      // Large number instead of Infinity
    customURLAllowed: true, 
    maxTasks: 9999         
  }
};

// Function to get a plan by name
const getPlanDetails = (planName) => {
  return planLimits[planName] || null;
};

module.exports = { planLimits, getPlanDetails };
