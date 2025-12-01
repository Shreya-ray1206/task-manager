export const firebaseErrorToMessage = (err) => {
  if (!err || !err.code) return "Something went wrong.";

  switch (err.code) { 
    case "auth/invalid-email":
      return "Invalid email address.";

    case "auth/user-not-found":
      return "No user found with this email.";

    case "auth/wrong-password":
      return "Incorrect password.";

    case "auth/email-already-in-use":
      return "Email already registered.";

    case "auth/weak-password":
      return "Password must be at least 6 characters.";

    case "permission-denied":
      return "You do not have permission.";

    case "unavailable":
      return "Service temporarily unavailable.";

    default:
      return err.message || "Failed. Try again.";
  }
};
