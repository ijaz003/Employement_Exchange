const getUser = (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default getUser;