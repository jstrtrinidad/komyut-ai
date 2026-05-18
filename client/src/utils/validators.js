export const validateName = (name) => {
  const regex = /^[A-Za-z\s]{2,50}$/;
  return regex.test(name.trim());
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim().toLowerCase());
};

export const validatePassword = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,50}$/;

  return regex.test(password);
};