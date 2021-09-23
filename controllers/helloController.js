const sayHello = (req, res) => {
  res.send('Hola!')
}

const getHello = (req, res) => {
  const { hello } = req.params
  res.send('Hola obtenido: ' + hello)
}

module.exports = { sayHello, getHello }
