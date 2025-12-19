export const firebaseErrorToMessage = (err) => {
  if (!err || !err.code) return "Something went wrong.";

  switch (err.code) {
    case "auth/invalid-email":
      return "Invalid email address.";

    case "auth/user-not-found":
      return "No user found with this email.";

    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";

    case "auth/email-already-in-use":
      return "Email already registered.";

    case "auth/weak-password":
      return "Password must be at least 6 characters.";

    case "auth/too-many-requests":
      return "Too many login attempts. Try again later.";

    default:
      return err.message || "Failed. Try again.";
  }
};
