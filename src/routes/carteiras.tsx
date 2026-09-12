import { useState } from 'react'
import { Navbar } from '#/components/navbar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/carteiras')({
  component: WalletsRouteComponent,
})

function WalletFields({ prefix }: { prefix: string }) {
  return (
    <div className="grid grid-cols-1 gap-x-7 gap-y-5 sm:grid-cols-2 sm:gap-y-6">
      <label
        className="block text-base font-normal leading-6 text-[#F5F1EB]"
        htmlFor={prefix + '-display'}
      >
        Nome de exibição
        <span className="ml-0.5 text-[22px] leading-6 text-[#F0805F]">*</span>
        <input
          className="block h-10 w-full min-w-0 rounded-[3px] border border-[#3F2319] bg-[#140D0A] px-3 text-sm text-[#F5F1EB] placeholder:text-[#B39463] placeholder:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#D28A4C]"
          id={prefix + '-display'}
          name="displayName"
          required
        />
      </label>
      <label
        className="block text-base font-normal leading-6 text-[#F5F1EB]"
        htmlFor={prefix + '-nickname'}
      >
        Apelido da carteira
        <span className="ml-0.5 text-[22px] leading-6 text-[#F0805F]">*</span>
        <input
          className="block h-10 w-full min-w-0 rounded-[3px] border border-[#3F2319] bg-[#140D0A] px-3 text-sm text-[#F5F1EB] placeholder:text-[#B39463] placeholder:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#D28A4C]"
          id={prefix + '-nickname'}
          name="nickname"
          required
        />
      </label>
      <label
        className="block text-base font-normal leading-6 text-[#F5F1EB]"
        htmlFor={prefix + '-network'}
      >
        Rede
        <span className="ml-0.5 text-[22px] leading-6 text-[#F0805F]">*</span>
        <div className="relative">
          <select
            className="block h-10 w-full appearance-none min-w-0 rounded-[3px] border border-[#3F2319] bg-[#140D0A] px-3 text-sm text-[#F5F1EB] placeholder:text-[#B39463] placeholder:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#D28A4C] has-[option:checked[value='']]:text-[#B39463]"
            id={prefix + '-network'}
            name="network"
            defaultValue=""
            required
          >
            <option value="" disabled>
              Selecione uma rede
            </option>
            <option>Ethereum</option>
            <option>Polygon</option>
          </select>

          <svg
            className="
                  pointer-events-none
                  absolute
                  right-4.5
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
      </label>
      <label
        className="block text-base font-normal leading-6 text-[#F5F1EB]"
        htmlFor={prefix + '-profile'}
      >
        Nome do perfil
        <span className="ml-0.5 text-[22px] leading-6 text-[#F0805F]">*</span>
        <input
          className="block h-10 w-full min-w-0 rounded-[3px] border border-[#3F2319] bg-[#140D0A] px-3 text-sm text-[#F5F1EB] placeholder:text-[#B39463] placeholder:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#D28A4C]"
          id={prefix + '-profile'}
          name="profileName"
          required
        />
      </label>
      <label
        className="block text-base font-normal leading-6 text-[#F5F1EB]"
        htmlFor={prefix + '-address'}
      >
        Endereço da carteira
        <span className="ml-0.5 text-[22px] leading-6 text-[#F0805F]">*</span>
        <input
          className="block h-10 w-full min-w-0 rounded-[3px] border border-[#3F2319] bg-[#140D0A] px-3 text-sm text-[#F5F1EB] placeholder:text-[#B39463] placeholder:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#D28A4C]"
          id={prefix + '-address'}
          name="address"
          placeholder="Endereço 0x da carteira"
          required
        />
      </label>
      <div className="self-end">
        <input
          className="block h-10 w-full min-w-0 rounded-[3px] border border-[#3F2319] bg-[#140D0A] px-3 text-sm text-[#F5F1EB] placeholder:text-[#B39463] placeholder:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#D28A4C]"
          aria-label="ENS ou carteira secundária (opcional)"
          name="secondaryAddress"
          placeholder="ENS ou carteira secundária (opcional)"
        />
      </div>
      <label
        className="block text-base font-normal leading-6 text-[#F5F1EB]"
        htmlFor={prefix + '-type'}
      >
        Tipo de carteira
        <span className="ml-0.5 text-[22px] leading-6 text-[#F0805F]">*</span>
        <div className="relative">
          <select
            className="block h-10 w-full min-w-0 rounded-[3px] appearance-none border border-[#3F2319] bg-[#140D0A] px-3 text-sm text-[#F5F1EB] placeholder:text-[#B39463] placeholder:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#D28A4C] has-[option:checked[value='']]:text-[#B39463]"
            id={prefix + '-type'}
            name="walletType"
            defaultValue=""
            required
          >
            <option value="" disabled>
              Selecione uma carteira
            </option>
            <option>MetaMask</option>
            <option>Coinbase Wallet</option>
            <option>Outra</option>
          </select>

          <svg
            className="
                  pointer-events-none
                  absolute
                  right-4.5
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
      </label>
      <label
        className="block text-base font-normal leading-6 text-[#F5F1EB]"
        htmlFor={prefix + '-referral'}
      >
        Código de indicação
        <span className="ml-0.5 text-[22px] leading-6 text-[#F0805F]">*</span>
        <input
          className="block h-10 w-full min-w-0 rounded-[3px] border border-[#3F2319] bg-[#140D0A] px-3 text-sm text-[#F5F1EB] placeholder:text-[#B39463] placeholder:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#D28A4C]"
          id={prefix + '-referral'}
          name="referralCode"
          required
        />
      </label>
      <label
        className="block text-base font-normal leading-6 text-[#F5F1EB]"
        htmlFor={prefix + '-email'}
      >
        E-mail
        <span className="ml-0.5 text-[22px] leading-6 text-[#F0805F]">*</span>
        <input
          className="block h-10 w-full min-w-0 rounded-[3px] border border-[#3F2319] bg-[#140D0A] px-3 text-sm text-[#F5F1EB] placeholder:text-[#B39463] placeholder:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#D28A4C]"
          type="email"
          id={prefix + '-email'}
          name="email"
          required
        />
      </label>
      <div>
        <label
          className="block text-base font-normal leading-6 text-[#F5F1EB]"
          htmlFor={prefix + '-ens'}
        >
          Nome ENS{' '}
          <span className="ml-0.5 text-[22px] leading-6 text-[#F0805F]">*</span>
        </label>
        <div className="flex gap-2 [&_select]:w-20 [&_select]:shrink-0 [&_select]:pl-2.5">
          <select
            className="block h-10 w-full min-w-0 rounded-[3px] border border-[#3F2319] bg-[#140D0A] px-3 text-sm text-[#F5F1EB] placeholder:text-[#B39463] placeholder:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#D28A4C] has-[option:checked[value='']]:text-[#B39463]"
            aria-label="Sufixo ENS"
            name="ensSuffix"
          >
            <option>.eth</option>
          </select>
          <input
            className="block h-10 w-full min-w-0 rounded-[3px] border border-[#3F2319] bg-[#140D0A] px-3 text-sm text-[#F5F1EB] placeholder:text-[#B39463] placeholder:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#D28A4C]"
            id={prefix + '-ens'}
            name="ens"
            required
          />
        </div>
      </div>
    </div>
  )
}

