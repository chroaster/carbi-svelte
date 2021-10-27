<script>
	import { onMount } from "svelte";
	import { CryptoExchange } from "./CryptoExchange.js";
	import { Spot } from "./Spot.js";
	import TimeAgo from "./TimeAgo.svelte";
	import SpinnerSquare from "./SpinnerSquare.svelte";
	import Fa from "svelte-fa";
	import {
		faCoins,
		faChartLine,
		faArrowsAltH,
		faLongArrowAltLeft,
		faLongArrowAltRight,
		faCaretUp,
		faCaretDown,
	} from "@fortawesome/free-solid-svg-icons";

	const flags = {
		kor: {
			alt: "Korean Flag",
			src:
				"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAvCAYAAABe1bwWAAAKbElEQVRoQ+1bZ1RU1xb+7szcmaEjoLGXZ+8ajY/ELoomVrBH7AICoiCiglIUFJVQFBSxxUKSp8aKXaPGFnuJXeyVZkCkTL9Z5/iGxzigc2eCaz2W+xfrss/e3/lOuefs7w6DEpYvU/ZhAE9wGkeA+QIAU/L/FfBvDuAywAjOckCypZQ9oO0j7TjHcdICmXI9AwyvgJ03uEscsNlCyo5nGKaIElNYpNjEAW4GR6jAjgyQYm4mHs3ky5TODMcdrMB95d01jmF6MwUy5TZwnCvv1hW5AcPsYAqKFFkAHCpyP/n3jUsnxHD8G+q22JDyC+RyBYYNHgRbWxtTwxnV/u3bfOw7cBiDXfpDJBIZFaNEI43JxKSnZ8B7WiA0Gg2WxkShTu1aUKlU/wQ4Xp2bPXcebt2+C/cJY9C/bx9ebUtzNpmYRdHxOHP2PHr36gGfyZPw4uUrzJ4zD4MG9KWjV15GBuLo8RMQCATo0a0LLly8goioaFhbW2HViniYm5mZlNokYm7fuYdZc8JhZibFysRYVLK1RdSSOPxx7gK+7d0TXh4TTAL3ocaXr/6J8IhFsLGxRvLyOEpEUMh83Lx1B8OHuGDUyKEm5TaaGI7jEBgUintpD+D2/TC6v9y4eRvBoREUJAFLQJenaZfP8KEuGDViKO7eu4+ZwWEQi8VYtTwOlSrZGp3eaGJOnDqDH+IS4eBgj5UJMWBZFgGzQnD/wUOMcRuBIS4DygYlV0B99To0N+9Ck/YQXFY2oFACEjEYB3sI6tSCoFUzCNu1ps/Ksjt30+iMlYjFSF4RR2esdmn3cXaCt+fET0uMQqmEt28AMrOy4T/VC927dsax308iblkSKjs4ICkxBmKW1QelVEK15zDUB4+CKyz6KGjG3AzC3t0h6usMiEuJB+gtXbLHTfGbSWMnxC1GzRrVP5rnH9t8t+1IBXlFN6hfDzGLI6FUKuHlOwNZ2dkI8PNB184d9XJpHj2FMnkDuJfpvIEyVauA9RwLQf26em2fv3gJX/9Z9Hli/BLUqF4NSavWYf/BI/j6318haKY/73ykAe+l9CYvD57e/igsKsLC+SFo0bwptmzbiZSft6BRw/qIjpoPhtG9lGtu3IYifhWgUBgFkjZiWYh9JkDwZSu9GMtXrsHBw0fxjWMHzA70Q05OLjx9/CFXKLB4QTiaNG7IOy9vYt4fjdzcN5g8ZTolalFkGJo1bawDQnMnDYoliYBKxRucXgORCOI5/nozhxDh4eMPhUKB6Kh5aNSwAX76z1Zs3rqD4iG4+BpvYn7dvgu7Uvdj0YIwOm3fH62SALj8AiiCIsG9yeOLq0x/xsYa4kVzwVhY6PiQGUtmbvNmTRAVEUoHisxsMsPDQ2bjyzb6M+1DoHgTQ4KRPYW8hZ4+e45pAUF06SxfGo1qVUlt63+m/PEXqI+dMp4UgQCMtRVdgiU3a2H3TmDHj9SJS4jw8PZDXt5bhAYHon27tvQASA6C5OUgFAp54TCKGG2GnNxcbPl1J6RSCca66QLlcnIhDwgzagkJGv4Lwu96gmvcCJn5aohZAexEKmhOn4c69RA4uRyS+Mh3pJWw1L0HsHrdRqOXT8lYJhHzoSFQHzoOZcpWXqMEhoFohAteNG+PLal3cPFaBpRKNY1hbSVBZ8eaGNLpC0iTVkPYsQNE/Zx1Z6hSie0799BTN7kamGLlRoxi8TJ6gONjhJQzlRojcd1lqFSaUpva2UoR6t4K1X7bB9bXnU94Xr7lRozcKxBcQaHBYAT1auPxGHfMiToJtbp0UrTBKtubI2Z8fVg2b2BwfL6O5UaMbKIf2aUNxsO6j0bYaSVu3c02qM1Il6YYOqCJQb7GOJUbMfI5C8E9e2EYJoZBYUQY3MNPgTOwbFanpjXiIpwMi2+EV7kRo9q1H6ptewyCJGjcAKe7DUbCmksG+RMnViTA5tUDDfbn61huxNy7+Qp11q4Al/3XhzEJBWDnBmB2ymM8eJxjMH5LCxYbE/sZ7M/XsdyIiUu+iDGdHWCZvApczpvScYlEYCe5YXeuDTZtvckLe9OG9lgQ3IVXGz7OJhNDClb5+QWwsrLUybtjXxqOn3mKuR6tYXvyODRnLoB7m//Oh2UhaNkU7OB+SL1VhA2brxu8t2iTuA1pDte+jfT6Sg545MDpOrA/LCzM+XCh42sSMeTKH7t0OSRiCaIiQ3UCv8mTwz3gAKQSEe1AV8casNXIAKUKcisbXE/Lwe4Dabhp4FuoZHChgEHSEmc42Ot2XFuCIIOlLcwby4xRxJA7Uu1aNVFQUAgPHz8Q6SJ41nQ4dmivg2Ptz39i7+EHxc8sLcRgWQHy8uRQawx8/ZTSs15d68JrXFu9/2ird07du2DalMnIzn6NeQuXYKjrQHTp9A0vjngTE7t0BY6fOIWIsGC0btUCu/fsx5ofN9GbNikUlbysFRQq4Rt8BLlvZLxAfcjZ1kaK+EgnWFvqljzvpd1HYFAYWJEIKxJiUKWyAxJWrMLh347TASMDx8d4E0PKDht/2ox6desg/oeF9PbqPXUGXqVnwHPSOPT9Vvf+cu9hDkKiTkBZxhGfD1iRSIDQgI5o0URfOJ0TFonrN25hUP/vMGGcG549f4Gp02eTLzloibNWzRp8UvGv4JFi0GTfADpNp/p4omePrlRXItPYxtqaFqXf13QuXktHbNJ5yOTvLoTGmEQsxCxfR7RpUUWv+eUr1xAeuRjm5uZUHSAXSK2M08upG3y9PXin5D1jSAZt4dvB3g5JCTFUriBSBtGZiDpAVIL37f6jHMQknUdGluH3J22MGtWs4OfRDvXrVtKLS2aEf2AwHj56UizjaNUDsqyI3kWUDL5mFDEEzPSZc/Hg4SMqbBGBS6vpEDBEJSBqwfsmk6uwc38a9hx6gMKij9+jzM1Y9HeuT99qLFt6oen3k6cRE7+cakhEy5JKJMXCm+vAfhg35nu+nFB/o4ghDa9dv4GQ8IVUhUxOjKNi/uKYpTh95hytmBFZpSwjBJ27/ApXr2fg4ZNcZGYXQq5QQywWooqDOZo0sEOrZlXQvk1V+rovy4hGTva39IxMqnqSOszFS1cwf2E0PcMQqdbKUvd8ZShLRhNDEhAABIhWjiUAfaYFUlGfyCpEXilP27v/EJLXrEf1alVpaZXo2KTU+vjJ04+Lfh8BZhIx2p2f5FgWu4ju/GvXp2BX6j60bNEMC+bNLTde1Go13L2mIfv1Xwic7ovOHb8u3vvs7CohOTEWEonE6PwmEUOyalWCr9q3RUhQIN7m58N/RjB6OnWjByu+RWg+PSFHhMNHjmH0qOF0lnpNnYHMzCz61QX5+sIUM5kYUhD39JkOmUxGZwiZKeRsQ6b1p7STp/5AdFwClWTJucXUATGZGNJ5cujLyMzCiGGusLez+5R86OQ6f+ESPTq0ad3SZAyEmM/f4OnT+Jp8tbkdHOdiMsUVKQD5avPzd776I8oxDPnpwOcvw0tSU/xlOHnIcZzZf39LMKwirQjefWGYreYS0dji3xJoAxTIZP2hEU4EwzkC0FXoeWf5v2mQAY45C4F6nYVUuluL+m9s05veq3dEKgAAAABJRU5ErkJggg==",
		},
		usa: {
			alt: "USA Flag",
			src:
				"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAvCAYAAABe1bwWAAADfElEQVRoQ+2bX0hTURzHv2dO829ONpNMs4ggiF4KzB4KKTOVEjJ1EEWZ+A8q6imlh3qIwPXQH+jBpFooas4/YBD21EuG/YGgeqkWgovp0G3+mzP358S9sGWx7e7eyby73vM0uL9zzu/72fccfmc7l2BFK9MZS0DRAKAAQBYAsvL5an7u+Ni6msMJHYsC1EJARikUbWpD27BvIFZ44c2xxOQkjx6AVugMfPuJBMx/aZPni0ipyTXcdbJgynQ/O0DpGb7iIokXJxiAUtKp6Xt0lpTqfhQTSl5FIlJIX7GCYbVQcoyUtRr7AVQIERdJH1GDAQYZMFMANJGIFNJX3GDoJAOGChGWnRGPhiMa3OibENId4gYDr2AwVQUqnD+kRl37OMx2F284IgcDwWB0p7dgd04iOt/Y0P3WLoNhCKQlKtB1aTsUBKxbGNfwbZJ0zNE9abhSusnPornbjC8mJy82hstbecVHO5j3UspRx+O2NhvqVKU/V8usG61DFnybWAo7/5gG01ikYQEkb1CwgpkltC0zAXHMGgrQnMteeLyA0+WFx0MxNedGc485YGxMg7lQqMapfFXYLlgZ6PJQ3Hlhwch3h/TAMIrK96Wj7rCG3WjDbfNLXtwanMTXEPtOTDvGB6JgZwpayrOgjOOmMz3vxvVeM35ZQ9c2kgDDAKrIV6G2UM1pmmvd5pBO8Q0gGTCZaUrom/JCgllY8kL7YIwTHhMgHTAbldA3hgaz7KaoujcGt5f7+CUZMAd3paK5nPm1M3Rr6THj8zh3sSeZyrepSIPje9NZKnaHB10jNhgtv5GnSYD2QAY2q+LZZwMfZvD4tZWLn9hP1+EfIh/W5LLF3TujA/eHpzC76PGLT1ASFk5lvgommwsXn5rWD5hnTXnoHbXj5ac5BNtBmOPC/h0p6H8/s37AcCrlGSCZPYanbs5wGUwQRDIYGQzn6vknQHZMrDrG4Vzmrt/5mUES0UQGE/h7lMEE8bcMRgbDb+uTHSM7RnYMPwLBHGOtqpPrmABwiAwmSB0jg5HB8Np7mKW0JnfweGUZ9WBqZcAMADgZ9bnFPeEgsVbWF4PQqN/zFTUXghL2X/rpyvoOQqJ7M1ysYPw3w5kETVVXk5Lpgh4E1WJNOCp5ERgWaeo5/7sEvklt1bUnQBW19O/bJ1HJZ40nsRBg1AM8yTS0D/ly+QMpzH7D4sxATQAAAABJRU5ErkJggg==",
		},
	};

	const spot = new Spot("KRW", "USD");

	const cryptos = [
		{ symbol: "BTC", link: "https://www.tradingview.com/chart?symbol=COINBASE%3ABTCUSD" },
		{ symbol: "ETH", link: "https://www.tradingview.com/chart?symbol=COINBASE%3AETHUSD" },
		{ symbol: "LTC", link: "https://www.tradingview.com/chart?symbol=COINBASE%3ALTCUSD" },
		{ symbol: "ADA", link: "https://www.tradingview.com/chart?symbol=BINANCE%3AADAUSD" },
		{ symbol: "LINK", link: "https://www.tradingview.com/chart?symbol=COINBASE%3ALINKUSD" },
		{ symbol: "YFI", link: "https://www.tradingview.com/chart?symbol=BINANCE%3AYFIUSDT" },
		{ symbol: "BNB", link: "https://www.tradingview.com/chart?symbol=BINANCE%3ABNBUSDT" },
		{ symbol: "DOT", link: "https://www.tradingview.com/chart?symbol=BINANCE%3ADOTUSDT" },
		{ symbol: "XLM", link: "https://www.tradingview.com/chart?symbol=COINBASE%3AXLMUSD" },
		{ symbol: "BAT", link: "https://www.tradingview.com/chart?symbol=COINBASE%3ABATUSDC" },
		{ symbol: "DOGE", link: "https://www.tradingview.com/chart?symbol=BINANCE%3ADOGEUSDT" },
	];

	const refreshRate = 60 * 1000;
	let korExchange;
	let usaExchange;
	let exchangeRate;
	let data = {
		resolved: false,
	};

	function sigDig(num = 0) {
		if (num < .0001) {
			return '< .0001';
		} else if (num < .001) {
			return '< .001';
		} else if (num < .01) {
			return '< .01';
		} else if (num < .1) {
			return '< .1';
		} else if (num < 1) {
			return num.toFixed(4).substr(1);
		} else if (num < 10) {
			return num.toFixed(3);
		} else if (num < 100) {
			return num.toFixed(2);
		} else if (num < 1000) {
			return num.toFixed(1);
		} else {
			return num.toFixed(0);
		}
	}

	function margin(pair) {
		const sender = pair[0].price;
		const receiver = pair[1].price;
		return 100 * ((receiver - sender) / sender);
	}

	onMount(async () => {
		// get exchange rate
		exchangeRate = Number.parseFloat(await spot.rate());

		// initialize exchange instances
		usaExchange = new CryptoExchange("USA", exchangeRate);
		korExchange = new CryptoExchange("KOR", exchangeRate);

		// initialize data object
		cryptos.forEach(async (crypto) => {
			data[crypto.symbol] = {
				sender: await usaExchange.ticker(crypto.symbol),
				receiver: await korExchange.ticker(crypto.symbol, exchangeRate),
			};
		});
		console.log(`${new Date().toLocaleTimeString()} - data initialized`);

		// set "resolved" flag one second after last currency's promises resolve
		const loadWait = setInterval(() => {
			if (
				cryptos.every((crypto) => {
					return (
						data[crypto.symbol] != undefined &&
						data[crypto.symbol].sender != undefined &&
						data[crypto.symbol].receiver != undefined
					);
				})
			) {
				clearInterval(loadWait);
				data.resolved = true;
			}
		}, 100);

		const interval = setInterval(() => {
			cryptos.forEach(async (crypto) => {
				data[crypto.symbol] = {
					sender: await usaExchange.ticker(crypto.symbol),
					receiver: await korExchange.ticker(crypto.symbol, exchangeRate),
				};
			});
			console.log(`${new Date().toLocaleTimeString()} - data refreshed`);
		}, refreshRate);
	});
