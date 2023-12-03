import styles from '@/styles/Home.module.css'
import Transaction from '@/components/transaction';
import { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import axios from 'axios';
import { Line, Scatter } from 'react-chartjs-2';
import dayjs from 'dayjs';

export type Transaction = {
  hash: string,
  timestamp: number,
  amount: number,
  price: number
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Average BTC Price Over Time',
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Timestamp'
      }
    },
    y: {
      title: {
        display: true,
        text: '$ in USD'
      }
    },
  },
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [prices, setPrices] = useState<number[][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      let price = await axios.get("https://blockchain.info/ticker");
      let data = await axios.get("https://blockchain.info/unconfirmed-transactions?format=json");

      let txs = [...transactions, ...data.data.txs.map((e: any) => {
        let out = 0;
        e.out.forEach((o: any) => {
          out += o.value;
        })

        return {
          hash: e.hash,
          timestamp: e.time,
          amount: out,
          price: price.data.USD.last
        }
      })];

      setTransactions(_.uniqBy(txs, 'hash'));
    }

    const fetchPrices = async () => {
      let data = await axios.get("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1");

      setPrices(data.data.prices)
    };

    document.title = 'BTC Tracker';
    fetchData();
    fetchPrices();

    setInterval(fetchData, 10000);
  }, []);

  const ref = useRef(null);

  const timestamps = prices.map(e => dayjs.unix(e[0] / 1000).format("YYYY/DD/MM HH:mm"));
  const btcPrices = prices.map(e => e[1]);

  const data = {
    labels: timestamps,
    datasets: [
      {
        label: 'Average BTC Price',
        data: btcPrices,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <>
      <div className={styles.title}>Simple BTC Tracking</div>
      <div className={styles.content}>
        <div className={styles.left}>
          <Line options={options} data={data} />
        </div>
        <div className={styles.right}>
          <h4 className={styles.ctr_header}>Unconfirmed BTC Transactions</h4>
          <div className={styles.container}>
            {transactions.toReversed().map((tx, i) => (
              <div key={i}>
                <Transaction
                  ref={ref}
                  hash={tx.hash}
                  timestamp={tx.timestamp}
                  amount={tx.amount}
                  price={tx.price} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

