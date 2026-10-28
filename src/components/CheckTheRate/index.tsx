import { ArrowDownUp, Coins } from "lucide-react";
import { useState, useEffect } from "react";
import currencyToCountry from "../../database";

interface Coin {
  iso_code: string;
  name: string;
  symbol: string;
}

interface Rate {
  base: string;
  quote: string;
  rate: number;
}

function CheckTheRate() {
  const [coin, setCoin] = useState<Coin[]>([]);
  const [selectedCurrencyOne, setSelectedCurrencyOne] = useState<string>("BRL");
  const [selectedCurrencyTwo, setSelectedCurrencyTwo] = useState<string>("USD");
  const [val, setVal] = useState<Rate | null>(null);

  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch(
          `https://api.frankfurter.dev/v2/rate/${selectedCurrencyOne}/${selectedCurrencyTwo}`,
        );
        const data = await res.json();
        setVal(data);
      } catch (error) {
        console.error("Erro ao buscar taxas:", error);
      }
    }

    fetchRate();
  }, [selectedCurrencyOne, selectedCurrencyTwo]);

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const res = await fetch(
          "https://api.frankfurter.dev/v2/currencies?scope=all",
        );
        const data = await res.json();
        setCoin(data);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    }

    fetchCurrencies();
  }, []);

  function getFlagUrlOne() {
    const countryCode = currencyToCountry[selectedCurrencyOne];

    return `https://flagcdn.com/16x12/${countryCode}.png`;
  }

  function getFlagUrlTwo() {
    const countryCode = currencyToCountry[selectedCurrencyTwo];

    return `https://flagcdn.com/16x12/${countryCode}.png`;
  }

  return (
    <>
      <span className="flex  items-left mt-5 mb-2 mx-4">
        <h2 className="text-xl font-bold ">Verifique a Taxa</h2>
      </span>
      <section
        id="container-check-the-rate "
        className="bg-(--color-bg-secondary) w-[90%] h-[50%] m-auto rounded-3xl flex flex-col justify-center pr-4 pl-4 "
      >
        <article id="header-check" className="flex flex-col items-left h-[80%]">
          {/* PARTE DE CIMA */}
          <div
            id="send-coin"
            className="flex flex-col justify-between items-left h-[40%] w-full p-4 bg-(--color-bg-terciary) rounded-3xl border-1 border-[var(--color-border)]"
          >
            <span>ENVIA</span>
            <div className="flex fle-row w-full  justify-between ">
              <h2 className="font-bold text-5xl text-white">
                {coin.find((c) => c.iso_code === selectedCurrencyOne)?.symbol}{" "}
                1,00
              </h2>

              {/* SELETOR DE MOEDA UM*/}

              <div className="flex fle-row items-center justify-center bg-[var(--color-bg-quaternary)] text-xs border border-[var(--color-border)] p-2 rounded-2xl ">
                <img src={getFlagUrlOne()} />
                <select
                  value={selectedCurrencyOne}
                  onChange={(e) => setSelectedCurrencyOne(e.target.value)}
                >
                  {coin.map((coin) => (
                    <option
                      key={coin.iso_code}
                      value={coin.iso_code}
                      className="bg-[var(--color-bg-quaternary)]"
                    >
                      <div></div>
                      {`${coin.iso_code}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ICONE DE TROCA */}
          <div
            id="rate-coin"
            className="flex justify-center items-center w-fit p-2 bg-[var(--color-bg-terciary)] rounded-xl m-auto mt-2 mb-2 border-1 border-[var(--color-border)]"
          >
            <ArrowDownUp
              onClick={() => {
                const temp = selectedCurrencyOne;
                setSelectedCurrencyOne(selectedCurrencyTwo);
                setSelectedCurrencyTwo(temp);
              }}
            />
          </div>

          {/* PARTE DE BAIXO */}
          <div
            id="send-coin"
            className="flex flex-col justify-between items-left w-full h-[40%] p-4 bg-[var(--color-bg-terciary)] rounded-3xl border-1 border-[var(--color-border)]"
          >
            <span>RECEBI</span>
            <div className="flex fle-row w-full  justify-between ">
              {val && (
                <h2 className="font-bold text-5xl text-[var(--color-primary)]">
                  {coin.find((c) => c.iso_code === selectedCurrencyTwo)?.symbol}{" "}
                  {`${val.rate}`}
                </h2>
              )}

              {/* SELETOR DE MOEDA */}
              <div className="flex fle-row items-center justify-center bg-[var(--color-bg-quaternary)] text-xs border border-[var(--color-border)] p-2 rounded-2xl">
                <img src={getFlagUrlTwo()} />
                <select
                  value={selectedCurrencyTwo}
                  onChange={(e) => setSelectedCurrencyTwo(e.target.value)}
                >
                  {coin.map((coin) => (
                    <option
                      key={coin.iso_code}
                      value={coin.iso_code}
                      className="bg-[var(--color-bg-quaternary)]"
                    >
                      {`${coin.iso_code}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </article>

        <article
          id="footer-check"
          className="h-[10%] border-t-1 border-dashed border-[var(--color-border)]"
        ></article>
      </section>
    </>
  );
}

export default CheckTheRate;
