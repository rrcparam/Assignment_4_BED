/**
 * Utility functions are  for extracting standardized
 * error message and the error codes.
 
 * This can be Used by middleware such as authentication,
 * authorization  and error handling systems.
 */

/**
 * Extrac a human  readable message from an unknown error.
 * Falls back to a default message if unavailable.
 *
 * @param {unknown} error 
 * @returns {string} 
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unknown error occurred";
};

/**
 * This would  Extracts or assigns a standard error code from an unknown error.
 *
 * @param {unknown} error
 * @returns {string} 
 */
export const getErrorCode = (error: unknown): string => {
  if (error && typeof error === "object" && "code" in error) {
    return (error as { code?: string }).code || "UNKNOWN_ERROR";
  }
  return "UNKNOWN_ERROR";
};
