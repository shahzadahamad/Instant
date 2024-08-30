export default class GenerateUsername {
  public generate(fullname: string): string {
    const username =
      fullname.split(" ").join("").toLowerCase() +
      Math.floor(Math.random() * 10000).toString();
    return username;
  }
}
