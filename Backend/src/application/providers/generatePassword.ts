export default class GeneratePassword {
  public generate(): string {
    const upperCaseChars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCaseChars: string = "abcdefghijklmnopqrstuvwxyz";
    const numberChars: string = "0123456789";
    const specialChars: string = "!@#$%^&*()_+[]{}|;:,.<>?";

    const allChars: string =
      upperCaseChars + lowerCaseChars + numberChars + specialChars;

    let password: string = "";

    // Ensure at least one character from each category
    password += upperCaseChars.charAt(
      Math.floor(Math.random() * upperCaseChars.length)
    );
    password += lowerCaseChars.charAt(
      Math.floor(Math.random() * lowerCaseChars.length)
    );
    password += numberChars.charAt(
      Math.floor(Math.random() * numberChars.length)
    );
    password += specialChars.charAt(
      Math.floor(Math.random() * specialChars.length)
    );

    // Fill the rest of the password to reach 12 characters
    for (let i = 4; i < 12; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle the password to ensure randomness
    password = password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");

    return password;
  }
}
