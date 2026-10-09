import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

export interface CoinState {
  id: string;
  name: string;
  value: number;
  appreciation: number;
}

function Navigation() {
  const [valueCoin, setValueCoin] = useState<CoinState[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 2. Transforma em uma função que roda apenas uma vez no carregamento da página
  useEffect(() => {
    async function fetchLiveMarket() {
      try {
        const res = await fetch(
          "https://api.frankfurter.dev/v2/rates?base=brl",
        );
        const data = await res.json();
        const taxas = data.map((data: any) => data.quote);

        const previousDate = new Date();
        previousDate.setDate(previousDate.getDate() - 1);
        const previousDateString = previousDate.toLocaleDateString("en-CA", {
          month: "2-digit",
          year: "numeric",
          day: "2-digit",
        });

        // PEGA O VALOR DA MOEDA DE ONTEM PARA COMPARAR COM O VALOR DE HOJE
        const previusCurrencyValue = await fetch(
          `https://api.frankfurter.dev/v2/rates?base=brl&date=${previousDateString}`,
        );
        const previusCurrencyValueData = await previusCurrencyValue.json();

        const coins = Object.keys(taxas);
        const tempCoin: CoinState[] = [];

        for (let i = 0; i < 10; i++) {
          const indexRandom = Math.floor(Math.random() * coins.length);
          const coinIndex = coins[indexRandom];
          const currencyName = taxas[coinIndex];

          //VALOR DIA ANTERIOR DA MOEDA PARA COMPARAR COM O VALOR DE HOJE
          const previousValue = previusCurrencyValueData[coinIndex].rate;

          // VALOR DA MOEDA ATUAL
          const currentCurrencyValue = data[coinIndex].rate;

          //CALCULA A VALORIZAÇÃO OU DESVALORIZAÇÃO DA MOEDA EM RELAÇÃO AO DIA ANTERIOR
          const appreciation = previousValue
            ? ((currentCurrencyValue - previousValue) / previousValue) * 100
            : 0;

          tempCoin.push({
            id: crypto.randomUUID(),
            name: currencyName,
            value: currentCurrencyValue,
            appreciation: appreciation,
          });
        }

        setValueCoin(tempCoin);
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
      <header className="flex flex-row justify-between items-center p-4 max-w-[1600px] mx-auto">
        <section>
          <h1>UniValue</h1>
        </section>
        <section>
          <h3>125 Moedas</h3>
        </section>
      </header>
      <section className="flex flex-row gap-2">
        <ul className="flex flex-row justify-between items-center text-[15px] bg-[var(--color-bg-secondaty)] gap-x-2 w-full h-13 ">
          <li className="flex items-center bg-[var(--color-primary)] text-black p-1 h-full">
            LIVE MARKETS
          </li>

          {loading ? (
            <li>Carregando mercado...</li>
          ) : (
            valueCoin.map((value) => (
              <li
                key={value.id}
                className="flex flex-row items-center justify-center p-1 gap-1 h-full "
              >
                <p>{`BRL | ${value.name} ${value.value.toFixed(2)} `}</p>
                <p
                  className={`flex flex-row text-[12px] items-center ${value.appreciation >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {value.appreciation >= 0 ? (
                    <ArrowUp size={10} />
                  ) : (
                    <ArrowDown size={10} />
                  )}
                  {`${Math.abs(value.appreciation).toFixed(2)}%`}
                </p>
              </li>
            ))
          )}
        </ul>
      </section>
    </>
  );
}

export { Navigation };
