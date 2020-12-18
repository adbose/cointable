import Head from 'next/head'
import styles from '../styles/Home.module.css'
import CoinGecko from 'coingecko-api';

const coinGeckoClient = new CoinGecko();

export default function Home(props) {
  const { data } = props.result;
  const formatPercentage = number => `${new Number(number).toFixed(2)}%`

  const formatDollar = (number, maximumSignificantDigits) =>
    new Intl.NumberFormat(
      'en-US',
      {
        style: 'currency',
        currency: 'usd',
        maximumSignificantDigits
      }
    ).format(number);

  return (
    <div className={styles.container}>
      <Head>
        <title>CoinTable</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          CoinTable
        </h1>
        <p className={styles.description}>
          Cryptocurrency Prices and Market Capitalizations
        </p>

        <table className='table'>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>24H Change</th>
              <th>Price</th>
              <th>Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {
              data.map(coin => (
                <tr key={coin.id}>
                  <td>
                    <img
                      src={coin.image}
                      style={{width: 25, height: 25, marginRight: 10}}
                    />
                    {coin.symbol.toUpperCase()}</td>
                  <td>
                    <span className={coin.price_change_percentage_24h>0 ? 'text-success' : 'text-danger'}>
                      {formatPercentage(coin.price_change_percentage_24h)}
                    </span>
                  </td>
                  <td>{formatDollar(coin.current_price, 20)}</td>
                  <td>{formatDollar(coin.market_cap, 12)}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}

export async function getServerSideProps(context) {
  const params = {
    order: CoinGecko.ORDER.MARKET_CAP_DESC
  }
  const result = await coinGeckoClient.coins.markets({params});
  return {
    props: {
      result
    }
  };
}
