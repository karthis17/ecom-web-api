import sqlite3 from "sqlite3";
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../instance/database.db');

export const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err, "hi");
    } else {
        // db.run("CREATE TABLE IF NOT EXISTS admin_users (id INTEGER PRIMARY KEY, usernaem TEXT, password TEXT)");
        // db.run("INSERT INTO admin_users (usernaem, password) VALUES ('root', 'password')")
        // db.run('CREATE TABLE cart_list (id INTEGER PRIMARY KEY, user_id INTEGER, quantity INTEGER, productName TEXT, price REAL, order_id INTEGER, product_id INTEGER, FOREIGN KEY (user_id) REFERENCES user(id), FOREIGN KEY (order_id) REFERENCES order_history(id), FOREIGN KEY (product_id) REFERENCES products(id))', err => {
        //     if (err) {
        //         console.error(err);
        //     }
        // });

        // db.run('DELETE FROM delivery_deatails')
        // db.run('CREATE TABLE delivery_deatails(id INTEGER PRIMARY KEY, address TEXT, phone TEXT, email TEXT, user_id INTEGER, FOREIGN KEY (user_id) REFERENCES user(id) )')
        // db.all('SELECT * FROM products WHERE LOWER(about) LIKE ? COLLATE NOCASE', [`%${'8gb'}%`], (err, res) => {
        //     console.log(err, res);
        // });

        // db.run("DROP TABLE products");
        // db.run(`CREATE TABLE products (id TEXT, productName TEXT, price INTEGER NOT NULL, images TEXT, thumbnail TEXT, description TEXT NOT NULL, quantity INTEGER, discount INTEGER NOT NULL, about TEXT)`)

        // db.run(`ALTER TABLE order_history ADD COLUMN date TEXT`, (err) => {
        //     console.error(err, "hi");
        // })
        // db.run('DELETE FROM order_history')
        // db.run('DELETE FROM cart_list');
        // db.run("ALTER TABLE cart_list ADD COLUMN total INTEGER ")
    }
    //     db.serialize(() => {
    //         db.run(`CREATE TABLE products (
    //             id TEXT,
    //             productName TEXT,
    //             price INTEGER NOT NULL,
    //             images TEXT,
    //             thumbnail TEXT,
    //             description TEXT NOT NULL,
    //             quantity INTEGER,
    //             discount INTEGER NOT NULL,
    //             about TEXT
    //          )`, (Err) => {
    //             if (Err) {
    //                 console.error("Error creating 'user' table:", createUserErr);
    //             } else {
    //                 db.run(`CREATE TABLE  user (
    //                     id INTEGER PRIMARY KEY,
    //                     name TEXT,
    //                     email TEXT NOT NULL UNIQUE,
    //                     password TEXT NOT NULL
    //                  )`, (Err) => {
    //                     if (Err) {
    //                         console.error("Error creating 'todolist' table:", createTodoListErr);
    //                     } else {
    //                         db.run(`CREATE TABLE cart_list (
    //                             id INTEGER PRIMARY KEY,
    //                             user_id INTEGER,
    //                             quantity INTEGER,
    //                             productName TEXT,
    //                             price NUMBER,
    //                             FOREIGN KEY (user_id) REFERENCES user(id)
    //                         )`)
    //                     }
    //                 });
    //             }
    //         });
    //     });
    // }
    // const productsData = [
    //     {
    //         "id": "1",
    //         "productName": "ASUS Vivobook 16X",
    //         "description": "Powerful Asus laptop featuring an i5 12th Gen processor with 8GB RAM and 1TB ROM. Ideal for everyday use and multitasking.",
    //         "price": 50000,
    //         "quantity": 5,
    //         "thumbnail": "https://m.media-amazon.com/images/I/717OtKImm9L._SX679_.jpg",
    //         "discount": 10,
    //         "images": [
    //             "https://m.media-amazon.com/images/I/71KXxVGeMVL._SL1500_.jpg",
    //             "https://m.media-amazon.com/images/I/61Jj60hH8fL._SL1500_.jpg",
    //             "https://m.media-amazon.com/images/I/71ZvFvr4C9L._SL1500_.jpg",
    //             "https://m.media-amazon.com/images/I/71ZvFvr4C9L._SL1500_.jpg"
    //         ],
    //         "about": [
    //             "High-performance i5 12th Gen processor",
    //             "8GB RAM and 1TB ROM for ample storage",
    //             "Sleek and stylish design",
    //             "Ideal for multitasking and everyday use",
    //             "Enhanced portability",
    //             "High-quality display for immersive experience"
    //         ]
    //     },
    //     {
    //         "id": "2",
    //         "productName": "HP Pavilion x360 Convertible",
    //         "description": "Versatile HP Pavilion x360 featuring an Intel Core i7 processor, 16GB RAM, and a speedy 512GB SSD. Can be used as a laptop or tablet.",
    //         "price": 80000,
    //         "quantity": 8,
    //         "thumbnail": "https://m.media-amazon.com/images/I/71NYNZlAtmL._AC_UY218_.jpg",
    //         "discount": 15,
    //         "images": [
    //             "https://m.media-amazon.com/images/I/71NYNZlAtmL._AC_UY218_.jpg",
    //             "https://m.media-amazon.com/images/I/81IRl9Un2JL._SX522_.jpg",
    //             "https://m.media-amazon.com/images/I/811hN3E-ivL._SX522_.jpg"
    //         ],
    //         "about": [
    //             "Powerful Intel Core i7 processor",
    //             "16GB RAM for seamless multitasking",
    //             "Fast and efficient 512GB SSD storage",
    //             "Convertible design for versatile use",
    //             "Great for both laptop and tablet functionality",
    //             "Sleek and modern design"
    //         ]
    //     },
    //     {
    //         "id": "3",
    //         "productName": "Dell Inspiron 14",
    //         "description": "Dell Inspiron 14 powered by a Ryzen 5 processor, 8GB RAM, and a fast 256GB SSD. Perfect for both work and entertainment purposes.",
    //         "price": 60000,
    //         "quantity": 3,
    //         "thumbnail": "https://m.media-amazon.com/images/I/61guW+HW2SL._AC_UY218_.jpg",
    //         "discount": 5,
    //         "images": [
    //             "https://m.media-amazon.com/images/I/61guW+HW2SL._AC_UY218_.jpg",
    //             "https://m.media-amazon.com/images/I/71JZniQbGML._SX300_SY300_QL70_FMwebp_.jpg",
    //             "https://m.media-amazon.com/images/I/61WZbfCP0zL._SX300_SY300_QL70_FMwebp_.jpg"
    //         ],
    //         "about": [
    //             "Powerful Ryzen 5 processor for efficient performance",
    //             "8GB RAM ensures smooth multitasking",
    //             "Fast 256GB SSD for quick data access",
    //             "Perfect for work and entertainment purposes",
    //             "Portable and sleek design",
    //             "Great display for an immersive experience"
    //         ]
    //     },
    //     {
    //         "id": "4",
    //         "productName": "Lenovo ThinkPad E15",
    //         "description": "Reliable Lenovo ThinkPad E15 with an Intel Core i5 processor, 16GB RAM, and a spacious 1TB SSD storage. Built for professional use.",
    //         "price": 70000,
    //         "quantity": 6,
    //         "thumbnail": "https://m.media-amazon.com/images/I/61Dw5Z8LzJL._SX300_SY300_QL70_FMwebp_.jpg",
    //         "discount": 12,
    //         "images": [
    //             "https://m.media-amazon.com/images/I/61-XXPIOivL._AC_UY218_.jpg",
    //             "https://m.media-amazon.com/images/I/71704tDr9NL._SX679_.jpg",
    //             "https://m.media-amazon.com/images/I/51pfpPoCyQL.jpg"
    //         ],
    //         "about": [
    //             "Reliable Intel Core i5 processor for consistent performance",
    //             "Massive 16GB RAM for handling multiple tasks",
    //             "Spacious 1TB SSD storage for ample data storage",
    //             "Designed specifically for professional use",
    //             "Robust build quality for durability",
    //             "High-resolution display for clear visuals"
    //         ]
    //     },
    //     {
    //         "id": "5",
    //         "productName": "Acer Swift 3",
    //         "description": "Acer Swift 3 powered by an AMD Ryzen 7 processor, 512GB SSD, and 16GB RAM. Offers great performance and portability.",
    //         "price": 75000,
    //         "quantity": 10,
    //         "thumbnail": "https://m.media-amazon.com/images/I/91yXhj4zw5L._AC_UY218_.jpg",
    //         "discount": 8,
    //         "images": [
    //             "https://m.media-amazon.com/images/I/41i9ptA+ZTL._SX300_SY300_.jpg",
    //             "https://m.media-amazon.com/images/I/81JXn3r2UBL._SX679_.jpg",
    //             "https://m.media-amazon.com/images/I/81OgT+FBQKL._SX679_.jpg",
    //             "https://m.media-amazon.com/images/I/81mjyBr8xOL._SX679_.jpg"
    //         ],
    //         "about": [
    //             "High-performance AMD Ryzen 7 processor",
    //             "512GB SSD and 16GB RAM for swift operations",
    //             "Great balance between performance and portability",
    //             "High-quality display for immersive visuals",
    //             "Sleek and lightweight design",
    //             "Long-lasting battery life"
    //         ]
    //     },
    //     {
    //         "id": "6",
    //         "productName": "Apple MacBook Air",
    //         "description": "Apple MacBook Air featuring the powerful M1 Chip, 256GB SSD, and 8GB RAM. Offers exceptional performance in a sleek design.",
    //         "price": 90000,
    //         "quantity": 4,
    //         "thumbnail": "https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg",
    //         "discount": 20,
    //         "images": [
    //             "https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg",
    //             "https://m.media-amazon.com/images/I/71yCKaQXv+L._SX679_.jpg",
    //             "https://m.media-amazon.com/images/I/91KREQM8C6L._SX679_.jpg",
    //             "https://m.media-amazon.com/images/I/71U-3BfjvjL._SX679_.jpg"
    //         ],
    //         "about": [
    //             "Incredibly powerful M1 Chip for blazing-fast performance",
    //             "256GB SSD and 8GB RAM for smooth operations",
    //             "Sleek and stylish design typical of Apple products",
    //             "High-resolution display for clear visuals",
    //             "Enhanced security features",
    //             "Long-lasting battery life"
    //         ]
    //     },
    //     {
    //         "id": "7",
    //         "productName": "Microsoft Surface Laptop 4",
    //         "description": "Microsoft Surface Laptop 4 featuring an AMD Ryzen 5 processor, 256GB SSD, and 8GB RAM. Offers premium design and performance.",
    //         "price": 85000,
    //         "quantity": 7,
    //         "thumbnail": "https://m.media-amazon.com/images/I/71p-M3sPhhL._AC_UY218_.jpg",
    //         "discount": 18,
    //         "images": [
    //             "https://m.media-amazon.com/images/I/71p-M3sPhhL._AC_UY218_.jpg"
    //         ],
    //         "about": [
    //             "AMD Ryzen 5 processor for efficient performance",
    //             "256GB SSD and 8GB RAM for smooth operations",
    //             "Premium design and build quality",
    //             "Great for productivity and daily use",
    //             "High-resolution display for clear visuals",
    //             "Portable and lightweight"
    //         ]
    //     }
    // ]

    // productsData.forEach((product) => {
    //     const images = JSON.stringify(product.images);
    //     const about = JSON.stringify(product.about);

    //     const sql = `INSERT INTO products (id, productName, description, price, quantity, thumbnail, discount, images, about) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    //     const values = [
    //         product.id,
    //         product.productName,
    //         product.description,
    //         product.price,
    //         product.quantity,
    //         product.thumbnail,
    //         product.discount,
    //         images,
    //         about
    //     ];

    //     db.run(sql, values, function (err) {
    //         if (err) {
    //             return console.error(err.message);
    //         }
    //         console.log(`A row has been inserted with rowid ${this.lastID}`);
    //     });
    // });
});


