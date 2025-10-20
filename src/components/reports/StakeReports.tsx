import {TransactionData} from "../../lib/appModels.ts";

export const convertToCSV = (data: TransactionData[]): string => {
    const headers = ['Stake ID', 'Operator', 'Customer Name', 'Game Played', 'Bet Amount', 'Won', 'LGA', 'Date'];
    return [
        headers.join(','),
        ...data.map(row => [
            row.referenceNumber,
            `"${row.stakeRegistration?.operator?.name}"`,
            `"${row.stakeRegistration?.customer?.name}"`,
            `"${row.stakeRegistration?.customer?.gamePlayed}"`,
            `"${row.stakeRegistration?.customer?.amount}"`,
            `"${row.amountWon}"`,
            `"${row.stakeRegistration?.location?.lgaCode}"`,
            `"${new Date(row.createdOn * 1000).toLocaleDateString()}"`
        ].join(','))
    ].join('\n');
};

export const convertToPDF = (filteredData: TransactionData[]): string => {
    // Create a simple HTML table for PDF generation
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Stakes Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .header { text-align: center; margin-bottom: 20px; }
          .date { font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Stakes Report</h1>
          <p class="date">Generated on: ${new Date().toLocaleDateString()}</p>
          <p>Total Records: ${filteredData.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Stake ID</th>
              <th>Operator</th>
              <th>Customer Name</th>
              <th>Game Played</th>
              <th>Bet Amount</th>
              <th>Winnings</th>
              <th>LGA</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData.map(row => `
              <tr>
                <td>${row.referenceNumber}</td>
                <td>${row.stakeRegistration?.operator?.name}</td>
                <td>${row.stakeRegistration?.customer?.name}</td>
                <td>${row.stakeRegistration?.customer?.gamePlayed}</td>
                <td>${row.stakeRegistration?.customer?.amount}</td>
                <td>${row.amountWon}</td>
                <td>${row.stakeRegistration?.location?.lgaCode}</td>
                <td>${new Date(row.createdOn * 1000).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
}