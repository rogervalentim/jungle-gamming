export function CollectorProfileForm() {
  return (
    <div className="w-full max-w-[763px]">
      <h1 className="text-base leading-4 font-bold text-[#F5F1EB] mb-3">
        Perfil do colecionador
      </h1>

      <form className="w-full">
        <div className="flex gap-6 w-full mb-3">
          <div className="w-full max-w-[369.5px]">
            <label
              htmlFor=""
              className="text-base  font-normal text-[#F5F1EB] flex  items-center"
            >
              Nome de exibição
              <span className="text-[22px]  text-[#F0805F] font-normal">*</span>
            </label>
            <input
              type="text"
              name=""
              id=""
              className="w-full max-w-[369.5px] h-10 rounded-[3px] border border-[#3F2319]"
            />
          </div>
          <div className="w-full max-w-[369.5px]">
            <label
              htmlFor=""
              className="text-base  font-normal text-[#F5F1EB] flex  items-center"
            >
              Nome de usuário{' '}
              <span className="text-[22px]  text-[#F0805F] font-normal">*</span>
            </label>
            <input
              type="text"
              name=""
              id=""
              className="w-full max-w-[369.5px] h-10 rounded-[3px] border border-[#3F2319]"
            />
          </div>
        </div>
        <div className="flex gap-6 w-full mb-3">
          <div className="w-full max-w-[369.5px]">
            <label
              htmlFor=""
              className="text-base  font-normal text-[#F5F1EB] flex  items-center"
            >
              Rede{' '}
              <span className="text-[22px]  text-[#F0805F] font-normal">*</span>
            </label>
            <div className="relative w-full max-w-[369.5px]">
              <select
                id="network"
                name="network"
                defaultValue=""
                className="
                    appearance-none
                    w-full
                    h-10
                    rounded-[3px]
                    border
                    border-[#3F2319]
                    bg-transparent
                    pl-3
                    pr-10
                    text-sm
                    leading-[15px]
                    font-normal
                    text-[#B39463]
                    outline-none
                    cursor-pointer
                  "
              >
                <option
                  value=""
                  disabled
                  className="bg-[#140D0A] text-[#B39463]"
                >
                  Selecione uma rede
                </option>

                <option
                  value="ethereum"
                  className="bg-[#140D0A] text-[#B39463]"
                >
                  Ethereum
                </option>

                <option value="polygon" className="bg-[#140D0A] text-[#B39463]">
                  Polygon
                </option>

                <option value="solana" className="bg-[#140D0A] text-[#B39463]">
                  Solana
                </option>
              </select>

              <svg
                className="
                    pointer-events-none
                    absolute
                    right-[35.44px]
                    top-1/2
                    -translate-y-1/2
                    w-4
                    h-4
                    text-[#B39463]
                  "
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>

          <div className="w-full max-w-[369.5px]">
            <label
              htmlFor=""
              className="text-base  font-normal text-[#F5F1EB] flex  items-center"
            >
              Nome do perfil
              <span className="text-[22px]  text-[#F0805F] font-normal">*</span>
            </label>
            <input
              type="text"
              name=""
              id=""
              className="w-full max-w-[369.5px] h-10 rounded-[3px] border border-[#3F2319]"
            />
          </div>
        </div>

        <div className="w-full mb-3 ">
          <div>
            <label
              htmlFor=""
              className="text-base  font-normal text-[#F5F1EB] flex  items-center"
            >
              Endereço da carteira
              <span className="text-[22px]  text-[#F0805F] font-normal">*</span>
            </label>
            <div className="flex gap-6">
              <input
                type="text"
                name=""
                id=""
                placeholder="Endereço 0x da carteira"
                className="w-full max-w-[369.5px] pl-[22.75px] h-10 rounded-[3px] placeholder:text-sm placeholder:leading-4 placeholder:font-normal placeholder:text-[#B39463] border border-[#3F2319]"
              />
              <input
                type="text"
                name=""
                placeholder="ENS ou carteira secundária (opcional)"
                id=""
                className="w-full max-w-[369.5px] pl-[22.75px] pr-[34.75px] h-10 rounded-[3px] placeholder:text-sm placeholder:leading-4 placeholder:font-normal placeholder:text-[#B39463] border border-[#3F2319]"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-6 w-full mb-3">
          <div className="w-full max-w-[369.5px]">
            <label
              htmlFor=""
              className="text-base  font-normal text-[#F5F1EB] flex  items-center"
            >
              Tipo de carteira{' '}
              <span className="text-[22px]  text-[#F0805F] font-normal">*</span>
            </label>
            <div className="relative w-full">
              <select
                id="wallet"
                name="wallet"
                defaultValue=""
                className="
                      appearance-none
                      w-full
                      h-10
                      rounded-[3px]
                      border
                      border-[#3F2319]
                      bg-transparent
                      pl-3
                      pr-10
                      text-sm
                      leading-[15px]
                      font-normal
                      text-[#B39463]
                      outline-none
                      cursor-pointer
                    "
              >
                <option
                  value=""
                  disabled
                  className="bg-[#140D0A] text-[#B39463]"
                >
                  Selecione uma carteira
                </option>

                <option
                  value="ethereum"
                  className="bg-[#140D0A] text-[#B39463]"
                >
                  Ethereum
                </option>

                <option value="polygon" className="bg-[#140D0A] text-[#B39463]">
                  Polygon
                </option>

                <option value="solana" className="bg-[#140D0A] text-[#B39463]">
                  Solana
                </option>
              </select>

              <svg
                className="
                        pointer-events-none
                        absolute
                        right-[35.44px]
                        top-1/2
                        -translate-y-1/2
                        w-4
                        h-4
                        text-[#B39463]
                      "
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>

          <div className="w-full max-w-[369.5px]">
            <label
              htmlFor=""
              className="text-base  font-normal text-[#F5F1EB] flex  items-center"
            >
              Código de indicação{' '}
              <span className="text-[22px]  text-[#F0805F] font-normal">*</span>
            </label>
            <input
              type="text"
              name=""
              id=""
              className="w-full max-w-[369.5px] h-10 rounded-[3px] border border-[#3F2319]"
            />
          </div>
        </div>

        <div className="flex gap-6 w-full mb-3">
          <div className="w-full max-w-[369.5px]">
            <label
              htmlFor=""
              className="text-base  font-normal text-[#F5F1EB] flex  items-center"
            >
              E-mail
              <span className="text-[22px]  text-[#F0805F] font-normal">*</span>
            </label>
            <input
              type="email"
              name=""
              id=""
              className="w-full max-w-[369.5px] h-10 rounded-[3px] border border-[#3F2319]"
            />
          </div>
          <div>
            <label
              htmlFor=""
              className="text-base  font-normal text-[#F5F1EB] flex  items-center"
            >
              Nome ENS
              <span className="text-[22px]  text-[#F0805F] font-normal">*</span>
            </label>
            <div className="relative w-full max-w-[78px]">
              <select
                id="network"
                name="network"
                defaultValue=""
                className="
                      appearance-none
                      w-full
                      h-10
                      rounded-[3px]
                      border
                      border-[#3F2319]
                      bg-transparent
                      pl-2.5
                      pr-7
                      text-sm
                      leading-[15px]
                      font-normal
                      text-[#F5F1EB]
                      outline-none
                      cursor-pointer
                    "
              >
                <option
                  value=""
                  disabled
                  className="bg-[#140D0A] text-[#F5F1EB]"
                >
                  .eth
                </option>

                <option
                  value="ethereum"
                  className="bg-[#140D0A] text-[#F5F1EB]"
                >
                  Ethereum
                </option>

                <option value="polygon" className="bg-[#140D0A] text-[#F5F1EB]">
                  Polygon
                </option>

                <option value="solana" className="bg-[#140D0A] text-[#F5F1EB]">
                  Solana
                </option>
              </select>

              <svg
                className="
                  pointer-events-none
                  absolute
                  right-2.5
                  top-1/2
                  -translate-y-1/2
                  w-3
                  h-3
                  text-[#F5F1EB]
                "
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <input
            type="radio"
            name=""
            id=""
            className="
                appearance-none
                w-5
                h-5
                rounded-full
                border-2
                border-[#D28A4C]
                bg-transparent
                cursor-pointer
                checked:bg-[#D28A4C]
        checked:shadow-[inset_0_0_0_2px_#140D0A]

             "
          />
          <label htmlFor="" className="text-base font-normal text-[#F5F1EB]">
            Usar outra carteira?
          </label>
        </div>

        <div className="w-full max-w-[369.5px]">
          <label
            htmlFor=""
            className="text-base  font-normal mb-3 text-[#F5F1EB] flex  items-center"
          >
            Observação do colecionador (opcional){' '}
          </label>

          <textarea
            name=""
            id=""
            className="rounded-[3px] w-full max-w-[369.5px] h-[152px] border resize-none border-[#3F2319]"
          ></textarea>
        </div>
      </form>
    </div>
  )
}
