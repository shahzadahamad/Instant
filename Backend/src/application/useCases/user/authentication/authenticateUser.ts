import PasswordHasher from "../../../providers/passwordHasher";
import TokenManager from "../../../providers/tokenManager";
import UserRepository from "../../../repositories/user/userRepository";

export default class AuthenticateUser {
  private userRepository: UserRepository;
  private passwordHasher: PasswordHasher;
  private tokenManager: TokenManager;

  constructor(
    userRepository: UserRepository,
    passwordHasher: PasswordHasher,
    tokenManager: TokenManager
  ) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenManager = tokenManager;
  }
  public async execute(
    usernameOrEmail: string,
    password: string
  ): Promise<{token:string,refreshToken:string}> {
    const userExist =
      await this.userRepository.findByUsernameAndEmail(
        usernameOrEmail
      );
    if (!userExist) {
      throw new Error("User not found!");
    }

    const isValidPassword = await this.passwordHasher.compare(
      password,
      userExist.password
    );
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = await this.tokenManager.generateAccessToken({userId:userExist._id,role:"user"});
    const refreshToken = await this.tokenManager.generateRefreshToken(userExist._id);

    return {token, refreshToken}
  }
}
