export const objectives = function (req, res) {
  res.json({ results: [] })
};

export const objectivesCount = function (req, res) {
  res.json({ archived_count: 0, not_archived_count: 0 })
};
