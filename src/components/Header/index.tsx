import { useState, useEffect } from "react";
import API_KEY from "../../database";

interface CoinState {
    id: string;
    name: string;
    value: number;
}

function Navigation() {

    const [valueCoin, setValueCoin] = useState<CoinState[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // 2. Transforma em uma função que roda apenas uma vez no carregamento da página
    useEffect(() => {
        async function fetchLiveMarket() {
            try {
                const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/BRL`);
                const data = await res.json();
                const taxas = data.conversion_rates;

                const coins = Object.keys(taxas);
                const tempCoins: CoinState[] = [];

                // Escolhe 5 moedas aleatórias sem duplicar estados no loop
                for (let index = 0; index < 5; index++) {
                    const coinRandom = Math.floor(Math.random() * coins.length);
                    const coin = coins[coinRandom];
                    const valueConversion = taxas[coin];

                    tempCoins.push({
                        id: crypto.randomUUID(),
                        name: coin,
                        value: valueConversion
                    });
                }

                setValueCoin(tempCoins);

            } catch (error) {
                console.error("Erro ao buscar taxas:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchLiveMarket();

    }, []);

    return (
        <>
            <header>
                <section>
                    <h1>UniValue</h1>
                </section>
                <section>
                    <h3>125 Moedas</h3>
                </section>
            </header>
            <section>
                <ul>
                    <li>LIVE MARKETS</li>
                    
                    {loading ? (
                        <li>Carregando mercado...</li>
                    ) : (
                        valueCoin.map((value) => (
                            <li key={value.id}>
                                <p>{value.name}: {value.value.toFixed(4)}</p>
                            </li>
                        ))
                    )}
                </ul>
            </section>
        </>
    );
}

export default Navigation;
