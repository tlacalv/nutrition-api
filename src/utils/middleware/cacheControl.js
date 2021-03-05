const cacheControl = () => {
  //usamos middleware
  return (req, res, next) => {
    // here you can define period in second, this one is 5 minutes
    const maxAge = 30;
    const swr = 59;
    
    
    res.append('Cache-Control', `max-age=${maxAge}, stale-while-revalidate=${swr}`);
    
    next();
  };
};

module.exports = cacheControl;
