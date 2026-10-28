import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import "./header.css";

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

        for (let i = 0; i < coins.length; i++) {
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

          // console.log(appreciation);

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
      <header className="flex flex-row gap-2 justify-between items-center p-6 pb-0">
        <section className="flex flex-row gap-4 font-black text-[var(--color-primary)]  ">
          <h1 className="text-2xl">UniValue</h1>
        </section>
        <section>
          <h3 className="font-light text-[var(--color-tercery)] text-[10px]">
            125 MOEDAS <br /> DISPONÍVEIS
          </h3>
        </section>
      </header>

      <section
        id="list-live-markets"
        className="flex flex-row gap-2 justify-between items-center py-2"
      >
        <ul
          className="
        scrollbar-hide
        flex flex-row gap-2 overflow-x-auto scrollbar-thin text-[10px] bg-[var(--color-bg-secondary)] font-medium"
        >
          <li className="li-livemarket
           flex justify-center items-center w-fit shrink-0 bg-[var(--color-primary)] font-black text-black p-1">
            LIVE MARKETS
          </li> 

          {loading ? (
            <li>Carregando mercado...</li>
          ) : (
            valueCoin.map((value) => (
              <li
                key={value.id}
                className="shrink-0 flex flex-row gap-2 items-center p-1 tracking-[3px] border-r border-[var(--color-secondary)]"
              >
                {/* IMPRIME O VALOR BRL | USD + VALOR */}
                <p className="flex flex-row gap-2 items-center">
                  <span className="text-[var(--color-border)]">
                    BRL | {value.name}
                  </span>
                  <span>{value.value.toFixed(2)}</span>

                  {/* IMPRIME VALORIZAÇÃO DA MOEDA */}
                  <span
                    className={`flex flex-row items-center ${value.appreciation >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {value.appreciation >= 0 ? (
                      <ArrowUp className="responsive-arrow" size={16} />
                    ) : (
                      <ArrowDown className="responsive-arrow" size={16} />
                    )}
                    {`${Math.abs(value.appreciation).toFixed(2)}%`}
                  </span>
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
