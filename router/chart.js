import { Orders } from "../model/order.model.js";
import express from "express";

const router = express.Router();

router.get('/today_sales', async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours to midnight for the beginning of the day

    try {
        // Find orders placed today
        const orderCount = await Orders.find({
            createdAt: {
                $gte: today,
                $lte: Date.now()
            } // Today's date up to the end of the day
        });

        let total = 0;

        orderCount.forEach((order) => {
            total += order.total
        })

        res.send({ totalSales: orderCount.length, totalAmount: total });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send(error.message);
    }

});



router.get('/monthly_sales', async (req, res) => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = Date.now();

    try {
        const monthlySales = await Orders.find({ createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth } })

        console.log(monthlySales)
        if (monthlySales.length > 0) {


            let total = 0;

            monthlySales.forEach((order) => {
                total += order.total
            })
            res.send({ totalSales: monthlySales.length, totalAmount: total });
        } else {
            res.send({ totalSales: 0, totalAmount: 0 });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send(error.message)
    }
});


router.get('/total_sales', async (req, res) => {

    try {
        const total = await Orders.aggregate([
            {
                $group: {
                    _id: null, // Group by all documents
                    totalAmount: { $sum: "$total" } // Calculate the sum of the 'total' field
                }
            }
        ]);


        res.send({ totalSales: total });
    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.get('/chart_data', async function (req, res) {
    try {
        const fromDate = new Date(parseInt(req.query.fromDate));
        const interval = req.query.interval;
        const salesData = await getSalesDataForRange(fromDate, interval);

        let salesMap = [];

        if (interval === 'month') {
            salesMap = await getDaysArray(fromDate.getMonth(), fromDate.getFullYear(), salesData);
        } else {

            for (let i = 1; i <= 12 && isCurrentMonth(-1, i - 2, fromDate.getFullYear()); i++) {
                let sle = salesData.find(entry => {
                    return i === entry.month;
                });

                if (sle) {

                    salesMap.push({ month: sle.month - 1, count: sle.count });
                } else {
                    salesMap.push({ month: i - 1, count: 0 });

                }

            }
        }

        res.send(salesMap);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send(error.message);
    }
});

async function getDaysArray(month, year, salesData) {
    const numDays = new Date(year, month + 1, 0).getDate(); // Get the number of days in the month
    const daysArray = [];



    for (let i = 1; i <= numDays && isCurrentMonth(i, month, year); i++) {
        let entry = salesData.find(data => {
            return +data._id === +i; // Check if there's data for this day
        });

        if (entry) {
            daysArray.push({ date: +entry._id, count: entry.count, month });
        } else {
            daysArray.push({ date: i, count: 0, month });
        }
    }

    return daysArray;
}


function isCurrentMonth(date, month, year) {

    const todayDate = new Date();

    const currentMonth = todayDate.getMonth();
    const currentDate = todayDate.getDate();
    const currentYear = todayDate.getFullYear();

    if (year === currentYear) {

        if (month < currentMonth) {
            return true;
        }
        else if (date <= currentDate && date !== -1) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}


async function getSalesDataForRange(date, interval) {
    let pipeline = [];
    if (interval === 'year') {
        pipeline = [
            {
                $match: {
                    $expr: { $eq: [{ $year: "$createdAt" }, { $year: date }] }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    month: "$_id",
                    count: 1,
                    _id: 0
                }
            },
            {
                $sort: { month: 1 }
            }
        ];
    } else if (interval === 'month') {
        pipeline = [
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: [{ $year: "$createdAt" }, { $year: date }] }, // Match year
                            { $eq: [{ $month: "$createdAt" }, { $month: date }] } // Match month
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ];
    }

    const salesData = await Orders.aggregate(pipeline);
    return salesData;
}



export default router;
