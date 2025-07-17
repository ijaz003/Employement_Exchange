const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({
        message: "Logged out successfully!",
      });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default logout;