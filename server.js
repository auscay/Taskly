const app = require('./app')

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server started on PORT: http://localhost:${PORT}`);
})