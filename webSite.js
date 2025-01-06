const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(8888);
console.log('Server Running...');

const path = require('path');
app.use('/public', express.static(path.join(__dirname, 'public')));

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.text());

let multer = require('multer');

//let upload = multer({ dest: './public' });

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,'./public') 
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) 
    }
  })

const upload = multer({storage: storage})

app.post('/upload', upload.single('userfile'), function(req, res){
    dbInsert(req.file.originalname)
    res.send('Uploaded! : '+ req.file.originalname);
    console.log(req.file);
});

const mariadb = require('mariadb');
const connection = mariadb.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'master',
    database: 'my'
});

async function dbInsert(filename) {
    let conn;

    conn = await connection;

    const result = await conn.query(`INSERT INTO files (filename) VALUES ('${filename}');`);
   
    console.log(result);
}

async function dbQuery() {
    let conn;

    conn = await connection;

    const result = await conn.query(`SELECT filename,  upload_date from files;`);
   
    console.log(result);

}
app.get('/show', function(req, res){
    dbQuery();
    res.send('show');
});