</script>

<main>
	{#if !data.resolved}
		<SpinnerSquare />
	{:else}
		<table>
			<thead>
				<th>
					<span class="crypto-icon"><Fa icon={faCoins} /></span>
				</th>
				<th>
					<span class="crypto-icon"><Fa icon={faChartLine} /></span>
				</th>
				<th>
					<img class="crypto-flag" src={flags.usa.src} alt={flags.usa.alt} />
				</th>
				<th>
					<span class="crypto-icon"><Fa icon={faArrowsAltH} /></span>
				</th>
				<th>
					<img class="crypto-flag" src={flags.kor.src} alt={flags.kor.alt} />
				</th>
				<th>
					<span class="crypto-icon"><Fa icon={faChartLine} /></span>
				</th>
			</thead>
			<tbody>
				{#each cryptos as crypto}
					<tr>
						<td>
							<a href={crypto.link} target="_blank">
								{crypto.symbol}
							</a>
						</td>
						{#if data[crypto.symbol].sender.available === false}
							<td class="placeholder">·</td>
							<td class="placeholder">·</td>
						{:else}
							<td>
								{#if data[crypto.symbol].sender.change > 0}
									<span class="crypto-caret favorable">
										<Fa icon={faCaretUp} />
									</span>
								{:else}
									<span class="crypto-caret unfavorable">
										<Fa icon={faCaretDown} />
									</span>
								{/if}
								<span class="heavy">
									{Math.abs(data[crypto.symbol].sender.change).toFixed(1)}
								</span>
							</td>
							<td>
								<span class="price">
									{sigDig(data[crypto.symbol].sender.price)}
								</span>
							</td>
						{/if}
						{#if data[crypto.symbol].sender.available === false || data[crypto.symbol].receiver.available === false}
							<td class="placeholder">·</td>
						{:else}
							<td>
								{#if margin([data[crypto.symbol].sender, data[crypto.symbol].receiver]) < -0.1}
									<span class="crypto-arrow-h unfavorable">
										<Fa icon={faLongArrowAltLeft} />
									</span>
								{/if}
								<span class="heavy">
									{Math.abs(
										margin([data[crypto.symbol].sender, data[crypto.symbol].receiver])
									).toFixed(1)}
								</span>
								{#if margin([data[crypto.symbol].sender, data[crypto.symbol].receiver]) > 0.1}
									<span class="crypto-arrow-h favorable">
										<Fa icon={faLongArrowAltRight} />
									</span>
								{/if}
							</td>
						{/if}
						{#if data[crypto.symbol].receiver.available === false}
							<td class="placeholder">·</td>
							<td class="placeholder">·</td>
						{:else}
							<td>
								<span class="price">
									{sigDig(data[crypto.symbol].receiver.price)}
								</span>
							</td>
							<td>
								{#if data[crypto.symbol].receiver.change > 0}
									<span class="crypto-caret favorable">
										<Fa icon={faCaretUp} />
									</span>
								{:else}
									<span class="crypto-caret unfavorable">
										<Fa icon={faCaretDown} />
									</span>
								{/if}
								<span class="heavy">
									{Math.abs(data[crypto.symbol].receiver.change).toFixed(1)}
								</span>
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
		<table class="footnote">
			<tr>
				<td>
					<div style="text-align: start; padding: 0 .5rem;">
						{#await data[cryptos[0].symbol].receiver then receiver}
							<TimeAgo startTime={receiver.time} />
						{/await}
					</div>
				</td>
				<td>
					<div style="text-align: end; padding:0 .5rem;">
						<span>
							<a
								href="https://finance.yahoo.com/quote/KRW%3DX/history?p=KRW%3DX"
								target="_blank"
							>
								{exchangeRate.toFixed(2)}
							</a>
						</span>
					</div>
				</td>
			</tr>
		</table>
	{/if}
</main>

<style>
	main {
		padding-top: 0.5rem;
	}

	table {
		-webkit-overflow-scrolling: touch;
		overflow-x: auto;
		margin: 0;
		width: 100%;
		text-align: center;
		font-size: 1.1rem;
	}

	table tbody tr {
		border: solid 1px rgba(255, 255, 255, 0.15);
		border-left: 0;
		border-right: 0;
	}

	table tbody tr:nth-child(2n + 1) {
		background-color: rgba(255, 255, 255, 0.05);
	}

	table td {
		padding: 0.175em 0.15em;
		/* width: fit-content; */
		overflow: hidden;
		white-space: nowrap;
	}

	table th {
		color: #ffffff;
		font-weight: bold;
		padding: 0;
		text-align: center;
	}

	table thead {
		border-bottom: solid 2px rgba(255, 255, 255, 0.15);
	}

	.crypto-flag {
		width: 1.75rem;
	}

	.crypto-icon {
		font-size: 1.5rem;
		opacity: 70%;
	}

	.crypto-caret {
		font-size: 1rem;
	}

	.crypto-arrow-h {
		font-size: 0.75rem;
	}

	.favorable {
		color: seagreen;
	}

	.unfavorable {
		color: darkred;
	}

	.price {
		font-weight: 300;
		font-size: smaller;
		color: slategray;
	}

	.heavy {
		font-weight: 700;
	}

	.placeholder {
		color: rgb(65, 47, 80);
	}

	.footnote {
		width: 100%;
		text-align: center;
		color: plum;
		font-weight: lighter;
		opacity: 40%;
		padding: 0rem;
	}
</style>
