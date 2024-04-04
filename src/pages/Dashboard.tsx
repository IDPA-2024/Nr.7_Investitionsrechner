
import { useEffect, useState } from "react";
import { MainScreen } from "../components/dashboard/MainScreen";
import InvestmentData from "../MockData/InvestmentData.json";
import StockData from "../MockData/StockData.json";
export function DashboardPage() {
  const [investments, setInvestments] = useState([]);
  const [eachDayInvestment, setEachDayInvestment] = useState([]);

  useEffect(() => {
    const updatedInvestments = InvestmentData.map(investment => {
      const purchaseDate = new Date(investment.purchase.date);
      let historicalData = [];

      if (typeof investment.historicalData === 'string') {
        historicalData = StockData[investment.historicalData].map(data => {
          const pricePerUnit = (data.pricePerUnit * investment.purchase.units).toFixed(2);
          return { date: data.date, pricePerUnit: parseFloat(pricePerUnit) };
        });
      } else {
        historicalData = investment.historicalData.map(data => {
          return { date: data.date, pricePerUnit: data.pricePerUnit * investment.purchase.units };
        });
      }

      // Filter out historical data entries before the purchase date
      historicalData = historicalData.filter(data => new Date(data.date) > purchaseDate);
      historicalData.unshift({ date: investment.purchase.date, pricePerUnit: investment.purchase.units * investment.purchase.pricePerUnit });  
      
      return { ...investment, historicalData };
    });

    setInvestments(updatedInvestments);
  }, []);

  function processMultipleHistoricalData(dataSets) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const formattedYesterday = `${today.getFullYear()}-${(yesterday.getMonth() + 1).toString().padStart(2, '0')}-${yesterday.getDate().toString().padStart(2, '0')}`;

    const processedDataSets = [];

    dataSets.forEach((dataSet, index) => {
      const processedDataSet = {
        ...dataSet,
        historicalData: []

      };
      dataSet.historicalData.sort((a, b) => new Date(a.date) - new Date(b.date));
      const firstDate = new Date(dataSet.purchase.date);
      const daysTillNow = Math.abs(Math.floor((today - firstDate) / (24 * 60 * 60 * 1000)));

      let lastKnownPrices = dataSet.purchase.pricePerUnit * dataSet.purchase.units;
      for (let day = 0; day < daysTillNow; day++) {
        const currentDate = new Date(firstDate);
        currentDate.setDate(firstDate.getDate() + day);

        const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
        
        const pricePerUnit = dataSet.historicalData.find(dataPoint => {
          const dataPointDate = new Date(dataPoint.date);
          const formattedDataPointDate = `${dataPointDate.getFullYear()}-${(dataPointDate.getMonth() + 1).toString().padStart(2, '0')}-${dataPointDate.getDate().toString().padStart(2, '0')}`;
          return formattedDataPointDate === formattedDate;
        })?.pricePerUnit;

        const processedDataPoint = {
          date: formattedDate,
          pricePerUnit: pricePerUnit !== undefined ? pricePerUnit : lastKnownPrices
        };

        processedDataSet.historicalData.push(processedDataPoint);

        // Update the last known price for the current date
        if (pricePerUnit !== undefined) {
          lastKnownPrices = pricePerUnit;
        }
      }
      processedDataSet.historicalData.sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(a.date) - new Date(b.date)); // Sort by date
      if(processedDataSet.historicalData[processedDataSet.historicalData.length - 1].date !== formattedYesterday){
        processedDataSet.historicalData.push({date: formattedYesterday, pricePerUnit: processedDataSet.historicalData[processedDataSet.historicalData.length - 1].pricePerUnit});        
      }
      processedDataSets.push(processedDataSet);
    });

    processedDataSets.sort((a, b) => new Date(a.historicalData[0].date) - new Date(b.historicalData[0].date)); // Sort processedDataSets by the earliest date in historicalData



    return processedDataSets;
  }






  useEffect(() => {
    setEachDayInvestment(processMultipleHistoricalData(investments));
  }, [investments]);

  return (
    <div>

      <MainScreen investments={eachDayInvestment} />

    </div>
  );
}
