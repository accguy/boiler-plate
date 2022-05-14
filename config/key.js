if(process.env.NODE_ENV === 'production') { //after prod
    module.exports = require('./prod');
}else { //in dev
    module.exports = require('./dev');
}