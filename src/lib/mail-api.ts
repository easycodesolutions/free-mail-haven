
// Temporary Email API Service
// This service uses Mail.gw's free API for temporary email functionality

interface EmailAddress {
  id: string;
  address: string;
}

interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  intro: string;
  hasAttachments: boolean;
  createdAt: string;
  bodyHtml: string;
  bodyText: string;
}

// Base API URL
const API_BASE_URL = "https://api.mail.gw";

// Generate a random email address
const generateRandomUsername = (length: number = 10) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Get available domains
export const getAvailableDomains = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/domains`);
    const data = await response.json();
    return data["hydra:member"]?.map((domain: any) => domain.domain) || ["mailgw.com"];
  } catch (error) {
    console.error("Failed to fetch domains:", error);
    return ["mailgw.com"]; // Fallback domain
  }
};

// Create a new random email account
export const createEmailAccount = async (): Promise<EmailAddress | null> => {
  try {
    // Get available domains
    const domains = await getAvailableDomains();
    const domain = domains[0]; // Use the first available domain
    
    // Generate random username
    const username = generateRandomUsername();
    const password = generateRandomUsername(12);
    const address = `${username}@${domain}`;
    
    // Create account
    const response = await fetch(`${API_BASE_URL}/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address,
        password
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Generate token for this account
      const tokenResponse = await fetch(`${API_BASE_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          address,
          password
        })
      });
      
      const tokenData = await tokenResponse.json();
      
      if (tokenResponse.ok) {
        // Store token in local storage for this session
        localStorage.setItem('tempMailToken', tokenData.token);
        localStorage.setItem('tempMailAddress', address);
        localStorage.setItem('tempMailId', data.id);
        
        return {
          id: data.id,
          address
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error("Failed to create email account:", error);
    return null;
  }
};

// Get messages for the current account
export const getMessages = async (): Promise<Email[]> => {
  try {
    const token = localStorage.getItem('tempMailToken');
    
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await fetch(`${API_BASE_URL}/messages`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data["hydra:member"]?.map((msg: any) => ({
        id: msg.id,
        from: msg.from.address,
        to: msg.to[0]?.address || 'unknown',
        subject: msg.subject,
        intro: msg.intro,
        hasAttachments: msg.hasAttachments,
        createdAt: msg.createdAt,
        bodyHtml: '', // Will be fetched when viewing the message
        bodyText: ''
      })) || [];
    }
    
    return [];
  } catch (error) {
    console.error("Failed to get messages:", error);
    return [];
  }
};

// Get a specific message
export const getMessage = async (messageId: string): Promise<Email | null> => {
  try {
    const token = localStorage.getItem('tempMailToken');
    
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const msg = await response.json();
      return {
        id: msg.id,
        from: msg.from.address,
        to: msg.to[0]?.address || 'unknown',
        subject: msg.subject,
        intro: msg.intro,
        hasAttachments: msg.hasAttachments,
        createdAt: msg.createdAt,
        bodyHtml: msg.html?.[0] || '',
        bodyText: msg.text || ''
      };
    }
    
    return null;
  } catch (error) {
    console.error("Failed to get message:", error);
    return null;
  }
};

// Delete account
export const deleteEmailAccount = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem('tempMailToken');
    const accountId = localStorage.getItem('tempMailId');
    
    if (!token || !accountId) {
      throw new Error("No authentication token or account ID found");
    }
    
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      localStorage.removeItem('tempMailToken');
      localStorage.removeItem('tempMailAddress');
      localStorage.removeItem('tempMailId');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Failed to delete email account:", error);
    return false;
  }
};

// Helper to check if the current session has a valid email
export const hasActiveEmail = (): boolean => {
  return !!localStorage.getItem('tempMailAddress');
};

// Get the current email address
export const getCurrentEmail = (): string | null => {
  return localStorage.getItem('tempMailAddress');
};
