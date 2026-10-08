export function getApiErrorMessage(error, fallbackMessage) {
  const responseData = error.response?.data;

  if (responseData?.message) {
    return responseData.message;
  }

  if (Array.isArray(responseData?.errors)) {
    return responseData.errors
      .map((item) => item.msg)
      .join(", ");
  }

  if (error.code === "ERR_NETWORK") {
    return "Unable to connect to the server.";
  }

  return fallbackMessage;
}