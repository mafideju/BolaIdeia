var generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: new Date().toDateString()
  }
}

module.exports = { generateMessage }