# Point of Sale System

A web-based point of sale system for managing inventory, sales, purchases, and business operations.

> ⚠️ **CAUTION**: This project is currently under active development and may be incomplete. Some features might not be fully implemented or may contain bugs. Use in production environments is not recommended at this stage.

## Features

- User authentication and role management (Admin/User)
- Dashboard with sales analytics and reports
- Product/Goods management with barcode support
- Supplier management
- Customer management
- Purchase order processing
- Sales transaction handling
- Unit conversion system
- Stock tracking
- Real-time updates using Socket.IO

## Technology Stack

- Backend: Node.js + Express.js
- Database: PostgreSQL
- Template Engine: EJS
- Frontend: Bootstrap + SB Admin 2 theme
- Authentication: Express Session + BCrypt
- Real-time: Socket.IO
- File Upload: Express FileUpload
- Report Export: json2csv
- Date Handling: Moment.js

## Prerequisites

- Node.js (>= v12)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/pos.git
cd pos
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env file with your database credentials and other configurations
```

4. Create database and run migrations
```bash
npm run db:create
npm run db:migrate
# or
yarn db:create
yarn db:migrate
```

5. Start the application
```bash
npm start
# or
yarn start
```

## Project Structure
```
pos/
├── bin/                    # Application entry point
│   └── www                # Server startup script
├── models/                # Database models
│   ├── Customer.js        
│   ├── Good.js           
│   ├── pg.js             # DB connection
│   ├── Purchase.js       
│   ├── Sale.js          
│   ├── Supplier.js      
│   ├── Unit.js          
│   └── User.js          
├── public/               
│   ├── images/          
│   ├── javascripts/     
│   ├── stylesheets/     
│   └── vendor/          
├── routes/              
│   ├── customers.js     
│   ├── dashboard.js     
│   ├── goods.js        
│   ├── index.js        
│   ├── purchases.js    
│   ├── sales.js        
│   └── socketapi.js     
├── views/               # EJS templates
├── helpers/            
│   └── util.js         # Utility functions
├── app.js              # Express config
└── package.json
```

## Key Features

### User Management

- Role-based access control (Admin/Regular)
- Profile management
- Password encryption

### Inventory Management

- Product tracking
- Stock management
- Unit conversion
- Barcode support

### Transactions

- Purchase order creation
- Sales processing
- Transaction history
- Receipt generation

### Reporting

- Sales analytics
- Inventory reports
- Revenue tracking
- CSV export capability

## Development

To run in development mode with auto-reload:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Database Setup

## Database Setup (In Progress)

1. Create a PostgreSQL database (Coming Soon)
2. Update the database configuration in `.env` (Under Development)
3. Run migrations (To Be Implemented):
```bash
npm run db:migrate
# or
yarn db:migrate
```

*Note: This section is currently being updated with detailed instructions.*

## Testing

Run the test suite:
```bash
npm test
# or
yarn test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

