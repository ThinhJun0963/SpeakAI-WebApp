export const validatePassword = (password) => {
  const passwordRegex = /^(?!.*\s)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
  if (!passwordRegex.test(password)) {
    return "Password must have 8-20 characters, at least 1 special character, and no spaces.";
  }
  return null;
};
