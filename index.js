const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const multiparty = require('multiparty');
const app = express();
const con = require('./middleware/connect.js');
const cf = require('./middleware/common_functions_server.js');
const path = require('path');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));


app.get('/', (req, res) => {

    res.render('index');
});


app.post('/', async (req, res) => {

    try {

        const form = new multiparty.Form();
        form.parse(req, async (err, fields, files) => {

            if (err) {
                return res.json({ status: 400, message: 'The file seems corrupt please upload a different file!!' });
            }

            if (cf.checkempty(files) || cf.checkempty(fields)) {
                return res.json({ status: 400, message: 'The file seems corrupt please upload a different file!!' });
            }

            let uploaded_img = files['uploaded_img'][0];

            let { file_status, message } = await cf.check_file_promise(uploaded_img, ['.jpeg', '.jpg', '.png'], 500, 'kb');

            if (!file_status) {
                return res.json({ status: 400, message: message });
            }

            let img = fields['imagebase64'][0];
            let data = img.replace(/^data:image\/\w+;base64,/, "");
            let buffer = new Buffer(data, 'base64');
            let new_name = Date.now() + '' + path.extname(uploaded_img.originalFilename);
            let newPath = './public/uploads/uploaded_img/' + new_name;

            await cf.upload_file(newPath, buffer);
            await cf.sq.return_results(`Insert into img_details (img_name, prep_datetime) values('${new_name}', now())`);

            res.json({ status: 200, message: 'Image uploaded successfully!!' });

        });

    }
    catch (err) {
        res.json({ status: 400, message: 'Something went wrong!! Please try after some time!!' });
    }

});


app.get('/uploaded_images', async (req, res) => {

    try {

        let results = await cf.sq.return_results(`SELECT sr_id, img_name from img_details order by sr_id desc`);

        if (results.length > 0) {

            let send_array = [];

            results.map(element => {

                let { sr_id } = element;
                element.sr_id = cf.encrypt(sr_id)
                send_array.push(element);

            });

            res.render('uploaded_images', { results: send_array });

        }
        else {
            res.render('uploaded_images');
        }

    }
    catch (err) {
        res.render('uploaded_images', { error: 'Something went wrong!! Please try after some time!!' });
    }

});


app.get('/edit_image/:id', async (req, res) => {

    let { id } = req.params;
    let sr_id = cf.decrypt(id);

    try {

        let results = await cf.sq.return_results(`SELECT sr_id, img_name as edit_img_name from img_details where sr_id = ${sr_id}`);
        res.render('edit_image', { sr_id: id, edit_img_name: results[0].edit_img_name });

    }
    catch (err) {
        res.render('edit_image', { error: 'Something went wrong!! Please try after some time!!' });
    }

});


app.put('/', async (req, res) => {

    try {

        const form = new multiparty.Form();
        form.parse(req, async (err, fields, files) => {

            if (err) {
                return res.json({ status: 400, message: 'The file seems corrupt please upload a different file!!' });
            }

            if (cf.checkempty(files) || cf.checkempty(fields)) {
                return res.json({ status: 400, message: 'The file seems corrupt please upload a different file!!' });
            }

            let uploaded_img = files['uploaded_img'][0];

            let { file_status, message } = await cf.check_file_promise(uploaded_img, ['.jpeg', '.jpg', '.png'], 500, 'kb');

            if (!file_status) {
                return res.json({ status: 400, message: message });
            }

            let img = fields['imagebase64'][0];
            let sr_id = fields['sr_id'][0];
            sr_id = cf.decrypt(sr_id);

            let data = img.replace(/^data:image\/\w+;base64,/, "");
            let buffer = new Buffer(data, 'base64');
            let new_name = Date.now() + '' + path.extname(uploaded_img.originalFilename);
            let newPath = './public/uploads/uploaded_img/' + new_name;

            await cf.upload_file(newPath, buffer);
            await cf.sq.return_results(`Update img_details set img_name = '${new_name}', mod_datetime = now() where sr_id = ${sr_id}`);

            res.json({ status: 200, message: 'Image Successfully Updated!!' });

        });

    }
    catch (err) {
        res.json({ status: 400, message: 'Something went wrong!! Please try after some time!!' });
    }

});


app.delete('/:id', async (req, res) => {

    try {

        let { id } = req.params;
        id = cf.decrypt(id);

        await cf.sq.return_results(`Delete from img_details where sr_id = ${id}`);
        res.json({ status: 200, message: 'Image Deleted Successfully!!' });

    } catch (err) {
        res.json({ status: 400, message: 'Something went wrong. Please try after sometime!!' });
    }

});


process.on('uncaughtException', (err) => {
    console.log(err);
});


process.on('unhandledRejection', (err) => {
    console.log(err);
});


app.listen(3000);
