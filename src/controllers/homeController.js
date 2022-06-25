const router = require("express").Router();

const businessService = require("../services/businessService");

router.get("/", async (req, res) => {
  const prices = await businessService.coinsPrice();

  const separate = Object.entries(prices);
  const bitcoin = Number(separate[0][1]).toFixed(3);
  const ethereum = Number(separate[1][1]).toFixed(3);
  const dogecoin = Number(separate[2][1]).toFixed(3);

  res.render("home", { bitcoin, ethereum, dogecoin });
});

module.exports = router;
