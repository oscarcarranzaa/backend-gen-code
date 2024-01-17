import jwt from "jsonwebtoken";

export const generateUserToken = (uid) => {
  const expireToken = 60 * 20;
  try {
    const token = jwt.sign({ uid }, process.env.JWT_SECRET_KEY, {
      expiresIn: expireToken,
    });
    return { token, expireToken };
  } catch (error) {
    console.log(error);
  }
};
export const generateUpdateToken = (uid, res) => {
  try {
    const expireToken = 60 * 24 * 30;
    const updateToken = jwt.sign({ uid }, process.env.JWT_REFRESH_KEY, {
      expiresIn: expireToken,
    });
    return res.cookie("updateToken", updateToken, {
      httpOnly: true,
      secure: !(process.env.MODE === "developer"),
      sameSite: "none",
      expires: new Date(Date.now() + expireToken * 1000),
    });
  } catch (error) {
    console.log(error);
  }
};
