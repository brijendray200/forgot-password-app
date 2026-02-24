// Password generator - only uppercase and lowercase letters
function generateRandomPassword(length = 12) {
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const allLetters = uppercaseLetters + lowercaseLetters;
  
  let password = '';
  
  // Ensure at least one uppercase and one lowercase
  password += uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];
  password += lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)];
  
  // Fill the rest randomly
  for (let i = 2; i < length; i++) {
    password += allLetters[Math.floor(Math.random() * allLetters.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

module.exports = { generateRandomPassword };
