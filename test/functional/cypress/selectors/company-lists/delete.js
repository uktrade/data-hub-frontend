module.exports = {
  errorHeader: 'div h2',
  insetListItem: {
    byIndex: (index) => `#delete-company-list li:nth-child(${index})`,
  },
  deleteButton: '#delete-company-list button',
  returnAnchor: '#delete-company-list a',
}
