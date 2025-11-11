
// It Creates a consistent success response format.
 
export const successResponse = (data: any, message = "Request successful") => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};

// This Creates an error response format.
 
export const errorResponse = (message: string, code: string) => {
  return {
    success: false,
    error: {
      message,
      code,
      timestamp: new Date().toISOString(),
    },
  };
};
