import { IUser } from "../../../../infrastructure/database/models/userModel";
import GeneratePassword from "../../../providers/generatePassword";
import GenerateUsername from "../../../providers/generateUsername";
import PasswordHasher from "../../../providers/passwordHasher";
import TokenManager from "../../../providers/tokenManager";
import UserRepository from "../../../repositories/user/userRepository";

export default class GoogleAuthenticateUser {
  private userRepository: UserRepository;
  private passwordHasher: PasswordHasher;
  private tokenManager: TokenManager;
  private generatePassword: GeneratePassword;
  private generateUsername: GenerateUsername;

  constructor(
    userRepository: UserRepository,
    passwordHasher: PasswordHasher,
    tokenManager: TokenManager,
    generatePassword: GeneratePassword,
    generateUsername: GenerateUsername
  ) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenManager = tokenManager;
    this.generatePassword = generatePassword;
    this.generateUsername = generateUsername;
  }
  public async execute(
    fullname: string,
    email: string
  ): Promise<{ token: string; refreshToken: string; user: Partial<IUser> }> {
    const userExist = await this.userRepository.findByEmail(email);

    if (userExist) {
      if (userExist.isBlock) {
        throw new Error("Your account has been blocked");
      }
      const token = await this.tokenManager.generateAccessToken({
        userId: userExist._id,
        role: "user",
      });
      const refreshToken = await this.tokenManager.generateRefreshToken(
        userExist._id
      );
      const { _id, fullname, username, email, profilePicture } = userExist;
      return {
        token,
        refreshToken,
        user: {
          _id,
          fullname,
          username,
          email,
          profilePicture,
        },
      };
    }

    const generatedPassword = this.generatePassword.generate();
    let generatedUsername = this.generateUsername.generate(fullname);

    while (await this.userRepository.findByUsername(generatedUsername)) {
      generatedUsername = this.generateUsername.generate(fullname);
    }

    const hashedPassword = await this.passwordHasher.hash(generatedPassword);

    const newUser = await this.userRepository.createUser({
      fullname,
      username: generatedUsername,
      email,
      password: hashedPassword,
    } as IUser);

    if (!newUser) {
      throw new Error("Failed to create new user. Please try again.");
    }

    const token = await this.tokenManager.generateAccessToken({
      userId: newUser._id,
      role: "user",
    });
    const refreshToken = await this.tokenManager.generateRefreshToken(
      newUser._id
    );

    const { _id, username, profilePicture } = newUser;

    return {
      token,
      refreshToken,
      user: {
        _id,
        fullname: newUser.fullname,
        username,
        email: newUser.email,
        profilePicture,
      },
    };
  }
}
