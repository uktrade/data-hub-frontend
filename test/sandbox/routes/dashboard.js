import homePageJson from '../fixtures/dashboard/homepage.json' assert { type: 'json' };

export const homePage = function (req, res) {
  res.json(homePageJson)
};
