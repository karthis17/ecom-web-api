import express from 'express';
import { Invoice } from '../model/invoice.model.js';
import { generatePDF } from '../controller/order.controller.js';
import { Orders } from '../model/order.model.js';

const router = express.Router();



router.get('/', async function (req, res) {
    try {
        const invoice = await Invoice.find().populate('user');

        res.send(invoice);
    } catch (error) {
        res.status(505).send(error.message);
    }
});


router.get('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate('user').populate({
            path: 'order',
            populate: ['product', 'delivery_address']
        });;

        res.send(invoice);
    } catch (error) {
        res.status(500).send(error.message);
    }
});



router.get('/download-pdf/:id', async (req, res) => {
    try {
        // Generate the PDF using your function
        const data = await Invoice.findById(req.params.id)
            .populate({
                path: 'order',
                populate: ['product', 'delivery_address']
            });

        console.log(data);

        generatePDF(data, false).then((pdfBuffer) => {

            console.log(pdfBuffer);
            // Set response headers
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
            res.setHeader('Content-Length', pdfBuffer.length);

            // Send the PDF buffer as the response
            res.send(pdfBuffer);
        }).catch((err) => {
            console.error('Error generating PDF:', err);
            res.status(500).send('Error generating PDF');
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});



export default router;