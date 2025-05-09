// Dark theme colors and design elements for the app
const theme = {
  // Dark theme colors
  colors: {
    primary: '#6200EE',       // Purple primary color
    secondary: '#03DAC6',     // Teal secondary color
    background: '#121212',    // Dark background
    surface: '#1E1E1E',       // Slightly lighter surface color
    error: '#CF6679',         // Error color
    text: '#FFFFFF',          // White text
    textSecondary: '#B0B0B0', // Light gray secondary text
    border: '#2C2C2C',        // Dark border color
    card: '#1E1E1E',          // Card background
    tabActive: '#6200EE',     // Active tab color
    tabInactive: '#2C2C2C',   // Inactive tab color
    success: '#4CAF50',       // Success color
    warning: '#FB8C00',       // Warning color
    info: '#2196F3',          // Info color
  },
  
  // Typography
  typography: {
    fontSizes: {
      small: 12,
      medium: 16,
      large: 20,
      xlarge: 24,
      xxlarge: 32,
    },
    fontWeights: {
      regular: 'normal',
      medium: '500',
      bold: 'bold',
    },
  },
  
  // Spacing
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Border radius
  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
    round: 9999,
  },
  
  // Shadows
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
      elevation: 8,
    },
  },
  
  // Button styles
  buttons: {
    primary: {
      backgroundColor: '#6200EE',
      color: '#FFFFFF',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    secondary: {
      backgroundColor: 'transparent',
      color: '#6200EE',
      borderWidth: 1,
      borderColor: '#6200EE',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    text: {
      backgroundColor: 'transparent',
      color: '#6200EE',
      paddingVertical: 8,
      paddingHorizontal: 8,
    },
  },
  
  // Input styles
  inputs: {
    default: {
      backgroundColor: '#2C2C2C',
      color: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#3E3E3E',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    focused: {
      borderColor: '#6200EE',
    },
    error: {
      borderColor: '#CF6679',
    },
  },
  
  // Card styles
  cards: {
    default: {
      backgroundColor: '#1E1E1E',
      borderRadius: 8,
      padding: 16,
    },
    elevated: {
      backgroundColor: '#1E1E1E',
      borderRadius: 8,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 4,
    },
  },
};

export default theme;
