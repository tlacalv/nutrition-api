const errorBoom = (error, res) => {
  if (error.isBoom){
    const { statusCode, message } = error.output.payload
    res.status(statusCode).json({message})
  }else{
    res.status(500).json({message: 'Internal server error'})

  }
}

module.exports = {
  errorBoom
}