const router = require("express").Router();

const businessService = require("../services/businessService");

const { isNotAuthorized } = require("../middlewares/userMiddleware");

router.get("/create", isNotAuthorized, (req, res) => {
  res.render("create");
});

router.get("/all", async (req, res) => {
  const availableBusiness = await businessService.getAll();

  res.render("catalog", { availableBusiness });
});

router.get("/details/:id", async (req, res) => {
  const business = await businessService.getOneDetailed(req.params.id);

  const isOwner = req.user?._id == business.creator;
  const hasBuyed = business.buyers.some((x) => x._id == req.user?._id);

  res.render("details", { business, isOwner, hasBuyed });
});

router.get("/buy/:id", isNotAuthorized, async (req, res) => {
  await businessService.buy(req.user._id, req.params.id);

  res.redirect(`/business/details/${req.params.id}`);
});

router.get("/edit/:id", isNotAuthorized, async (req, res) => {
  const business = await businessService.getOne(req.params.id);
  const payment = createOptions(business.payment);

  res.render("edit", { business, payment });
});

router.get("/remove/:id", isNotAuthorized, async (req, res) => {
  try {
    await businessService.remove(req.params.id);

    res.redirect("/business/all");
  } catch (error) {
    const business = await businessService.getOne(req.params.id);
    const isOwner = true;

    res.render("details", { business, isOwner, error });
  }
});

router.get("/search", isNotAuthorized, async (req, res) => {
  let business;

  if (Object.values(req.query).length !== 0) {
    business = await businessService.search(req.query.name, req.query.payment);
  } else {
    business = await businessService.getAll();
  }

  res.render("search", { business });
});

router.get("/requirements", (req, res) => {
  res.render("requirements");
});

router.post("/create", isNotAuthorized, async (req, res) => {
  try {
    await businessService.create(req.body, req.user);

    res.redirect("/business/all");
  } catch (error) {
    res.render("create", { error, information: req.body });
  }
});

router.post("/edit/:id", isNotAuthorized, async (req, res) => {
  await businessService.edit(req.params.id, req.body);

  await res.redirect(`/business/details/${req.params.id}`);
});

function createOptions(category) {
  return [
    { content: "Crypto Wallet", value: "crypto-wallet" },
    { content: "Credit Card", value: "credit-card" },
    { content: "Debit Card", value: "debit-card" },
    { content: "PayPal", value: "paypal" },
  ].map((x, i) => (x.value === category ? { ...x, selected: "selected" } : x));
}

module.exports = router;
