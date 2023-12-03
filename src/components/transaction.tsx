import styles from '@/styles/Transaction.module.css'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { Transaction } from '@/pages/index';
import { ForwardedRef, forwardRef } from 'react';

dayjs.extend(timezone);
dayjs.extend(utc);

const TransactionComponent = forwardRef(({ hash, amount, price, timestamp }: Transaction, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <>
      <div ref={ref} className={styles.transaction}>
        <div className={styles.row}>
          <div>
            Hash <a href={"https://www.blockchain.com/explorer/transactions/btc/" + hash} className={styles.hash}>{hash.slice(0, 4)}-{hash.slice(hash.length - 4, hash.length)}</a>
          </div>
          <div className={styles.amount}>
            {(amount / 100000000).toFixed(8)} BTC
          </div>
        </div>
        <div className={styles.row}>
          <div>
            {dayjs.unix(timestamp).format('MM/DD/YYYY HH:mm:ss')}
          </div>
          <div>
            ${(price * (amount / 100000000)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
        </div>
      </div>
    </>
  )
});

export default TransactionComponent;
