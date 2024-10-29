Aave Lending and Borrowing Rates Display
This application displays borrowing and lending rates from the Aave protocol, built with React and Ethers.js.

Prerequisites
Make sure you have the following installed:

Node.js v18.19.1
npm v10.2.4
Getting Started
Follow these steps to install dependencies, set up the environment, and run the app.

1. Clone the Repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
2. Install Dependencies
Install the required packages using npm:
npm install
3. Environment Variables
Create a .env file in the root of the project to configure environment variables required by the app. Your .env file should include:

VITE_POOL_CONTRACT_ADDRESS=your_pool_contract_address
VITE_RPC_URL=rpc_url

4. Start the Application
Run the development server:

npm run dev
Your app should now be running on http://localhost:5173 (or the port specified in your .env file if configured).

Usage
Once the app is running, you should be able to see the borrowing and lending rates fetched from Aave. The interface provides insights into the rates for various assets supported by Aave.

Challenges:
1. Efficient Handling of Reserves All Token:
The data retrieved by calling getAllReservesTokens is fixed and does not change frequently. Therefore, we should avoid repeated network requests for this data and instead cache it locally in the browser (localStorage). This reduces loading time and minimizes redundant API calls.

2. Managing Multiple Requests for Reserve Data:
- Each reserve's data must be retrieved individually by calling getReserveData, which requires multiple API calls to get all necessary information.
- To handle this:
- Introduce a small delay at the beginning of each call to avoid rate-limiting issues and to prevent overwhelming the server.
- Cache the retrieved data and only make new API calls if 5 minutes have passed since the last retrieval. This ensures that data is reasonably up-to-date without unnecessary requests.
- This approach also helps us avoid hitting the RPC rate limit threshold, ensuring the app can continue retrieving data smoothly without disruptions.



Built With
React - For building the frontend interface
Ethers.js - For connecting and interacting with the Ethereum blockchain

