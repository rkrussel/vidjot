if(process.env.NODE_ENV === 'production') {
    module.exports = {mongoURI: "mongodb://rich-admin:vitalogy@ds153392.mlab.com:53392/vidjot-prod",}
} else {
    module.exports = {mongoURI: "mongodb://localhost/vidjot-dev"}

}