function WalletsRouteComponent() {
  const [secondary, setSecondary] = useState(false)
  const [same, setSame] = useState(false)
  const [message, setMessage] = useState('')
  return (
    <div className="min-h-screen bg-[#140D0A]  **:box-border [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-[3px] [&_button:focus-visible]:outline-[#D28A4C]">
      <Navbar />
      <main className="mx-auto mt-6 flex w-[calc(100%-32px)] max-w-300 flex-col items-start gap-7 pb-24 sm:mt-8 sm:w-[calc(100%-48px)] sm:flex-row">
        <aside className="max-w-77.5 w-full max-h-101.75 h-auto bg-[#241612] pt-4.5 ">
          <h3 className="text-[18px] font-bold leading-4 text-[#F5F1EB] mb-2.5 pl-3.25 ">
            Meu perfil
          </h3>

          <ul className="border-[#D28A4C] border-b-[0.3px]">
            <li className="pl-4.75 h-11.25 ">
              <a className="flex gap-4 items-center text-base leading-11.25 font-normal text-[#E89B55]">
                <span>
                  <svg
                    width="12"
                    height="15"
                    viewBox="0 0 12 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6 1.15385C4.61038 1.15385 3.48387 2.27313 3.48387 3.65385C3.48387 5.03456 4.61038 6.15385 6 6.15385C7.38962 6.15385 8.51613 5.03456 8.51613 3.65385C8.51613 2.27313 7.38962 1.15385 6 1.15385ZM2.32258 3.65385C2.32258 1.63588 3.96902 0 6 0C8.03098 0 9.67742 1.63588 9.67742 3.65385C9.67742 5.67181 8.03098 7.30769 6 7.30769C3.96902 7.30769 2.32258 5.67181 2.32258 3.65385Z"
                      fill="#D28A4C"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.09963 10C2.47683 10 1.16129 11.3071 1.16129 12.9195C1.16129 13.0042 1.17686 13.0639 1.19319 13.0987C1.20697 13.1281 1.21879 13.1365 1.22865 13.1418C1.67991 13.3858 2.94511 13.8462 6 13.8462C9.05489 13.8462 10.3201 13.3858 10.7713 13.1418C10.7812 13.1365 10.793 13.1281 10.8068 13.0987C10.8231 13.0639 10.8387 13.0042 10.8387 12.9195C10.8387 11.3071 9.52317 10 7.90037 10H4.09963ZM0 12.9195C0 10.6699 1.83547 8.84616 4.09963 8.84616H7.90037C10.1645 8.84616 12 10.6699 12 12.9195C12 13.3325 11.8495 13.8725 11.3264 14.1553C10.6335 14.53 9.14689 15 6 15C2.85311 15 1.36654 14.53 0.673589 14.1553C0.150475 13.8725 0 13.3325 0 12.9195Z"
                      fill="#D28A4C"
                    />
                  </svg>
                </span>
                Dados do perfil
              </a>
            </li>
            <li className="pl-3.25 h-11.25 border-l-[6px] border-[#D28A4C]">
              <a className="flex gap-4 items-center text-base leading-11.25 font-normal text-[#E89B55]">
                <span>
                  <svg
                    width="14"
                    height="17"
                    viewBox="0 0 14 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.87557 5.41699C6.0714 5.41699 5.41724 6.07116 5.41724 6.87616C5.41724 7.68033 6.0714 8.33366 6.87557 8.33366C7.67974 8.33366 8.3339 7.68033 8.3339 6.87616C8.3339 6.07116 7.67974 5.41699 6.87557 5.41699M6.87557 9.58366C5.38224 9.58366 4.16724 8.36949 4.16724 6.87616C4.16724 5.38199 5.38224 4.16699 6.87557 4.16699C8.3689 4.16699 9.5839 5.38199 9.5839 6.87616C9.5839 8.36949 8.3689 9.58366 6.87557 9.58366"
                      fill="#B39463"
                    />
                    <mask
                      id="mask0_71529_354"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="14"
                      height="17"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0 0H13.7496V16.25H0V0Z"
                        fill="white"
                      />
                    </mask>
                    <g mask="url(#mask0_71529_354)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.87476 1.25C3.77309 1.25 1.24976 3.7975 1.24976 6.9275C1.24976 10.91 5.93642 14.79 6.87476 14.9967C7.81309 14.7892 12.4998 10.9092 12.4998 6.9275C12.4998 3.7975 9.97642 1.25 6.87476 1.25V1.25ZM6.87476 16.25C5.37976 16.25 -0.000244141 11.6233 -0.000244141 6.9275C-0.000244141 3.1075 3.08392 0 6.87476 0C10.6656 0 13.7498 3.1075 13.7498 6.9275C13.7498 11.6233 8.36976 16.25 6.87476 16.25V16.25Z"
                        fill="#B39463"
                      />
                    </g>
                  </svg>
                </span>
                Carteiras
              </a>
            </li>
            <li className="pl-4.75 h-11.25">
              <a className="flex gap-4 items-center text-base leading-11.25 font-normal text-[#E89B55]">
                <span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.8646 15.1849H7.41669C5.0909 15.1849 3.19871 13.2927 3.19871 10.9669V6.64344C3.19871 4.48137 2.12108 2.48011 0.316103 1.29001C-0.00804932 1.07629 -0.0975409 0.640295 0.11617 0.316143C0.329881 -0.00804446 0.765845 -0.0975712 1.09007 0.11621C2.12045 0.795587 2.95638 1.69163 3.55414 2.72328C3.68332 2.86799 4.72495 3.97205 6.43253 3.97205H14.5278C16.7364 3.93075 18.4651 6.14719 17.8877 8.27903L16.9558 11.9933C16.4843 13.8724 14.802 15.1849 12.8646 15.1849ZM4.42734 4.98088C4.54421 5.52082 4.6047 6.07756 4.6047 6.64344V10.9669C4.6047 12.5174 5.86616 13.7789 7.41669 13.7789H12.8646C14.1562 13.7789 15.2777 12.9039 15.592 11.6512L16.5239 7.93688C16.8671 6.67015 15.8397 5.35354 14.5278 5.37804H6.4325C5.66022 5.37804 4.98801 5.21154 4.42734 4.98088ZM7.06519 17.1181C7.06519 16.6328 6.67176 16.2394 6.18645 16.2394C5.02046 16.2858 5.02147 17.9509 6.18645 17.9968C6.67176 17.9968 7.06519 17.6034 7.06519 17.1181ZM14.06 17.1181C14.06 16.6328 13.6666 16.2394 13.1813 16.2394C12.0153 16.2858 12.0163 17.9509 13.1813 17.9968C13.6666 17.9968 14.06 17.6034 14.06 17.1181ZM15.2308 7.48703C15.2308 7.09877 14.9161 6.78404 14.5278 6.78404H6.71369C5.78096 6.82115 5.78166 8.15323 6.71369 8.19003H14.5278C14.9161 8.19003 15.2308 7.8753 15.2308 7.48703Z"
                      fill="#B39463"
                    />
                  </svg>
                </span>
                Atividade
              </a>
            </li>
            <li className="pl-4.75 h-11.25">
              <a className="flex gap-4 items-center text-base leading-11.25 font-normal text-[#E89B55]">
                <span>
                  <svg
                    width="16"
                    height="15"
                    viewBox="0 0 16 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 14.2349C7.77222 14.2349 7.55261 14.1523 7.38147 14.0024C6.73511 13.4373 6.11194 12.9061 5.56213 12.4376L5.55933 12.4352C3.94739 11.0615 2.55542 9.87524 1.58691 8.70667C0.504272 7.40027 0 6.16162 0 4.80847C0 3.49377 0.450806 2.28088 1.26929 1.39307C2.09753 0.494751 3.23401 0 4.46973 0C5.39331 0 6.23914 0.291992 6.98364 0.867798C7.35938 1.15845 7.69995 1.51416 8 1.92908C8.30017 1.51416 8.64062 1.15845 9.01648 0.867798C9.76099 0.291992 10.6068 0 11.5304 0C12.766 0 13.9026 0.494751 14.7308 1.39307C15.5493 2.28088 16 3.49377 16 4.80847C16 6.16162 15.4958 7.40027 14.4132 8.70654C13.4447 9.87524 12.0529 11.0614 10.4412 12.4349C9.89038 12.9042 9.26624 13.4362 8.61841 14.0027C8.44739 14.1523 8.22766 14.2349 8 14.2349ZM4.46973 0.937256C3.4989 0.937256 2.60706 1.32471 1.95825 2.02832C1.2998 2.74255 0.937134 3.72986 0.937134 4.80847C0.937134 5.94653 1.36011 6.96436 2.30847 8.10864C3.2251 9.21472 4.5885 10.3766 6.16711 11.7219L6.17004 11.7244C6.72192 12.1947 7.34753 12.7279 7.99866 13.2972C8.65369 12.7268 9.28027 12.1927 9.83325 11.7217C11.4117 10.3763 12.775 9.21472 13.6917 8.10864C14.6399 6.96436 15.0629 5.94653 15.0629 4.80847C15.0629 3.72986 14.7002 2.74255 14.0417 2.02832C13.3931 1.32471 12.5011 0.937256 11.5304 0.937256C10.8192 0.937256 10.1663 1.16333 9.58972 1.60913C9.07593 2.00659 8.71802 2.50903 8.50818 2.8606C8.40027 3.04138 8.21033 3.14929 8 3.14929C7.78967 3.14929 7.59973 3.04138 7.49182 2.8606C7.2821 2.50903 6.92419 2.00659 6.41028 1.60913C5.83374 1.16333 5.18079 0.937256 4.46973 0.937256Z"
                      fill="#B39463"
                    />
                  </svg>
                </span>
                Lista de interesse
              </a>
            </li>

            <li className="pl-4.75 h-11.25 ">
              <a className="flex gap-4 items-center text-base leading-11.25 font-normal text-[#E89B55]">
                <span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.10059 10.128L6.34534 7.21123L8.90584 9.22123L11.1026 6.38623"
                      stroke="#B39463"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.6632 0.75C14.4597 0.75 15.1047 1.395 15.1047 2.1915C15.1047 2.98725 14.4597 3.633 13.6632 3.633C12.8667 3.633 12.2217 2.98725 12.2217 2.1915C12.2217 1.395 12.8667 0.75 13.6632 0.75Z"
                      stroke="#B39463"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14.4795 5.93934C14.5792 6.61059 14.625 7.36659 14.625 8.21484C14.625 13.4183 12.891 15.1523 7.6875 15.1523C2.48475 15.1523 0.75 13.4183 0.75 8.21484C0.75 3.01209 2.48475 1.27734 7.6875 1.27734C8.52 1.27734 9.26325 1.32159 9.92475 1.41759"
                      stroke="#B39463"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Ofertas
              </a>
            </li>
            <li className="pl-4.75 h-11.25 ">
              <a className="flex gap-4 items-center text-base leading-11.25 font-normal text-[#E89B55]">
                <span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.10059 10.128L6.34534 7.21123L8.90584 9.22123L11.1026 6.38623"
                      stroke="#B39463"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.6632 0.75C14.4597 0.75 15.1047 1.395 15.1047 2.1915C15.1047 2.98725 14.4597 3.633 13.6632 3.633C12.8667 3.633 12.2217 2.98725 12.2217 2.1915C12.2217 1.395 12.8667 0.75 13.6632 0.75Z"
                      stroke="#B39463"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14.4795 5.93934C14.5792 6.61059 14.625 7.36659 14.625 8.21484C14.625 13.4183 12.891 15.1523 7.6875 15.1523C2.48475 15.1523 0.75 13.4183 0.75 8.21484C0.75 3.01209 2.48475 1.27734 7.6875 1.27734C8.52 1.27734 9.26325 1.32159 9.92475 1.41759"
                      stroke="#B39463"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Arquivos baixados
              </a>
            </li>
            <li className="pl-4.75 h-11.25">
              <a className="flex gap-4 items-center text-base leading-11.25 font-normal text-[#E89B55]">
                <span>
                  <svg
                    width="16"
                    height="15"
                    viewBox="0 0 16 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.875 14.25C3.00418 14.25 1.0925 13.904 0.782644 12.1525C0.472792 10.401 2.45537 7.10806 3.06631 6.02135C5.10943 2.38806 6.49779 0.75 7.875 0.75C9.25221 0.75 10.6406 2.38806 12.6837 6.02135C13.2946 7.10806 15.2772 10.401 14.9674 12.1525C14.6583 13.904 12.7458 14.25 7.875 14.25Z"
                      stroke="#B39463"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.875 4.875V7.79625"
                      stroke="#B39463"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.87187 10.4214H7.87862"
                      stroke="#B39463"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Suporte
              </a>
            </li>
          </ul>

          <div className="pl-4.75 h-11.25">
            <a
              href="#"
              className="flex gap-4 items-center text-base leading-11.25 font-normal text-[#E89B55]"
            >
              <span>
                <svg
                  width="18"
                  height="17"
                  viewBox="0 0 18 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.0266 8.55924H6.99243"
                    stroke="#D28A4C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.5879 6.12939L17.0279 8.55939L14.5879 10.9894"
                    stroke="#D28A4C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.5007 4.81667C12.2257 1.83333 11.1091 0.75 6.6674 0.75C0.749899 0.75 0.749899 2.675 0.749899 8.45833C0.749899 14.2417 0.749899 16.1667 6.6674 16.1667C11.1091 16.1667 12.2257 15.0833 12.5007 12.1"
                    stroke="#D28A4C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Sair
            </a>
          </div>
        </aside>
        <section
          className="w-full min-w-0 flex-1 [&_p]:mt-1 [&_p]:text-sm [&_p]:leading-5 [&_p]:text-[#B39463] [&_form]:mt-8"
          aria-label="Minhas carteiras"
        >
          <header className="flex items-start justify-between gap-3 [&_h1]:m-0 [&_h1]:text-base [&_h1]:leading-5 [&_h1]:font-bold [&_h2]:m-0 [&_h2]:text-base [&_h2]:leading-5 [&_h2]:font-bold">
            <div>
              <h1 className="text-[#F5F1EB]">Carteira principal</h1>
              <p>
                Estas carteiras ficam disponíveis no pagamento e para receber
                NFTs comprados.
              </p>
            </div>
            <button
              type="button"
              className="cursor-pointer whitespace-nowrap border-0 bg-transparent p-0 text-base leading-5 text-[#E89B55]"
              onClick={() =>
                document.getElementById('primary-display')?.focus()
              }
            >
              Adicionar
            </button>
          </header>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              setMessage(
                'Dados validados nesta prévia. O salvamento precisa ser conectado ao servidor.',
              )
            }}
          >
            <WalletFields prefix="primary" />
            <button
              type="submit"
              className="mt-8 block h-10 w-32.75 cursor-pointer rounded-[3px] border-0 bg-[#D28A4C] text-sm font-bold text-[#140D0A] hover:bg-[#E89B55]"
            >
              Salvar carteira
            </button>
            <p className="empty:hidden" role="status">
              {message}
            </p>
          </form>
          <section className="mt-8 [&>header]:flex-wrap min-[901px]:[&>header]:flex-nowrap">
            <header className="flex items-start justify-between gap-3 [&_h1]:m-0 [&_h1]:text-base [&_h1]:leading-5 [&_h1]:font-bold [&_h2]:m-0 [&_h2]:text-base [&_h2]:leading-5 [&_h2]:font-bold">
              <h2 className="text-[#F5F1EB] font-bold text-base leading-4">
                Carteira secundária
              </h2>
              <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap [&_label]:flex [&_label]:items-center [&_label]:gap-2 [&_label]:whitespace-nowrap [&_label]:text-sm">
                <label className="text-[#F5F1EB]">
                  <input
                    className="m-0 h-4 w-4 cursor-pointer appearance-none rounded-full border border-[#D28A4C] checked:bg-[#D28A4C] checked:shadow-[inset_0_0_0_3px_#140D0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D28A4C]"
                    type="checkbox"
                    checked={same}
                    onChange={(event) => {
                      setSame(event.target.checked)
                      setSecondary(false)
                    }}
                  />
                  Igual à carteira principal
                </label>
                <button
                  type="button"
                  className="cursor-pointer whitespace-nowrap border-0 bg-transparent p-0 text-base leading-5 text-[#E89B55]"
                  onClick={() => {
                    setSecondary(true)
                    setSame(false)
                  }}
                >
                  Adicionar
                </button>
              </div>
            </header>
            {same ? (
              <p>A carteira principal será utilizada.</p>
            ) : secondary ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  setMessage(
                    'Carteira secundária validada nesta prévia. O salvamento precisa ser conectado ao servidor.',
                  )
                }}
              >
                <WalletFields prefix="secondary" />
                <button
                  className="mt-8 block h-10 w-32.75 cursor-pointer rounded-[3px] border-0 bg-[#D28A4C] text-sm font-bold text-[#140D0A] hover:bg-[#E89B55]"
                  type="submit"
                >
                  Salvar carteira
                </button>
              </form>
            ) : (
              <p>Você ainda não adicionou uma carteira secundária.</p>
            )}
          </section>
        </section>
      </main>
    </div>
  )
}
