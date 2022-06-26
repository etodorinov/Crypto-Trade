const CoinGecko = require("coingecko-api");

const User = require("../models/User");
const Business = require("../models/Business");

exports.create = async (information, user) => {
  if (information.name.length < 2) {
    throw new Error("The crypto name should be at least 2 characters long.");
  }

  if (
    !information.image.startsWith("http://") &&
    !information.image.startsWith("https://")
  ) {
    throw new Error(
      "You should fill in a valid link in the Crypto Image field."
    );
  }

  if (Number(information.price) < 0.01) {
    throw new Error(
      "The price should be a positive number and should have a value of at least 0.01."
    );
  }

  if (information.description.length < 10) {
    throw new Error("The description should be at least 10 characters long.");
  }

  if (
    information.payment !== "crypto-wallet" &&
    information.payment !== "credit-card" &&
    information.payment !== "debit-card" &&
    information.payment !== "paypal"
  ) {
    throw new Error(
      "The allowed payment methods are crypto-wallet, credit-card, debit-card and paypal."
    );
  }

  const business = {
    name: information.name,
    image: information.image,
    price: information.price,
    description: information.description,
    payment: information.payment,
  };

  const owner = await User.findById(user._id);
  const createdBusiness = await Business.create(business);

  owner.businessCreated.push(createdBusiness);
  createdBusiness.creator = owner;

  owner.save();
  createdBusiness.save();
};

exports.getAll = async () => await Business.find().lean();

exports.getOne = async (businessId) =>
  await Business.findById(businessId).lean();

exports.getOneDetailed = async (businessId) =>
  await Business.findById(businessId).populate("buyers").lean();

exports.buy = async (userId, businessId) => {
  const business = await Business.findById(businessId);
  const user = await User.findById(userId);

  business.buyers.push(userId);
  user.businessBuyed.push(businessId);

  await business.save();
  await user.save();
};

exports.edit = async (businessId, information) => {
  console.log(information);

  const business = {
    name: information.name,
    image: information.image,
    price: information.price,
    description: information.description,
    payment: information.payment,
  };

  await Business.findByIdAndUpdate(businessId, business);
};

exports.remove = async (businessId) => {
  const business = await Business.findById(businessId);

  if (!business.initialCoin) {
    await Business.findByIdAndDelete(businessId);
  } else {
    throw new Error("You can not remove an initial coin.");
  }
};
exports.search = async (nameLook, paymentLook) =>
  await Business.find({
    name: { $regex: new RegExp(nameLook, "i") },
    payment: { $regex: new RegExp(paymentLook, "i") },
  }).lean();

exports.coinsPrice = async () => {
  const CoinGeckoClient = new CoinGecko();

  let data = await CoinGeckoClient.exchanges.fetchTickers("bitfinex", {
    coin_ids: ["bitcoin", "ethereum", "dogecoin"],
  });
  let _coinList = {};
  let _datacc = data.data.tickers.filter((t) => t.target == "USD");
  ["BTC", "ETH", "DOGE"].forEach((i) => {
    let _temp = _datacc.filter((t) => t.base == i);
    let _res = _temp.length == 0 ? [] : _temp[0];
    _coinList[i] = _res.last;
  });

  return _coinList;
};
